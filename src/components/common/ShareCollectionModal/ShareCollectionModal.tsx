import styles from "./ShareCollectionModal.module.scss";
import React from "react";
import cn from "classnames";
import { AppContext, AppContextState } from "context/AppContext";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loader from "components/common/Loader/Loader";
import Input from "../Input/Input";
import {
  removeAllCollaborators,
  sendInvitation,
  setPrivate,
  setPublic,
} from "../../../context/CollectionsAPI/api";
import { COLLECTION_URL } from "../../../constants/urls";
import { forOwn, get } from "lodash-es";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import { collectionsGraphqlRequest } from "CollectionsGraphqlClient";

type State = {
  email: string;
  access: string;
  publicLink: string;
  isLoading: boolean;
  changedCollaboratorAccess: any;
  isPublicOverride: boolean;
};
type Props = RouteComponentProps;

class ShareCollectionModal extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      access: "read",
      publicLink: "https://designshop.link",
      isLoading: false,
      changedCollaboratorAccess: {},
      isPublicOverride: null,
    };
  }

  onBackgroundClicked = () => {
    this.closeModal();
  };

  closeModal = () => {
    this.context.requestCollection(this.getCollectionId());
    this.context.closeModal();
  };

  componentDidMount() {
    this.modalTarget = document.querySelector("#shareCollectionId");
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

  updateCollaboratorAccess = async (userId: number, access: string) => {
    const Mutation = `
      mutation setCollaboratorAccess($collectionId: Int!, $userId: Int!, $access: AccessType!) {
        collectionSetCollaboratorAccess(id: $collectionId, userId: $userId, access: $access)
      }
    `;
    const resp = await collectionsGraphqlRequest(this.context, Mutation, {
      collectionId: this.getCollectionId(),
      userId: userId,
      access: access,
    });

    return resp;
  };

  changeAccess = (e: any) => {
    this.setState({
      access: e.target.value,
    });
  };

  changeCollaboratorAccess = (userId: number, access: string) => {
    this.setState({
      changedCollaboratorAccess: {
        ...this.state.changedCollaboratorAccess,
        [userId]: access,
      },
    });
  };

  getCollectionId = () => {
    const collectionPageResult = matchPath(this.props.location.pathname, {
      path: COLLECTION_URL,
      exact: true,
    });
    const id = get(collectionPageResult, "params.collection_id");
    if (id) {
      return parseInt(id);
    }
    return;
  };

  getCollection() {
    return this.context.collection;
  }

  submitInvitation = async (e: any) => {
    const collectionId = this.getCollectionId();
    if (collectionId) {
      await setPublic(this.context, collectionId);
      const resp = await sendInvitation(
        this.context,
        collectionId,
        this.state.email,
        this.state.access
      );
      console.log("send invite response", resp);
      this.closeModal();
    }
  };

  submit = async () => {
    let collectionId = this.getCollectionId();
    // If the collection became private, only call the collectionSetPrivate mutation
    if (
      this.getCollection().isPublic &&
      this.state.isPublicOverride === false
    ) {
      await removeAllCollaborators(this.context, collectionId);
      await setPrivate(this.context, collectionId);
      this.closeModal();
      return;
    }

    if (!this.getCollection().isPublic && this.state.isPublicOverride) {
      await setPublic(this.context, collectionId);
    }

    forOwn(this.state.changedCollaboratorAccess, async (access, userId) => {
      await this.updateCollaboratorAccess(parseInt(userId), access);
    });
    this.closeModal();
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
            onChange={this.changeAccess}
          >
            {accessType.map((access) => {
              return (
                <option
                  value={access.accessType}
                  key={`invite_access_${access.role}`}
                >
                  {access.role}
                </option>
              );
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

    const collection = this.getCollection();
    return (
      <React.Fragment>
        <div className={styles.subTitle}>
          {" "}
          Adjust sharing settings for collaborators
        </div>
        <div className={styles.collaborators}>
          {collection.collaborators &&
            collection.collaborators.map((collaborator: any) => {
              return (
                <div
                  className={styles.collaboratorsContainer}
                  key={`collaborator_${collaborator.userId}`}
                >
                  <div className={styles.collaboratorsInfo}>
                    {collaborator.profileImage ? (
                      <img src={collaborator.imagePath} alt="" />
                    ) : (
                      <div
                        className={styles.userInitials}
                        key={`collaborator_${collaborator.userId}`}
                      >
                        {`${collaborator.firstName
                          .charAt(0)
                          .toUpperCase()}${collaborator.lastName
                          .charAt(0)
                          .toUpperCase()}`}
                      </div>
                    )}
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
                    <select
                      value={
                        this.state.changedCollaboratorAccess[
                          collaborator.userId
                        ] || collaborator.access
                      }
                      className={styles.emailDropdown}
                      onChange={(e) => {
                        this.changeCollaboratorAccess(
                          collaborator.userId,
                          e.target.value
                        );
                      }}
                    >
                      {accessType.map((access) => {
                        return (
                          <option
                            value={access.accessType}
                            key={`c_${collaborator.userId}_${access.role}`}
                          >
                            {access.role}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              );
            })}
        </div>
      </React.Fragment>
    );
  };

  renderSharingSection = () => {
    const isPublic =
      this.state.isPublicOverride !== null
        ? this.state.isPublicOverride
        : this.getCollection().isPublic;
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
          onClick={() => this.setState({ isPublicOverride: !isPublic })}
          className={cn(styles.subTitle, styles.makePrivate)}
        >
          {isPublic ? (
            <React.Fragment>
              <i className="far fa-lock-open"></i>
              Make this collection private and remove collaborators
            </React.Fragment>
          ) : (
            <React.Fragment>
              <i className="far fa-lock"></i>
              Make this collection public
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
              <div className={styles.createButton} onClick={this.submit}>
                Save Changes
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

export default withRouter(ShareCollectionModal);
