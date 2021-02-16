import React from "react";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import cn from "classnames";
import styles from "./AccountExistsModal.module.scss";
import Input from "components/common/Input/Input";
import { CreateCustomerInput } from "context/CustomerAPI/models";
import { PASSWORD_REGEX } from "constants/general";
import * as yup from "yup";
import { extractErrors } from "utils/forms";
import { ClientError } from "GraphqlClient";
import Loader from "components/common/Loader/Loader";

const ACCOUNT_EXISTS_CONTENT_ID = "accountExistsContentId";

const loginSchema = yup.object().shape({
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
    password: string;
  };
  loginRequestError: string;
  loginErrors: {
    password: string | null;
  };
  isLoading: boolean;
};

type Props = {
  createCustomerInput: CreateCustomerInput;
};

export class AccountExistsModal extends React.Component<Props, State> {
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
            <div className={styles.userName}>
              {this.props.createCustomerInput.firstname}&nbsp;
              {this.props.createCustomerInput.lastname}
            </div>
            <div className={styles.userEmail}>
              {this.props.createCustomerInput.email}
            </div>

            {this.state.loginRequestError && (
              <div className={styles.loginAlert}>
                <i
                  className={cn(
                    "fas",
                    "fa-exclamation-triangle",
                    styles.errorIcon
                  )}
                />
                {this.state.loginRequestError}
              </div>
            )}

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

            <button className={styles.signInButton} onClick={this.signInClick}>
              Sign In
            </button>

            <button className={styles.forgotPassword}>Forgot Password?</button>
            <div className="horizontal-divider margin-top-big" />
            <button
              className={styles.forgotPassword}
              onClick={this.signInDifferentAccount}
            >
              Sign in with a different account
            </button>
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

  signInClick = () => {
    this.setState({
      loginRequestError: "",
    });
    if (this.validateLoginForm()) {
      this.setState({
        isLoading: true,
      });
      this.context
        .login(this.props.createCustomerInput.email, this.state.login.password)
        .then(() => {
          this.setState({
            isLoading: false,
          });
          this.context.openModal(Modals.None);
        })
        .catch((error: ClientError) => {
          let errorMessage = error.graphqlErrors[0]?.message
            ? error.graphqlErrors[0].message
            : error.message;
          this.setState({
            isLoading: false,
            loginRequestError: errorMessage,
          });
        });
    }
  };

  signInDifferentAccount = () => {
    this.context.openModal(Modals.Login);
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
}
