import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/UploadCard/UploadCard.module.scss";
import cn from "classnames";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../../context/AppContext";

interface Props {
  caption: string;
  hasIcon?: boolean;
  onClick?: any;
}

export default class UploadCard extends React.Component<Props, any> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;
  uploadPhoto = () => {
    this.context.openModal(Modals.UploadPhoto);
  };

  render() {
    return (
      <div
        className={cn(
          styles.uploadContainer,
          "masonry-item",
          !this.props.hasIcon ? styles.collectionUpload : ""
        )}
        // onClick={!this.props.hasIcon ? this.uploadPhoto : undefined}
        onClick={this.props.onClick}
      >
        {this.props.hasIcon && (
          <i className={cn("far fa-plus", styles.addIcon)}></i>
        )}
        <div>
          <span>{this.props.caption} </span>
        </div>
      </div>
    );
  }
}
