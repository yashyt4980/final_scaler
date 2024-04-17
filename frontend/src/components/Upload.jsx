import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

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
          `${import.meta.env.VITE_SERVER}api/getUrl`,
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
            `${import.meta.env.VITE_SERVER}api/getFileUrl`,
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
              `${import.meta.env.VITE_SERVER}api/extract`,
              {
                url,
                filename: filename,
              },
              {
                headers: {
                  Authorization:
                    "Bearer " + localStorage.getItem("user__token"),
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
    const {
      data: { enrichedText },
    } = await axios.post(
      `${import.meta.env.VITE_SERVER}api/enrich`,
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
    <div
      className="container"
      style={{
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
        backgroundImage:
          "linear-gradient(to right, #ff7e5f, #feb47b, #ffdea2, #ffffff)",
        animation: "bg-animation 20s infinite alternate",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>TextXtend</h1>
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <input
          type="file"
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s, box-shadow 0.3s",
          }}
        >
          Upload
        </button>
        {text && (
          <div
            className="text-container"
            style={{
              marginTop: "20px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            {text}
          </div>
        )}
      </form>
      {text && (
        <button
          className="action-button"
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onClick={enrichText}
        >
          Enrich
        </button>
      )}
      {text && (
        <button
          className="action-button"
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onClick={openEditor}
        >
          Open in Editor
        </button>
      )}
      {loading && (
        <div
          className="loader-container"
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          <Loader />
          <div className="status" style={{ marginTop: "10px" }}>
            {status}
          </div>
        </div>
      )}
      {errorMessage && (
        <p
          className="error-message"
          style={{ color: "#ff0000", marginTop: "10px" }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default Upload;
