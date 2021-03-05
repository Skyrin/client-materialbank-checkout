import styles from "./UploadPhotoModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import { RouteComponentProps } from "react-router-dom";
import Input from "../Input/Input";

type State = {
  photoName: string;
  file: any;
  isLoading: boolean;
};
type Props = RouteComponentProps;

export class UploadPhotoModal extends React.Component<Props, State> {
  fileInput;
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      photoName: "",
      file: null,
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

  handleImageUpload = (e: any) => {
    this.setState({
      file: URL.createObjectURL(e.target.files[0]),
    });
  };

  triggerInputFile = () => {
    this.fileInput.click();
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
                this.state.file ? styles.hide : ""
              )}
              onClick={this.triggerInputFile}
            >
              Upload Photo
            </label>
            <img className={styles.preview} src={this.state.file} alt="" />
            <span>Image Name</span>

            <Input
              className={styles.inputField}
              placeholder="Image Name"
              value={this.state.photoName}
              type="text"
              onChange={(val: string) => this.setState({ photoName: val })}
            />

            <div className={styles.buttonsContainer}>
              <div className={styles.createButton}>Upload Photo</div>
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
