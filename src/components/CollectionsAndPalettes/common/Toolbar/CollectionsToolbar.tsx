import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/Toolbar/CollectionsToolbar.module.scss";
import RoundButtons from "../RoundButtons/RoundButtons";
import ModeButtons from "../ModeButtons/ModeButtons";
import cn from "classnames";
import Collaborators from "../Collaborators/Collaborators";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../../context/AppContext";
import { COLLECTIONS_URL, PALETTES_URL } from "../../../../constants/urls";

interface Props {
  history?: any;
  title: string;
  buttons: any;
  activeButtonMode?: any;
  activeButtonDisplay?: any;
  isCollection?: boolean;
  collaborators?: any;
  toggleMode?: any;
  toggleDisplay?: any;
}

export default class CollectionsToolbar extends React.Component<Props, any> {
  wrapperRef: any;

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

  constructor(props: any) {
    super(props);
    this.state = {
      isOpened: false,
    };
    this.wrapperRef = React.createRef();
    this.onClickButtonRedirect = this.onClickButtonRedirect.bind(this);
  }

  handleClickOutside = (evt: any) => {
    if (
      this.props.isCollection &&
      this.wrapperRef &&
      !this.wrapperRef.current.contains(evt.target)
    ) {
      this.setState({ isOpened: false });
    }
  };

  renderCollectionsEditDropdown = () => {
    return (
      <React.Fragment>
        <i className="far fa-ellipsis-h"></i>
        <div
          ref={this.wrapperRef}
          className={cn(
            styles.collectionEditDropdown,
            `${this.state.isOpened ? styles.opened : styles.closed}`
          )}
        >
          <a>Rename</a>
          <a onClick={this.duplicateCollection}>Duplicate Collection</a>
          <a>Make Private</a>
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
            <div className={styles.title}>{this.props.title}</div>
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
        <div className="horizontal-divider-collections"></div>
      </div>
    );
  }
}
