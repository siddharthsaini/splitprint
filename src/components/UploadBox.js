import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import uploadLogo from "../media/upload_logo.png";
import PrintButtons from "./PrintButtons";
import "./../styles/upload-box.scss";

function UploadBox() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [oddDoc, setOddDoc] = useState(null);
  const [evenDoc, setEvenDoc] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    setDragActive(false);

    const files = event.target?.files || event.dataTransfer?.files;
    const file = files?.[0];

    if (file.type === "application/pdf") {
      if (file) {
        setFileName(file.name);
      }
      handleUpload(file).then((uint8Array) => {
        splitPdf(uint8Array);
      });
    } else {
      alert("only PDF files are allowed");
    }
  };

  const handleUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          const buffer = reader.result;
          const uint8Array = new Uint8Array(buffer);
          resolve(uint8Array);
        };

        reader.onerror = () => {
          reject(new Error("error reading file"));
        };

        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error("please select a file to upload"));
      }
    });
  };

  const splitPdf = async (selectedFile) => {
    if (selectedFile) {
      const doc = await PDFDocument.load(selectedFile);

      const oddDoc = await PDFDocument.create();
      const evenDoc = await PDFDocument.create();
      const n = doc.getPageCount();

      for (let i = 0; i < n; i++) {
        const targetDoc = i % 2 === 1 ? evenDoc : oddDoc;
        const [copiedPage] = await targetDoc.copyPages(doc, [i]);
        targetDoc.addPage(copiedPage);
      }

      const oddPdfBytes = await oddDoc.save();
      const evenPdfBytes = await evenDoc.save();

      setOddDoc(oddPdfBytes);
      setEvenDoc(evenPdfBytes);
    } else {
      alert("Please upload a PDF file first.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div
      className={`c-upload-box ${dragActive ? "m-drag-over" : ""}`}
      onDrop={handleFileChange}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <img src={uploadLogo} height={180} width={180} alt="logo"></img>
      <div>drag and drop to upload</div>
      <div>or</div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="application/pdf"
        hidden
      />
      <button className="btn btn-danger m-2" onClick={handleBrowseClick}>
        browse file
      </button>
      <PrintButtons oddDoc={oddDoc} evenDoc={evenDoc} fileName={fileName} />
    </div>
  );
}

export default UploadBox;
