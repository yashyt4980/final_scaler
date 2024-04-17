const mongoose = require("mongoose");
const Document = require("./Document");

mongoose.connect("mongodb://localhost/google-docs-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});


const io = require("socket.io")(5001, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

var defaultValue = "";

io.on("connection", socket => {
  console.log("connected");
  socket.on("get-document", async ({documentId}) => {
    // console.log(content);
    const document = await findOrCreateDocument(documentId);
    // console.log(document);
    // console.log(document.data);
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
  // console.log(content);
// 
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}
