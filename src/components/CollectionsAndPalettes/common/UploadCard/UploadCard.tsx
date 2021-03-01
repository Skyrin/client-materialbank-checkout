import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/UploadCard/UploadCard.module.scss";
import cn from "classnames";

export default class UploadCard extends React.Component<any, any> {
  render() {
    return (
      <div className={cn(styles.uploadContainer, "masonry-item")}>
        <div>
          <span>Upload a photo or drag & drop here </span>
        </div>
      </div>
    );
  }
}
