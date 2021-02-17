import styles from "./LoginModal.module.scss";
import React from "react";
import cn from "classnames";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import Input from "components/common/Input/Input";
import { RouteComponentProps } from "react-router-dom";
import Checkbox from "components/common/Checkbox/Checkbox";
import { extractErrors } from "utils/forms";
import * as yup from "yup";
import Loader from "components/common/Loader/Loader";
import { ClientError } from "GraphqlClient";
import { PASSWORD_REGEX } from "constants/general";

const loginSchema = yup.object().shape({
  email: yup.string().email("Email must be valid.").required("Required"),
  password: yup
    .string()
    .matches(
      PASSWORD_REGEX,
      "Password must be at least 8 characters and contain an uppercase letter, a lowercase one and a special character."
    )
    .required("Required"),
});

type State = {
  login: {
    email: string;
    password: string;
  };
  rememberMe: boolean;
  showPassword: boolean;
  isLoading: boolean;
  loggingNetworkError: string;
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
      showPassword: false,
      isLoading: false,
      loggingNetworkError: "",
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
    this.context.openModal(Modals.None);
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
          <div className={styles.closeButton} onClick={this.closeLoginModal} />
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

            {this.state.loggingNetworkError && (
              <div className={styles.loginAlert}>
                <i
                  className={cn(
                    "fas",
                    "fa-exclamation-triangle",
                    styles.errorIcon
                  )}
                />
                {this.state.loggingNetworkError}
              </div>
            )}

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
              type={this.state.showPassword ? undefined : "password"}
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

              <div
                className={styles.showPassword}
                onClick={this.showPasswordClick}
              >
                {!this.state.showPassword && "Show password"}
                {this.state.showPassword && "Hide password"}
              </div>
            </div>

            <button className={styles.signInButton} onClick={this.signInClick}>
              Sign In
            </button>
            <button className={styles.forgotPassword}>Forgot Password?</button>
            <div className="horizontal-divider margin-top" />
            <div className="row center-horizontally margin-top">
              <div className={styles.registerHint}>Don't have an account?</div>
              <button className={styles.register} onClick={this.registerClick}>
                Register
              </button>
            </div>
          </div>

          {this.state.isLoading && (
            <Loader
              containerClassName={styles.loaderContainer}
              loaderClassName={styles.loader}
            />
          )}
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

  signInClick = () => {
    this.setState({
      loggingNetworkError: "",
    });
    if (this.validateLoginForm()) {
      this.setState({
        isLoading: true,
      });
      this.context
        .login(this.state.login.email, this.state.login.password)
        .then(() => {
          this.setState({
            isLoading: false,
          });
          this.closeLoginModal();
        })
        .catch((error: ClientError) => {
          let errorMessage = error.graphqlErrors[0]?.message
            ? error.graphqlErrors[0].message
            : error.message;
          this.setState({
            isLoading: false,
            loggingNetworkError: errorMessage,
          });
        });
    }
  };

  showPasswordClick = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  registerClick = () => {
    this.context.openModal(Modals.RegisterOptions);
  };

  validateLoginForm = () => {
    try {
      loginSchema.validateSync(this.state.login, {
        abortEarly: false,
      });
      return true;
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        loginErrors: {
          ...this.state.loginErrors,
          ...errors,
        },
      });
      return false;
    }
  };

  rememberMeClick = () => {
    this.setState({
      rememberMe: !this.state.rememberMe,
    });
  };
}
