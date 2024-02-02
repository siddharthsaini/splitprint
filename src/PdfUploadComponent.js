import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

const PdfUploadComponent = () => {
  const [oddDoc, setOddDoc] = useState(null);
  const [evenDoc, setEvenDoc] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleUpload(file).then((uint8Array) => {
      splitPdf(uint8Array);
    });
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
          reject(new Error("Error reading file."));
        };

        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error("Please select a file to upload."));
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

  const printDoc = (pdfBytes) => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");
    newWindow.onload = () => {
      newWindow.print();
    };
  };

  const renderPrintButtons = () => {
    if (oddDoc && evenDoc) {
      return (
        <div>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => printDoc(oddDoc)}
          >
            Print Odd
          </button>
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={() => printDoc(evenDoc)}
          >
            Print Even
          </button>
        </div>
      );
    }
  };

  return (
    <>
      <div className="body m-5">
        <input
          type="file"
          onChange={handleFileChange}
          accept="application/pdf"
        />
      </div>
      {renderPrintButtons()}
    </>
  );
};

export default PdfUploadComponent;
