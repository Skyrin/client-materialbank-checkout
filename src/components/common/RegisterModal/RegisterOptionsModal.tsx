import styles from "./RegisterOptionsModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const REGISTER_CONTENT_ID = "loginContentId";

export class RegisterOptionsModal extends React.Component<any, any> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.openModal(Modals.None);
  };

  componentDidMount() {
    this.modalTarget = document.querySelector("#" + REGISTER_CONTENT_ID);
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
        <div id={REGISTER_CONTENT_ID} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal} />
          <div className={styles.modalContent}></div>
        </div>
      </div>
    );
  }
}
