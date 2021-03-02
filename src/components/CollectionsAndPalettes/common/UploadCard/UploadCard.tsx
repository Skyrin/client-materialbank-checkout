import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/UploadCard/UploadCard.module.scss";
import cn from "classnames";

interface Props {
  caption: string;
  hasIcon?: boolean;
  showModal?: any;
}

export default class UploadCard extends React.Component<Props, any> {
  render() {
    return (
      <div
        onClick={this.props.showModal}
        className={cn(styles.uploadContainer, "masonry-item")}
      >
        {this.props.hasIcon && (
          <i className={cn("far fa-plus", styles.addIcon)}></i>
        )}
        <span>{this.props.caption} </span>
      </div>
    );
  }
}
