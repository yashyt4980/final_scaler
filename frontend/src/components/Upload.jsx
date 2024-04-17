import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import '../styles.css';

function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [text, setText] = useState("");
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFilename(selectedFile.name); // Set the filename
  };

  const openEditor = () => {
    navigate("/createDocument");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      try {
        setLoading(true);
        setStatus("Uploading Document");
        const { data } = await axios.post(
          "http://localhost:5000/api/getUrl",
          {
            filename,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("user__token"),
            },
          }
        );
        const response = await fetch(`${data.uploadUrl}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/octet-stream", // Set content type to binary
            "Content-Disposition": `attachment; filename="${filename}"`, // Set filename in the content disposition header
          },
          body: file, // Send the file as the request body
        });
        setLoading(false);
        setStatus("");
        if (response.ok) {
          setLoading(true);
          setStatus("Extracting Text");
          const {
            data: { url },
          } = await axios.post(
            "http://localhost:5000/api/getFileUrl",
            {
              key: filename,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("user__token"),
              },
            }
          );
          if (url) {
            const {
              data: { data },
            } = await axios.post(
              "http://localhost:5000/api/extract",
              {
                url,
                filename: filename,
              },
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("user__token"),
                },
              }
            );
            setText(`${data.text}`);
            setLoading(false);
            setStatus("");
          } else {
            setErrorMessage("Try after some time");
          }
        } else {
          setErrorMessage("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setErrorMessage("Error uploading file. Please try again later.");
      }
    } else {
      setErrorMessage("No file selected");
    }
  };

  const enrichText = async () => {
    setLoading(true);
    setStatus("Enriching Text");
    const { data: { enrichedText } } = await axios.post(
      "http://localhost:5000/api/enrich",
      {
        text: text,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user__token"),
        },
      }
    );
    setLoading(false);
    setStatus("");
    setText(enrichedText);
  };

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
        {text && <div className="text-container" ref={textRef}>{text}</div>}
        
      </form>
      {text && (
        <button className="action-button" onClick={enrichText}>
          Enrich
        </button>
      )}
      {text && (
        <button className="action-button" onClick={openEditor}>
          Open in Editor
        </button>
      )}
      {loading && (
        <div className="loader-container">
          <Loader />
          <div className="status">{status}</div>
        </div>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Upload;
