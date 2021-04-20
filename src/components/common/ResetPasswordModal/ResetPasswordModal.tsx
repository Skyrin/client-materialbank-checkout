import styles from "./ResetPasswordModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import { RouteComponentProps } from "react-router-dom";
import Input from "../Input/Input";
import { requestPasswordResetEmail } from "../../../context/CustomerAPI/api";

type State = {
  email: string;
  isLoading: boolean;
};
type Props = RouteComponentProps;

export class ResetPasswordModal extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      isLoading: false,
    };
  }

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.openModal(Modals.None);
  };

  componentDidMount() {
    this.modalTarget = document.querySelector("#resetPasswordId");
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

  submit = async () => {
    if (this.state.email) {
      const resp = await requestPasswordResetEmail(
        this.context,
        this.state.email
      );
      console.log("reset response", resp);
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
        <div id={"resetPasswordId"} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal}>
            <i className="far fa-times"></i>
          </div>
          <div className={styles.modalContent}>
            <div className={styles.title}>Reset your password</div>
            <div className="horizontal-divider-toolbar"></div>
            <span>Enter your email address </span>

            <Input
              className={styles.inputField}
              placeholder="Email"
              value={this.state.email}
              type="text"
              onChange={(val: string) => this.setState({ email: val })}
            />

            <div className={styles.buttonsContainer}>
              <div className={styles.createButton} onClick={this.submit}>
                Reset Password
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
