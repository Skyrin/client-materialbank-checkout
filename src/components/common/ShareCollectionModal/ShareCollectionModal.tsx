import styles from "./ShareCollectionModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import { RouteComponentProps } from "react-router-dom";
import Input from "../Input/Input";

type State = {
  email: string;
  publicLink: string;
  collaborators: {}[];
  isPrivate: boolean;
  isSharedWith: boolean;
  isLoading: boolean;
};
type Props = RouteComponentProps;

export class ShareCollectionModal extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      email: null,
      publicLink: null,
      collaborators: [],
      isPrivate: false,
      isSharedWith: true,
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
    this.modalTarget = document.querySelector("#shareCollectionId");
    this.disableWindowsScroll();
    this.context.getCollaborators().then((collaborators: any) => {
      this.setState({ collaborators });
    });
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

  renderEmailSection = () => {
    return (
      <React.Fragment>
        <div className={styles.subTitle}>
          {" "}
          Enter email address to invite someone new
        </div>
        <Input
          className={styles.inputField}
          placeholder="name@email.com"
          value={this.state.email}
          type="text"
          onChange={(val: string) => this.setState({ email: val })}
        />
        <div className={styles.sendInviteButton}>Send Invite</div>
      </React.Fragment>
    );
  };

  renderCollaboratorsSection = () => {
    return (
      <React.Fragment>
        <div className={styles.subTitle}>
          {" "}
          Adjust sharing settings for collaborators
        </div>
        <div className={styles.collaborators}>
          {this.state.collaborators.map((collaborator: any) => {
            return (
              <div className={styles.collaboratorsContainer}>
                <img src={collaborator.imagePath} />
                <div>
                  <span className={styles.collaboratorName}>
                    {collaborator.firstName + " " + collaborator.lastName}
                    {collaborator.isAuthenticated === true ? " (You)" : null}
                  </span>
                  <span className={styles.collaboratorEmail}>
                    {collaborator.email}
                  </span>
                </div>
                <i className="fas fa-check-circle"></i>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  };

  renderSharingSection = () => {
    return (
      <React.Fragment>
        <div className={styles.title}> Create a public link</div>
        <div className={styles.subTitle}>
          {" "}
          Anyone who has this link can view this board
        </div>
        <div className={styles.inputBox}>
          <Input
            className={styles.inputField}
            placeholder="https://designshop.link"
            value={this.state.publicLink}
            type="text"
            onChange={(val: string) => this.setState({ publicLink: val })}
          />
          <div
            onClick={() => {
              navigator.clipboard.writeText(this.state.publicLink);
            }}
            className={styles.copyButton}
          >
            Copy
          </div>
        </div>
        <div
          onClick={() => this.setState({ isPrivate: !this.state.isPrivate })}
          className={cn(styles.subTitle, styles.makePrivate)}
        >
          {this.state.isPrivate ? (
            <React.Fragment>
              <i className="far fa-lock"></i>
              Make this collection public
            </React.Fragment>
          ) : (
            <React.Fragment>
              <i className="far fa-lock-open"></i>
              Make this collection private and remove collaborators
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
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
        <div id={"shareCollectionId"} className={styles.modalBox}>
          <div className={styles.closeButton} onClick={this.closeModal}>
            <i className="far fa-times"></i>
          </div>
          <div className={styles.modalContent}>
            <div className={styles.title}> Share Collection</div>
            {this.renderEmailSection()}
            <div className="horizontal-divider-toolbar" />
            {this.renderCollaboratorsSection()}
            <div className="horizontal-divider-toolbar" />
            {this.renderSharingSection()}
            <div className={styles.buttonsContainer}>
              <div className={styles.createButton}>Save Changes</div>
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
