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
}

export default class UploadCard extends React.Component<Props, any> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;
  createCollection = () => {
    this.context.openModal(Modals.CreateCollection);
  };

  render() {
    return (
      <div className={cn(styles.uploadContainer, "masonry-item")}>
        {this.props.hasIcon && (
          <i
            className={cn("far fa-plus", styles.addIcon)}
            onClick={this.createCollection}
          ></i>
        )}
        <span>{this.props.caption} </span>
      </div>
    );
  }
}
