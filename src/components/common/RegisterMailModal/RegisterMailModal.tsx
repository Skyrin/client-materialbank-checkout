import styles from "./RegisterMailModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Input from "components/common/Input/Input";
import { RouteComponentProps } from "react-router-dom";
import Checkbox from "components/common/Checkbox/Checkbox";

const REGISTER_EMAIL_CONTENT_ID = "registerContentId";

type State = {
  acceptTerms: boolean;

  register: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  registerErrors: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
  };
};

type Props = RouteComponentProps;

export class RegisterMailModal extends React.Component<any, State> {
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
      },
      registerErrors: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
      },
      acceptTerms: false,
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
              onChange={(val: string) => {
                this.updateField("password", val);
              }}
              error={this.state.registerErrors.password}
            />

            <div className="row center-vertically center-horizontally margin-top-big">
              <Checkbox
                black={true}
                value={this.state.acceptTerms}
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

            <button
              className={styles.registerButton}
              onClick={this.registerClick}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  acceptTermsChange = (value: boolean) => {
    this.setState({
      acceptTerms: value,
    });
  };

  registerClick = () => {};

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
}
