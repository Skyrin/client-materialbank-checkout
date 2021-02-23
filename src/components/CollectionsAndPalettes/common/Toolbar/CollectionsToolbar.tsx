import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/Toolbar/CollectionsToolbar.module.scss";
import RoundButton from "../RoundButton/RoundButton";
import cn from "classnames";

interface Props {
  title: string;
  buttons: any;
  activeButton?: any;
  isCollection?: boolean;
  dropdown?: any;
  contributors: any;
  toggleMode?: any;
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
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(evt: any) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(evt.target)) {
      this.setState({ isOpened: false });
    }
  }

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
        </React.Fragment>
      );
    } else {
      return <a>Share this collection</a>;
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
            {this.renderCollectionContributors()}
            <a>
              <i className="fas fa-share"></i>
            </a>
          </div>
        </div>
        <div className="horizontal-divider-collections"></div>
        <div className={styles.toolbarContent}>
          <div className={styles.navigationButtons}>
            <RoundButton buttons={this.props.buttons} background={"grey"} />
          </div>
          <div className={styles.toolbarSwitch}>
            <div className={styles.noOfCollections}>4 Collections</div>
            {this.props.isCollection && (
              <div className={styles.navSwitch}>
                <RoundButton
                  buttons={["image", "info", "edit"]}
                  active={this.props.activeButton}
                  hasAnimation
                  iconClass={[
                    "fas fa-file-image",
                    "fal fa-file-alt",
                    "fad fa-pencil",
                  ]}
                  toggleMode={this.props.toggleMode}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
