import React, { useCallback,useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { io } from "socket.io-client";
import { useParams } from "react-router";
import axios from 'axios';
const SAVE_INTERVAL_MS = 1000

const TOOLBAR_OPTIONS = [
 [{ header: [1, 2, 3, 4, 5, 6, false] }],
 [{ font: [] }],
 [{ list: "ordered" }, { list: "bullet" }],
 ["bold", "italic", "underline"],
 [{ color: [] }, { background: [] }],
 [{ script: "sub" }, { script: "super" }],
 [{ align: [] }],
 ["image", "blockquote", "code-block"],
 ["clean"],
]

export default function TextEditor() {
 const{id:documentId}=useParams();
 const [socket, setSocket] = useState()
 const [quill, setQuill] = useState()
  // useEffect(() => {
  //   async function saveDb() {
  //     const data = await axios.post("http://localhost:5000/user/saveDb", {
  //       id,
  //     }, 
  //   {
  //     headers: {
  //       Authorization: "Bearer " + localStorage.getItem("user__token"),
  //     },
  //   });
  //   };
  //   saveDb();
  // })

 useEffect(() => {
   const s=io(`${import.meta.env.VITE_SOCKET}`)
   setSocket(s);
   return () => {
     s.disconnect();
   }
 }, [])

 useEffect(() => {
  if (socket == null || quill == null) return
  
  socket.once("load-document", document => {
    console.log(document);
    // document.data = "set me
    quill.enable()
    quill.setContents(document);
    // document.ops[0].insert = "set me";
  })
  socket.emit("get-document", {documentId})

}, [socket, quill, documentId])


useEffect(() => {
 if (socket == null || quill == null) return

 const interval = setInterval(() => {
   socket.emit("save-document", quill.getContents())
 }, SAVE_INTERVAL_MS)

 return () => {
   clearInterval(interval)
 }
}, [socket, quill])

 useEffect(() => {
  if (socket == null || quill == null) return

  const handler = delta => {
    quill.updateContents(delta)
  }
  socket.on("receive-changes", handler)

  return () => {
    socket.off("receive-changes", handler)
  }
}, [socket, quill])


 useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])


 const wrapperRef = useCallback(wrapper => {
  if (wrapper == null) return

  wrapper.innerHTML = ""
  const editor = document.createElement("div")
  wrapper.append(editor)
  const q=new Quill(editor, {
    theme: "snow",
    modules: { toolbar: TOOLBAR_OPTIONS }
  })
  q.disable()
  q.setText("Loading...");
  setQuill(q);

}, [])

return <div className="container" ref={wrapperRef}></div>
}
