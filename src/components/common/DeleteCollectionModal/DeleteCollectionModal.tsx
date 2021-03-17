import styles from "./DeleteCollectionModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import { get } from "lodash-es";
import { COLLECTION_URL, COLLECTIONS_URL } from "../../../constants/urls";
import { deleteCollection } from "../../../context/CollectionsAPI/api";

type State = {
  isLoading: boolean;
  collections: any;
};
type Props = RouteComponentProps;

class DeleteCollectionModal extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: false,
      collections: null,
    };
  }

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.openModal(Modals.None);
  };

  componentDidMount() {
    this.modalTarget = document.querySelector("#deleteCollectionId");
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

  submit = async () => {
    const collectionId = parseInt(this.getCollectionId());
    if (collectionId) {
      const resp = await deleteCollection(this.context, collectionId);
      console.log("delete response", resp);
      let collections = await this.context.requestCollections({
        limit: 100,
        offset: 0,
      });
      const newCollections = collections.filter(
        (collection) => collection.id !== collectionId
      );
      this.setState({
        collections: newCollections,
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
        <div id={"deleteCollectionId"} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal}>
            <i className="far fa-times"></i>
          </div>
          <div className={styles.modalContent}>
            <div className={styles.title}>
              Are you sure you want to delete this collection?
            </div>
            <div className="horizontal-divider-toolbar"></div>
            <div className={styles.buttonsContainer}>
              <div className={styles.createButton} onClick={this.submit}>
                Delete Collection
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

export default withRouter(DeleteCollectionModal);
