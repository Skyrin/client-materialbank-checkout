import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/Toolbar/CollectionsToolbar.module.scss";
import RoundButton from "../RoundButton/RoundButton";
import ModeButton from "../ModeButton/ModeButton";
import cn from "classnames";

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

const maxNoContributors = 4;

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
    if (this.props.contributors) {
      let numberToShow = this.props.contributors.length - maxNoContributors;
      return (
        <React.Fragment>
          {this.props.contributors && (
            <div className={styles.contributors}>
              {this.props.contributors.map(
                (contributor: any, index: number) => {
                  return (
                    <React.Fragment>
                      {this.props.contributors.length < maxNoContributors && (
                        <img src={this.props.contributors[index]} />
                      )}
                      {this.props.contributors.length >= maxNoContributors &&
                        index < maxNoContributors && (
                          <img src={this.props.contributors[index]} />
                        )}
                    </React.Fragment>
                  );
                }
              )}
              {this.props.contributors.length - maxNoContributors > 1 && (
                <a className={styles.numberToShow}>+{numberToShow}</a>
              )}
            </div>
          )}
          <a>
            <i className="fas fa-share"></i>
          </a>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <a>Share this collection</a>
          <a>
            <i className="fas fa-share"></i>
          </a>
        </React.Fragment>
      );
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
            <div className={styles.title}>{this.props.title}</div>
            <a
              onClick={() => this.setState({ isOpened: !this.state.isOpened })}
            >
              {this.props.isCollection && this.renderCollectionsEditDropdown()}
            </a>
          </div>
          <div className={styles.contributors}>
            {this.props.contributors && this.renderCollectionContributors()}
          </div>
        </div>
        <div className="horizontal-divider-toolbar"></div>
        <div className={styles.toolbarContent}>
          <div className={styles.navigationButtons}>
            <RoundButton
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
                <ModeButton
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
