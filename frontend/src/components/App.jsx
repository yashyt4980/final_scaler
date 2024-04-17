import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Upload from "./Upload";
import TextEditor from "./TextEditor";
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/uploads" element={<Upload />} />
          <Route
            path="/createDocument"
            element={<Navigate to={`/documents/${uuidV4()}`} />}
          />
          <Route path="/documents/:id" element={<TextEditor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
