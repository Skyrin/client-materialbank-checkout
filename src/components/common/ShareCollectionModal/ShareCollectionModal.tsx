import styles from "./ShareCollectionModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import Input from "../Input/Input";
import Checkbox from "../Checkbox/Checkbox";
import { CollaboratorT } from "../../../constants/types";
import { sendInvitation } from "../../../context/CollectionsAPI/api";
import { COLLECTION_URL } from "../../../constants/urls";
import { get } from "lodash-es";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";

type State = {
  email: string;
  access: string;
  publicLink: string;
  collaborators: CollaboratorT[];
  isPrivate: boolean;
  isLoading: boolean;
};
type Props = RouteComponentProps;

class ShareCollectionModal extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      email: null,
      access: "read",
      publicLink: "https://designshop.link",
      collaborators: [
        {
          id: null,
          firstName: null,
          lastName: null,
          email: null,
          imagePath: null,
          isAuthenticated: null,
          isSharedWith: null,
          access: null,
        },
      ],
      isPrivate: false,
      isLoading: false,
    };
  }

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.closeModal();
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

  handleChange = (event, index) => {
    let collab = this.state.collaborators.map((item) => {
      if (item.id === index) {
        return { ...item, isSharedWith: !item.isSharedWith };
      }
      return item;
    });
    this.setState({ collaborators: collab });
  };

  updateAccess = (e: any) => {
    this.setState({
      access: e.target.value,
    });
  };

  getCollectionId = () => {
    const collectionPageResult = matchPath(this.props.location.pathname, {
      path: COLLECTION_URL,
      exact: true,
    });
    return get(collectionPageResult, "params.collection_id");
  };

  submitInvitation = async (e: any) => {
    const collectionId = parseInt(this.getCollectionId());
    if (collectionId) {
      const resp = await sendInvitation(
        this.context,
        collectionId,
        this.state.email,
        this.state.access
      );
      console.log("send invite response", resp);
    }
  };

  renderEmailSection = () => {
    const accessType = [
      {
        role: "Editor",
        accessType: "write",
      },
      {
        role: "View Only",
        accessType: "read",
      },
    ];
    return (
      <React.Fragment>
        <div className={styles.subTitle}>
          {" "}
          Enter email address to invite someone new
        </div>
        <div className={styles.emailInvite}>
          <Input
            className={styles.inputField}
            placeholder="name@email.com"
            value={this.state.email}
            type="text"
            onChange={(val: string) => this.setState({ email: val })}
          />
          <select
            value={this.state.access}
            className={styles.emailDropdown}
            onChange={this.updateAccess}
          >
            {accessType.map((access) => {
              return <option value={access.accessType}>{access.role}</option>;
            })}
          </select>
        </div>
        <div
          onClick={this.submitInvitation}
          className={styles.sendInviteButton}
        >
          Send Invite
        </div>
      </React.Fragment>
    );
  };

  renderCollaboratorsSection = () => {
    const accessType = [
      {
        role: "Editor",
        accessType: "write",
      },
      {
        role: "View Only",
        accessType: "read",
      },
    ];
    return (
      <React.Fragment>
        <div className={styles.subTitle}>
          {" "}
          Adjust sharing settings for collaborators
        </div>
        <div className={styles.collaborators}>
          {this.state.collaborators &&
            this.state.collaborators.map((collaborator: any) => {
              return (
                <div className={styles.collaboratorsContainer}>
                  <div className={styles.collaboratorsInfo}>
                    <img src={collaborator.imagePath} alt="" />
                    <div>
                      <span className={styles.collaboratorName}>
                        {collaborator.firstName + " " + collaborator.lastName}
                        {collaborator.isAuthenticated ? " (You)" : null}
                      </span>
                      <span className={styles.collaboratorEmail}>
                        {collaborator.email}
                      </span>
                    </div>
                  </div>
                  <div className={styles.checkboxContainer}>
                    {collaborator.isAuthenticated && <span>Owner</span>}
                    {!collaborator.isAuthenticated && (
                      <React.Fragment>
                        <select
                          defaultValue={collaborator.access}
                          className={styles.emailDropdown}
                          onChange={this.updateAccess}
                        >
                          {accessType.map((access) => {
                            return (
                              <option value={access.accessType}>
                                {access.role}
                              </option>
                            );
                          })}
                        </select>
                      </React.Fragment>
                    )}
                  </div>
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
          Anyone who has this link can view this board
        </div>
        <div className={styles.inputBox}>
          <Input
            className={styles.inputField}
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

export default withRouter(ShareCollectionModal);
