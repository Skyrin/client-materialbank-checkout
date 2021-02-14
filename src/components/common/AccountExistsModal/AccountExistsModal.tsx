import React from "react";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { RouteComponentProps } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import cn from "classnames";
import styles from "./AccountExistsModal.module.scss";
import Input from "components/common/Input/Input";

type Props = RouteComponentProps;
const ACCOUNT_EXISTS_CONTENT_ID = "accountExistsContentId";

type State = {
  login: {
    password: string;
  };
  loginRequestError: string;
  loginErrors: {
    password: string | null;
  };
  isLoading: boolean;
};

export class AccountExistsModal extends React.Component<any, State> {
  static contextType = AppContext;
  context!: AppContextState;

  modalTarget = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      login: {
        password: "",
      },
      loginErrors: {
        password: null,
      },
      loginRequestError: "",
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
            <div className={styles.subtitle}>
              Looks like you already have an account. Sign in instead.
            </div>

            <div className={styles.userAvatar} />
            <div className={styles.userName}>John Smith</div>
            <div className={styles.userEmail}>john.smith@gmail.com</div>

            <Input
              className={styles.inputField}
              placeholder="Password"
              value={this.state.login.password}
              type="password"
              onChange={(val: string) => {
                this.updatePassword(val);
              }}
              error={this.state.loginErrors.password}
            />

            <button className={styles.signInButton} onClick={() => {}}>
              Sign In
            </button>

            <button className={styles.forgotPassword}>Forgot Password?</button>
            <div className="horizontal-divider margin-top-big" />
            <button className={styles.forgotPassword}>
              Sign in with a different account
            </button>
          </div>
        </div>
      </div>
    );
  }

  updatePassword = (value: string) => {
    this.setState({
      login: {
        password: value,
      },
      loginErrors: {
        password: null,
      },
    });
  };
}
