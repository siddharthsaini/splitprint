import UploadBox from "./UploadBox";
import "./../styles/upload-container.scss";

const UploadContainer = () => {
  return (
    <div>
      <div className="c-upload-container">
        <div className="c-upload-container__heading">
          <div>splitprint</div>
          <div className="m-color-red">.pdf</div>
        </div>
        <p>
          split your .pdf into odd / even pages for easy manual duplex printing
        </p>
        <UploadBox />
      </div>
    </div>
  );
};

export default UploadContainer;
