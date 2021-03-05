import * as React from "react";
import styles from "../../common/Contributors/Contributors.module.scss";
import cn from "classnames";

interface Props {
  contributors: any;
  small?: boolean;
}

export default class Contributors extends React.Component<Props, any> {
  maxNoContributors: number;
  numberToShow: number;

  render() {
    if (this.props.small) {
      this.maxNoContributors = 3;
    } else {
      this.maxNoContributors = 4;
    }
    this.numberToShow = this.props.contributors.length - this.maxNoContributors;

    return (
      <React.Fragment>
        {this.props.contributors && (
          <div
            className={cn(
              styles.contributors,
              this.props.small ? styles.small : ""
            )}
          >
            {this.props.contributors.map((contributor: any, index: number) => {
              return (
                <React.Fragment>
                  {this.props.contributors.length < this.maxNoContributors && (
                    <img src={this.props.contributors[index]} alt="" />
                  )}
                  {this.props.contributors.length >= this.maxNoContributors &&
                    index < this.maxNoContributors && (
                      <img src={this.props.contributors[index]} alt="" />
                    )}
                </React.Fragment>
              );
            })}
            {this.props.contributors.length - this.maxNoContributors > 1 && (
              <a className={styles.numberToShow}>+{this.numberToShow}</a>
            )}
            <i className="fas fa-share contributors-share"></i>
          </div>
        )}
      </React.Fragment>
    );
  }
}
