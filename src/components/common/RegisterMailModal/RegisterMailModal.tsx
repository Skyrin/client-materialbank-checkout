import styles from "./RegisterMailModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Input from "components/common/Input/Input";
import Checkbox from "components/common/Checkbox/Checkbox";
import {
  PasswordCheckService,
  PasswordCheckStrength,
} from "components/common/PasswordCheckService/PasswordCheckService";
import { extractErrors } from "utils/forms";
import * as yup from "yup";
import { PASSWORD_REGEX } from "constants/general";
import Loader from "components/common/Loader/Loader";
import { ClientError } from "GraphqlClient";
import { CreateCustomerInput } from "context/CustomerAPI/models";

const REGISTER_EMAIL_CONTENT_ID = "registerContentId";
const ACCOUNT_ALREADY_EXISTS =
  "A customer with the same email address already exists in an associated website.";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Email must be valid.").required("Required"),
  acceptTerms: yup.bool().oneOf([true], "Field must be checked"),
  password: yup
    .string()
    .matches(
      PASSWORD_REGEX,
      "Password must be at least 8 characters and contain an uppercase letter, a lowercase one and a special character."
    )
    .required("Required"),
});

type State = {
  register: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    acceptTerms: boolean;
  };
  passwordStrength: PasswordCheckStrength;
  registerRequestError: string;
  registerErrors: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    acceptTerms: string | null;
  };
  isLoading: boolean;
};

type Props = {
  onAccountExistsError: (createCustomerInput: CreateCustomerInput) => void;
};

export class RegisterMailModal extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      register: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        acceptTerms: false,
      },
      registerRequestError: "",
      passwordStrength: PasswordCheckStrength.None,
      registerErrors: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        acceptTerms: null,
      },
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
    this.modalTarget = document.querySelector("#" + REGISTER_EMAIL_CONTENT_ID);
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

  renderPasswordCheck = () => {
    return (
      <div className={styles.passwordCheckContainer}>
        {new Array(8).fill(0).map((_, index) => (
          <div
            className={cn(
              styles.passwordStep,
              {
                [styles.red]:
                  index < 2 &&
                  this.state.passwordStrength === PasswordCheckStrength.Short,
              },
              {
                [styles.orange]:
                  index < 4 &&
                  this.state.passwordStrength === PasswordCheckStrength.Common,
              },
              {
                [styles.lightOrange]:
                  index < 6 &&
                  this.state.passwordStrength === PasswordCheckStrength.Weak,
              },
              {
                [styles.green]:
                  index < 7 &&
                  this.state.passwordStrength === PasswordCheckStrength.Ok,
              },
              {
                [styles.blue]:
                  index <= 8 &&
                  this.state.passwordStrength === PasswordCheckStrength.Strong,
              }
            )}
            key={index}
          />
        ))}
      </div>
    );
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
        <div id={REGISTER_EMAIL_CONTENT_ID} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal} />
          <div className={styles.modalContent}>
            <div className={styles.title}>Register a New Account</div>
            <form onSubmit={this.register}>
              <Input
                className={styles.inputField}
                placeholder="First Name"
                value={this.state.register.firstName}
                onChange={(val: string) => {
                  this.updateField("firstName", val);
                }}
                error={this.state.registerErrors.firstName}
              />
              <Input
                className={styles.inputField}
                placeholder="Last Name"
                value={this.state.register.lastName}
                onChange={(val: string) => {
                  this.updateField("lastName", val);
                }}
                error={this.state.registerErrors.lastName}
              />
              <Input
                className={styles.inputField}
                placeholder="Email"
                value={this.state.register.email}
                onChange={(val: string) => {
                  this.updateField("email", val);
                }}
                error={this.state.registerErrors.email}
              />
              <Input
                className={styles.inputField}
                placeholder="Password"
                value={this.state.register.password}
                type="password"
                onChange={(val: string) => {
                  this.passwordFieldUpdated(val);
                }}
                error={this.state.registerErrors.password}
              />

              {this.renderPasswordCheck()}

              <div className="row center-vertically center-horizontally margin-top-big">
                <Checkbox
                  black={true}
                  value={this.state.register.acceptTerms}
                  onChange={(value) => {
                    this.acceptTermsChange(value);
                  }}
                />
                <div className={styles.acceptTermsHint}>
                  I accept the&nbsp;
                  <a href="/" className={styles.inlineLink}>
                    <span>Terms of Service</span>
                  </a>
                  &nbsp;and&nbsp;
                  <a href="/" className={styles.inlineLink}>
                    <span>Privacy Policy</span>
                  </a>
                </div>
              </div>

              {this.state.registerErrors.acceptTerms && (
                <div className={styles.acceptTermsError}>
                  Required to accept Terms of Service
                </div>
              )}

              {this.state.registerRequestError && (
                <div className={styles.registerAlert}>
                  <i
                    className={cn(
                      "fas",
                      "fa-exclamation-triangle",
                      styles.errorIcon
                    )}
                  />
                  {this.state.registerRequestError}
                </div>
              )}

              <button className={styles.registerButton} type="submit">
                Register
              </button>
            </form>
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

  acceptTermsChange = (value: boolean) => {
    this.setState({
      register: {
        ...this.state.register,
        acceptTerms: value,
      },
      registerErrors: {
        ...this.state.registerErrors,
        acceptTerms: null,
      },
    });
  };

  register = (e) => {
    e.preventDefault();

    if (this.validateRegisterForm()) {
      this.setState({
        isLoading: true,
      });

      this.context
        .createCustomer({
          email: this.state.register.email,
          firstname: this.state.register.firstName,
          lastname: this.state.register.lastName,
          password: this.state.register.password,
        })
        .then(() => {
          this.setState({
            isLoading: false,
          });
          this.closeModal();
        })
        .catch((error: ClientError) => {
          console.log(error);
          this.setState({
            isLoading: false,
          });

          //TODO: Find a better way to check
          if (error.graphqlErrors[0]?.message === ACCOUNT_ALREADY_EXISTS) {
            this.props.onAccountExistsError({
              email: this.state.register.email,
              firstname: this.state.register.firstName,
              lastname: this.state.register.lastName,
              password: this.state.register.password,
            });
          } else {
            let errorMessage = error.graphqlErrors[0]?.message
              ? error.graphqlErrors[0].message
              : error.message;
            this.setState({
              registerRequestError: errorMessage,
            });
          }
        });
    }
  };

  passwordFieldUpdated = (values: string) => {
    const passwordChecker = new PasswordCheckService();
    console.log(passwordChecker.checkPasswordStrength(values));
    this.setState({
      passwordStrength: passwordChecker.checkPasswordStrength(values),
    });
    this.updateField("password", values);
  };

  updateField = (fieldName: string, value: string) => {
    this.setState({
      register: {
        ...this.state.register,
        [fieldName]: value,
      },
      registerErrors: {
        ...this.state.registerErrors,
        [fieldName]: null,
      },
    });
  };

  validateRegisterForm = () => {
    try {
      registerSchema.validateSync(this.state.register, {
        abortEarly: false,
      });
      return true;
    } catch (e) {
      const errors = extractErrors(e);
      this.setState({
        registerErrors: {
          ...this.state.registerErrors,
          ...errors,
        },
      });
      return false;
    }
  };
}
