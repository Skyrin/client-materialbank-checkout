import styles from "./RegisterOptionsModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import LoginGoogle from "components/common/LoginGoogle/LoginGoogle";
import LoginFacebook from "components/common/LoginFacebook/LoginFacebook";

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
          <div className={styles.modalContent}>
            <div className={styles.title}>Register a New Account</div>

            <LoginFacebook
              buttonText={"Continue with Facebook"}
              className={styles.signInWithButton}
              hasIcon={true}
            />

            <LoginGoogle
              className={styles.signInWithButton}
              buttonProp={
                <div className={cn(styles.signInWithButton)}>
                  <div className={cn("fab", "fa-google", styles.icon)} />
                  {"Connect with Google"}
                </div>
              }
            />

            <div className={styles.signInWithButton}>
              <div className={cn("fab", "fa-apple", styles.icon)} />
              Continue with Apple
            </div>

            <div
              className={styles.signInWithButton}
              onClick={this.continueWithEmailClick}
            >
              <div className={cn("fas", "fa-envelope", styles.icon)} />
              Continue with Email
            </div>

            <div className={cn("horizontal-divider", styles.separator)} />

            <div className="row center-horizontally margin-top">
              <div className={styles.signInHint}>Already have an account?</div>
              <button className={styles.signIn} onClick={this.signInClick}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  signInClick = () => {
    this.context.openModal(Modals.Login);
  };

  continueWithEmailClick = () => {
    this.context.openModal(Modals.RegisterEmail);
  };
}
