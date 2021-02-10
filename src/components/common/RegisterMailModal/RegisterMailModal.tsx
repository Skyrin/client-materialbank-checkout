import styles from "./RegisterMailModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Input from "components/common/Input/Input";
import { RouteComponentProps } from "react-router-dom";

const REGISTER_EMAIL_CONTENT_ID = "registerContentId";

type State = {
  register: {
    email: string;
    password: string;
  };

  registerErrors: {
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
        email: "",
        password: "",
      },
      registerErrors: {
        email: null,
        password: null,
      },
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
          </div>
        </div>
      </div>
    );
  }

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
