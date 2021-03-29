import styles from "./DeleteItemModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import { get } from "lodash-es";
import { COLLECTION_URL, COLLECTIONS_URL } from "../../../constants/urls";
import { deleteItem } from "../../../context/CollectionsAPI/api";

type State = {
  isLoading: boolean;
  itemId: number;
};
type Props = RouteComponentProps;

class DeleteItemModal extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: false,
      itemId: null,
    };
  }

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.closeModal();
  };

  componentDidMount() {
    this.modalTarget = document.querySelector("#deleteItemId");
    this.disableWindowsScroll();
    this.context.getItemId().then((itemId: any) => {
      this.setState({ itemId });
    });
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

  submit = async (e: any) => {
    console.log(this.context, "aaa");
    const collectionId = parseInt(this.getCollectionId());
    if (collectionId) {
      const resp = await deleteItem(
        this.context,
        collectionId,
        this.context.itemId
      );
      console.log("rename response", resp);
      await this.context.requestCollection(collectionId);
      await this.context.requestCollections({
        limit: 100,
        offset: 0,
      });
      this.context.closeModal();
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
              Are you sure you want to delete this item?
            </div>
            <div className="horizontal-divider-toolbar"></div>
            <div className={styles.buttonsContainer}>
              <div className={styles.createButton} onClick={this.submit}>
                Delete Item
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

export default withRouter(DeleteItemModal);
