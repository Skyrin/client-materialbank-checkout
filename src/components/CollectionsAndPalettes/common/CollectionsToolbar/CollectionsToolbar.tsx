import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/CollectionsToolbar/CollectionsToolbar.module.scss";
import RoundButtons from "../RoundButtons/RoundButtons";
import ModeButtons from "../ModeButtons/ModeButtons";
import cn from "classnames";
import Collaborators from "../Collaborators/Collaborators";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../../context/AppContext";
import {
  COLLECTION_URL,
  COLLECTIONS_URL,
  PALETTES_URL,
} from "../../../../constants/urls";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import { get } from "lodash-es";
import { renameCollection } from "../../../../context/CollectionsAPI/api";

interface State {
  isOpened: boolean;
  isRenameMode: boolean;
  title: string;
}

interface ToolbarProps {
  history?: any;
  title: string;
  buttons: any;
  activeButtonMode?: any;
  activeButtonDisplay?: any;
  isCollection?: boolean;
  collaborators?: any;
  toggleMode?: any;
  toggleDisplay?: any;
  isPublic?: boolean;
  onCollectionRename?: any;
}

type Props = RouteComponentProps;

class CollectionsToolbar extends React.Component<ToolbarProps & Props, State> {
  wrapperRefDropdown: any;
  wrapperRefRename: any;

  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  shareCollection = () => {
    this.context.openModal(Modals.ShareCollection);
  };

  deleteCollection = () => {
    this.context.openModal(Modals.DeleteCollection);
  };
  duplicateCollection = () => {
    this.context.openModal(Modals.DuplicateCollection);
  };
  makePrivateCollection = () => {
    this.context.openModal(Modals.MakePrivateCollection);
  };

  constructor(props: any) {
    super(props);
    this.state = {
      isOpened: false,
      isRenameMode: false,
      title: this.props.title,
    };
    this.wrapperRefDropdown = React.createRef();
    this.wrapperRefRename = React.createRef();
    this.onClickButtonRedirect = this.onClickButtonRedirect.bind(this);
  }

  renderCollectionsEditDropdown = () => {
    return (
      <React.Fragment>
        <i className="far fa-ellipsis-h"></i>
        <div
          ref={this.wrapperRefDropdown}
          className={cn(
            styles.collectionEditDropdown,
            `${this.state.isOpened ? styles.opened : styles.closed}`
          )}
        >
          <a
            onClick={() => {
              this.setState({ isRenameMode: !this.state.isRenameMode });
            }}
          >
            Rename
          </a>
          <a onClick={this.duplicateCollection}>Duplicate Collection</a>
          <a onClick={this.makePrivateCollection}>Make Private </a>
          <a onClick={this.deleteCollection}>Delete </a>
        </div>
      </React.Fragment>
    );
  };

  renderCollectionCollaborators = () => {
    return <Collaborators collaborators={this.props.collaborators} />;
  };

  onClickButtonRedirect(button: string): any {
    const redirectURLS = {
      collections: COLLECTIONS_URL,
      palettes: PALETTES_URL,
    };
    const currentURL = this.props.history.location.pathname;

    if (redirectURLS[button] === currentURL) return;
    else this.props.history.push(redirectURLS[button]);
  }

  getCollectionId = () => {
    const collectionPageResult = matchPath(this.props.location.pathname, {
      path: COLLECTION_URL,
      exact: true,
    });
    return get(collectionPageResult, "params.collection_id");
  };

  handleRename = () => {
    let updatedTitle = this.state.title;
    this.props.onCollectionRename(updatedTitle);
  };
  handleTitleChange = (e: any) => {
    this.setState({ title: e.target.value });
  };

  handleTitleUpdate = async (e: any) => {
    const collectionId = parseInt(this.getCollectionId());
    let name = this.state.title;
    let isPublic = this.props.isPublic;
    if (collectionId) {
      const resp = await renameCollection(
        this.context,
        collectionId,
        name,
        isPublic
      );
      console.log("rename response", resp);
    }
  };

  submitOnEnter = async (e: any) => {
    await this.handleTitleUpdate(e);
    if (e.key === "Enter") {
      this.setState({ isRenameMode: false, title: this.state.title });
    }
  };

  submitOnClickOutside = async (e: any) => {
    await this.handleTitleUpdate(e);
    this.setState({ isRenameMode: false, title: this.state.title });
  };

  handleClickOutside = (e: any) => {
    if (
      this.props.isCollection &&
      this.wrapperRefDropdown &&
      !this.wrapperRefDropdown.current.contains(e.target)
    ) {
      this.setState({ isOpened: false });
    }
    if (
      this.state.isRenameMode &&
      this.wrapperRefRename &&
      !this.wrapperRefRename.current.contains(e.target)
    ) {
      this.submitOnClickOutside(e);
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    return (
      <div className={styles.toolbarContainer}>
        <div className={styles.toolbarInfo}>
          <div className={styles.titleFlex}>
            {this.state.isRenameMode ? (
              <input
                ref={this.wrapperRefRename}
                className={styles.renameInput}
                value={this.state.title}
                type="text"
                name="Rename"
                onChange={this.handleTitleChange}
                onKeyPress={this.submitOnEnter}
              />
            ) : (
              <div className={styles.title}>{this.state.title}</div>
            )}
            <a
              onClick={() => this.setState({ isOpened: !this.state.isOpened })}
            >
              {this.props.isCollection && this.renderCollectionsEditDropdown()}
            </a>
          </div>
          {this.props.isCollection && (
            <div className={styles.collaborators}>
              {this.props.collaborators ? (
                this.renderCollectionCollaborators()
              ) : (
                <div className={styles.collaborators}>
                  <a>Share this collection</a>
                  <a onClick={this.shareCollection}>
                    <i className="fas fa-share contributors-share"></i>
                  </a>
                </div>
              )}
            </div>
          )}
          {this.props.isCollection && (
            <React.Fragment>
              <a
                className={styles.floatingShare}
                onClick={this.shareCollection}
              >
                <i className="fas fa-share contributors-share"></i>
              </a>
            </React.Fragment>
          )}
        </div>
        <div className="horizontal-divider-toolbar"></div>
        <div className={styles.toolbarContent}>
          <div className={styles.navigationButtons}>
            <RoundButtons
              buttons={this.props.buttons}
              selectedButton={this.props.activeButtonDisplay}
              onButtonSelected={this.props.toggleDisplay}
              buttonClassName={"grey"}
              activeButtonClassName={"active"}
              onClick={this.onClickButtonRedirect}
            />
          </div>

          <div className={styles.toolbarSwitch}>
            {!this.props.isCollection && (
              <div className={styles.noOfCollections}>
                {this.context.collections.length} Collections
              </div>
            )}
            {this.props.isCollection && (
              <div className={styles.navSwitch}>
                <ModeButtons
                  buttons={["image", "info", "edit"]}
                  selectedButton={this.props.activeButtonMode}
                  activeButtonClassName={"active"}
                  iconClass={[
                    "fas fa-file-image",
                    "fal fa-file-alt",
                    "fad fa-pencil",
                  ]}
                  onButtonSelected={this.props.toggleMode}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={cn("horizontal-divider-collections", styles.hide)}
        ></div>
      </div>
    );
  }
}

export default withRouter(CollectionsToolbar);
