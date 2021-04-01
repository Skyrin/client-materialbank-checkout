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
  updatedTitle: string;
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
  filter?: boolean;
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
      updatedTitle: null,
    };
    this.wrapperRefDropdown = React.createRef();
    this.wrapperRefRename = React.createRef();
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
          <span
            onClick={() => {
              this.setState({ isRenameMode: !this.state.isRenameMode });
            }}
          >
            Rename
          </span>
          <span onClick={this.duplicateCollection}>Duplicate Collection</span>
          <span onClick={this.makePrivateCollection}>Make Private </span>
          <span onClick={this.deleteCollection}>Delete </span>
        </div>
      </React.Fragment>
    );
  };

  renderCollectionCollaborators = () => {
    return <Collaborators collaborators={this.props.collaborators} />;
  };

  onClickButtonRedirect = (button: string) => {
    if (!this.props.filter) {
      const redirectURLS = {
        collections: COLLECTIONS_URL,
        palettes: PALETTES_URL,
      };
      const currentURL = this.props.history.location.pathname;
      if (redirectURLS[button] === currentURL) return;
      else this.props.history.push(redirectURLS[button]);
    }
  };

  getCollectionId = () => {
    const collectionPageResult = matchPath(this.props.location.pathname, {
      path: COLLECTION_URL,
      exact: true,
    });
    return get(collectionPageResult, "params.collection_id");
  };

  handleTitleChange = (e: any) => {
    this.setState({ updatedTitle: e.target.value });
  };

  handleTitleUpdate = async (e: any) => {
    if (e.key === "Enter") {
      this.setState({ isRenameMode: false, title: this.state.updatedTitle });
    } else if (e.key === "Escape") {
      this.setState({
        isRenameMode: false,
        title: this.props.title,
        updatedTitle: this.state.title,
      });
    }
  };

  submit = async (e: any) => {
    const collectionId = parseInt(this.getCollectionId());
    if (collectionId) {
      await this.handleTitleUpdate(e);
      const resp = await renameCollection(
        this.context,
        collectionId,
        this.state.title
      );
      console.log("rename response", resp);
      await this.context.requestCollections({
        limit: 100,
        offset: 0,
      });
      await this.context.requestCollection(collectionId);
    }
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
      this.setState({
        isRenameMode: false,
        title: this.props.title,
        updatedTitle: this.state.title,
      });
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
                defaultValue={this.state.title}
                ref={this.wrapperRefRename}
                className={styles.renameInput}
                value={this.state.updatedTitle}
                type="text"
                name="Rename"
                onChange={this.handleTitleChange}
                onKeyDown={this.submit}
              />
            ) : (
              <div className={styles.title}>{this.state.title}</div>
            )}
            <span
              onClick={() => this.setState({ isOpened: !this.state.isOpened })}
            >
              {this.props.isCollection && this.renderCollectionsEditDropdown()}
            </span>
          </div>
          {this.props.isCollection && (
            <div className={styles.collaborators}>
              {this.props.collaborators ? (
                this.renderCollectionCollaborators()
              ) : (
                <div className={styles.collaborators}>
                  <span>Share this collection</span>
                  <span onClick={this.shareCollection}>
                    <i className="fas fa-share contributors-share"></i>
                  </span>
                </div>
              )}
            </div>
          )}
          {this.props.isCollection && (
            <React.Fragment>
              <span
                className={styles.floatingShare}
                onClick={this.shareCollection}
              >
                <i className="fas fa-share contributors-share"></i>
              </span>
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
