import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/Toolbar/CollectionsToolbar.module.scss";
import RoundButtons from "../RoundButtons/RoundButtons";
import ModeButtons from "../ModeButtons/ModeButtons";
import cn from "classnames";
import Contributors from "../Contributors/Contributors";
import { COLLECTIONS_URL } from "../../../../constants/urls";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  buttons: any;
  activeButtonMode?: any;
  activeButtonDisplay?: any;
  isCollection?: boolean;
  contributors?: any;
  toggleMode?: any;
  toggleDisplay?: any;
}

export default class CollectionsToolbar extends React.Component<Props, any> {
  wrapperRef: any;

  constructor(props: any) {
    super(props);
    this.state = {
      isOpened: false,
    };
    this.wrapperRef = React.createRef();
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
          <a>Duplicate Collection</a>
          <a>Make Private</a>
          <a>Delete </a>
        </div>
      </React.Fragment>
    );
  };

  renderCollectionContributors = () => {
    return <Contributors contributors={this.props.contributors} />;
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
            <div className={styles.title}>{this.props.title}</div>
            <a
              onClick={() => this.setState({ isOpened: !this.state.isOpened })}
            >
              {this.props.isCollection && this.renderCollectionsEditDropdown()}
            </a>
          </div>
          {this.props.isCollection && (
            <div className={styles.contributors}>
              {this.props.contributors ? (
                this.renderCollectionContributors()
              ) : (
                <div className={styles.contributors}>
                  <a>Share this collection</a>
                  <i className="fas fa-share contributors-share"></i>
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
            />
          </div>

          <div className={styles.toolbarSwitch}>
            <div className={styles.noOfCollections}>{} Collections</div>
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
