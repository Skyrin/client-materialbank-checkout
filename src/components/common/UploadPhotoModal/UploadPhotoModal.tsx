import styles from "./UploadPhotoModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import Input from "../Input/Input";
import { COLLECTION_URL } from "constants/urls";
import { uploadPhoto } from "context/CollectionsAPI/api";
import { get } from "lodash-es";

type State = {
  name: string;
  file: any;
  fileUrl: string;
  fileName: string;
  isLoading: boolean;
};
type Props = RouteComponentProps;

class UploadPhotoModal extends React.Component<Props, State> {
  fileInput;
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      name: "",
      file: null,
      fileUrl: "",
      fileName: "",
      isLoading: false,
    };
    this.fileInput = React.createRef();
  }

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.openModal(Modals.None);
  };

  componentDidMount() {
    this.modalTarget = document.querySelector("#uploadPhotoId");
    this.disableWindowsScroll();
  }

  componentWillUnmount() {
    this.enableWindowScroll();
  }

  enableWindowScroll = () => {
    enableBodyScroll(this.modalTarget);
  };

  disableWindowsScroll = () => {
    disableBodyScroll(this.modalTarget);
  };

  toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  handleImageUpload = async (e: any) => {
    const base64 = await this.toBase64(e.target.files[0]);
    console.log("FILE", e.target.files[0]);
    this.setState({
      file: base64,
      fileUrl: URL.createObjectURL(e.target.files[0]),
      fileName: e.target.files[0].name,
    });
  };

  triggerInputFile = () => {
    this.fileInput.click();
  };

  getCollectionId = () => {
    const collectionPageResult = matchPath(this.props.location.pathname, {
      path: COLLECTION_URL,
      exact: true,
    });
    return get(collectionPageResult, "params.collection_id");
  };

  submit = async () => {
    console.log(this.state);
    const collectionId = this.getCollectionId();
    if (collectionId) {
      const resp = await uploadPhoto(this.context, this.getCollectionId(), {
        file: this.state.file,
        fileName: this.state.fileName,
        name: this.state.name,
      });
      console.log("UPLOAD PHOTO RESPONSE", resp);
      await this.context.requestCollections({
        limit: 100,
        offset: 0,
      });
      this.closeModal();
    }
  };

  render() {
    return (
      <div
        id={"backgroundModalId"}
        className={cn(styles.modalBackground)}
        onClick={(event) => {
          // @ts-ignore
          if (event.target.id === "backgroundModalId") {
            this.onBackgroundClicked();
          }
        }}
      >
        <div id={"uploadPhotoId"} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal}>
            <i className="far fa-times"></i>
          </div>
          <div className={styles.modalContent}>
            <div className={styles.title}>Upload a photo</div>
            <div className="horizontal-divider-toolbar"></div>

            <input
              ref={(fileInput) => (this.fileInput = fileInput)}
              className={styles.hide}
              type="file"
              name="upload-photo"
              onChange={this.handleImageUpload}
            />
            <label
              htmlFor="upload-photo"
              className={cn(
                styles.fileUploadLabel,
                this.state.fileUrl ? styles.hide : ""
              )}
              onClick={this.triggerInputFile}
            >
              Upload Photo
            </label>
            <img className={styles.preview} src={this.state.fileUrl} alt="" />
            <span>Image Name</span>

            <Input
              className={styles.inputField}
              placeholder="Image Name"
              value={this.state.name}
              type="text"
              onChange={(val: string) => this.setState({ name: val })}
            />

            <div className={styles.buttonsContainer}>
              <div className={styles.createButton} onClick={this.submit}>
                Upload Photo
              </div>
              <div className={styles.cancelButton} onClick={this.closeModal}>
                Cancel
              </div>
            </div>
          </div>
        </div>
        {this.state.isLoading && (
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        )}
      </div>
    );
  }
}

export default withRouter(UploadPhotoModal);
