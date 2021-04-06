import styles from "./CreateCollectionModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import { RouteComponentProps } from "react-router-dom";

type State = {
  collectionName: string;
  isLoading: boolean;
};
type Props = RouteComponentProps;

export class CreateCollectionModal extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      collectionName: "",
      isLoading: false,
    };
  }

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.closeModal();
  };

  componentDidMount() {
    this.modalTarget = document.querySelector("#createCollectionId");
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

  submitOnEnter = (e: any) => {
    if (e.key === "Enter") {
      this.createCollection();
    } else if (e.key === "Escape") {
      this.closeModal();
    }
  };

  createCollection = async () => {
    await this.context.createCollection({
      name: this.state.collectionName,
      isPublic: false,
    });
    this.closeModal();
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
        <div id={"createCollectionId"} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal}>
            <i className="far fa-times"></i>
          </div>
          <div className={styles.modalContent}>
            <div className={styles.title}>Create a Collection</div>
            <div className="horizontal-divider-toolbar"></div>
            <span>Collection Name</span>
            <input
              className={styles.inputField}
              placeholder="Collection Name"
              value={this.state.collectionName}
              type="text"
              onChange={(e: any) =>
                this.setState({ collectionName: e.target.value })
              }
              onKeyDown={this.submitOnEnter}
            />
            <div className={styles.buttonsContainer}>
              <div
                className={styles.createButton}
                onClick={this.createCollection}
              >
                Create Collection
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
