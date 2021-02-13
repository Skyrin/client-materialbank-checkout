import React from "react";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { RouteComponentProps } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import cn from "classnames";
import styles from "./AccountExistsModal.module.scss";

type Props = RouteComponentProps;
const ACCOUNT_EXISTS_CONTENT_ID = "accountExistsContentId";

export class AccountExistsModal extends React.Component<any, any> {
  static contextType = AppContext;
  context!: AppContextState;

  modalTarget = null;

  constructor(props: Props) {
    super(props);
  }

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.openModal(Modals.None);
  };

  componentDidMount() {
    this.modalTarget = document.querySelector("#" + ACCOUNT_EXISTS_CONTENT_ID);
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
        <div id={ACCOUNT_EXISTS_CONTENT_ID} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal} />
          <div className={styles.modalContent}>
            <div className={styles.title}>Account Exists</div>
          </div>
        </div>
      </div>
    );
  }
}
