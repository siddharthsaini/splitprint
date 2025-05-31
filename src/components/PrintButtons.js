import React from "react";
import PropTypes from "prop-types";
import "./../styles/print-buttons.scss";

PrintButtons.propTypes = {
  oddDoc: PropTypes.any.isRequired,
  evenDoc: PropTypes.any.isRequired,
  fileName: PropTypes.string.isRequired,
};

function PrintButtons({ oddDoc, evenDoc, fileName }) {
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
            className="btn btn-outline-danger m-2"
            onClick={() => printDoc(oddDoc)}
          >
            print odd
          </button>
          <button
            type="button"
            className="btn btn-outline-danger m-2"
            onClick={() => printDoc(evenDoc)}
          >
            print even
          </button>
        </div>
      );
    }
  };

  return (
    <div>
      {fileName && (
        <div className=".c-print-buttons__file-name">
          <p>{fileName}</p>
        </div>
      )}
      <div>{renderPrintButtons}</div>
    </div>
  );
}

export default PrintButtons;
