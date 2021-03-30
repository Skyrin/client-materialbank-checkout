import styles from "./DuplicateCollectionModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import { get } from "lodash-es";
import { duplicateCollection } from "../../../context/CollectionsAPI/api";
import { COLLECTION_URL, COLLECTIONS_URL } from "../../../constants/urls";

type State = {
  collectionName: string;
  isLoading: boolean;
};
type Props = RouteComponentProps;

class DuplicateCollectionModal extends React.Component<Props, State> {
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
    this.modalTarget = document.querySelector("#duplicateCollectionId");
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
  getCollectionId = () => {
    const collectionPageResult = matchPath(this.props.location.pathname, {
      path: COLLECTION_URL,
      exact: true,
    });
    return get(collectionPageResult, "params.collection_id");
  };

  submitOnEnter = (e: any) => {
    if (e.key === "Enter") {
      this.submit();
    } else if (e.key === "Escape") {
      this.closeModal();
    }
  };

  submit = async () => {
    const collectionId = parseInt(this.getCollectionId());
    if (collectionId) {
      const resp = await duplicateCollection(
        this.context,
        collectionId,
        this.state.collectionName
      );
      console.log("duplicate response", resp);
      await this.context.requestCollections({
        limit: 100,
        offset: 0,
      });
      this.closeModal();
      this.props.history.push(COLLECTIONS_URL);
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
        <div id={"duplicateCollectionId"} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal}>
            <i className="far fa-times"></i>
          </div>
          <div className={styles.modalContent}>
            <div className={styles.title}>Duplicate this Collection</div>
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
              <div className={styles.createButton} onClick={this.submit}>
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

export default withRouter(DuplicateCollectionModal);
