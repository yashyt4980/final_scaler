const mongoose = require("mongoose");
const Document = require("./Document");
require("dotenv").config()
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});


const io = require("socket.io")(process.env.PORT, {
  cors: {
    origin: process.env.CLIENT_PORT,
    methods: ["GET", "POST"],
  },
});

var defaultValue = "";

io.on("connection", socket => {
  console.log("connected");
  socket.on("get-document", async ({documentId}) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data }, { new: true, useFindAndModify: false });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}
