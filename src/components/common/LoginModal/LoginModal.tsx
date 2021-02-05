import styles from "./LoginModal.module.scss";
import React from "react";
import cn from "classnames";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { AppContext, AppContextState } from "context/AppContext";
import Input from "components/common/Input/Input";
import { RouteComponentProps } from "react-router-dom";
import Checkbox from "components/common/Checkbox/Checkbox";

type State = {
  login: {
    email: string;
    password: string;
  };
  rememberMe: boolean;
  loginErrors: {
    email: string | null;
    password: string | null;
  };
};

type Props = RouteComponentProps;

export class LoginModal extends React.Component<any, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      login: {
        email: "",
        password: "",
      },
      rememberMe: false,
      loginErrors: {
        email: null,
        password: null,
      },
    };
  }

  componentDidMount() {
    this.modalTarget = document.querySelector("#loginContentId");
    this.disableWindowsScroll();
  }

  componentWillUnmount() {
    this.enableWindowScroll();
  }

  onLoginModalBackgroundClicked = () => {
    this.closeLoginModal();
  };

  closeLoginModal = () => {
    console.log("closing login modal");
    this.context.openLoginModal(false);
  };

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
            this.onLoginModalBackgroundClicked();
          }
        }}
      >
        <div id={"loginContentId"} className={styles.modalBox}>
          <div className={styles.closeButton} />
          <div className={styles.modalContent}>
            <div className={styles.title}>Sign In</div>

            <div className={styles.signInWithButton}>
              <div className={cn("fab", "fa-facebook-f", styles.icon)} />
              Sign in with Facebook
            </div>

            <div className={styles.signInWithButton}>
              <div className={cn("fab", "fa-google", styles.icon)} />
              Sign in with Google
            </div>

            <div className={styles.signInWithButton}>
              <div className={cn("fab", "fa-apple ", styles.icon)} />
              Sign in with Apple
            </div>

            <div className={styles.orSeparator}>
              <div className="horizontal-divider" />
              <div>or</div>
              <div className="horizontal-divider" />
            </div>

            <Input
              className={styles.inputField}
              placeholder="Email"
              value={this.state.login.email}
              onChange={(val: string) => {
                this.updateField("email", val);
              }}
              error={this.state.loginErrors.email}
            />
            <Input
              className={styles.inputField}
              placeholder="Password"
              type="password"
              value={this.state.login.password}
              onChange={(val: string) => {
                this.updateField("password", val);
              }}
              error={this.state.loginErrors.password}
            />

            <div className={styles.rememberShowPass}>
              <div
                className={styles.rememberMeRow}
                onClick={this.rememberMeClick}
              >
                <Checkbox black={true} value={this.state.rememberMe} />
                <div className={styles.rememberMeHint}>Remember me</div>
              </div>

              <div className={styles.showPassword}>Show password</div>
            </div>

            <button className={styles.signInButton}>Sign In</button>
            <button className={styles.forgotPassword}>Forgot Password?</button>
            <div className="horizontal-divider margin-top" />
            <div className="row center-horizontally margin-top">
              <div className={styles.registerHint}>Don't have an account?</div>
              <button className={styles.register}>Register</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  updateField = (fieldName: string, value: string) => {
    this.setState({
      login: {
        ...this.state.login,
        [fieldName]: value,
      },
      loginErrors: {
        ...this.state.loginErrors,
        [fieldName]: null,
      },
    });
  };

  rememberMeClick = () => {
    this.setState({
      rememberMe: !this.state.rememberMe,
    });
  };
}
