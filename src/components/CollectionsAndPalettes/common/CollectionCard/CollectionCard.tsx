import { CollectionT } from "constants/types";
import * as React from "react";
import styles from "../../common/ItemCard/ItemCard.module.scss";
import Contributors from "../Contributors/Contributors";
import cn from "classnames";

interface Props {
  collection: CollectionT;
}

export default class ItemCard extends React.Component<Props, any> {
  renderVisibility = () => {
    const { collection } = this.props;
    if (collection.isPublic) {
      return `Shared (${collection.collaborators.length} people)`;
    }
    return `Private`;
  };

  render() {
    const { collection } = this.props;

    const imagePath =
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Color_icon_violet_v2.svg";

    return (
      <div className={styles.itemCard}>
        <div className={styles.imageContainer}>
          <img src={imagePath} alt="" />
        </div>
        <div
          className={cn(
            styles.infoContainer,
            !collection.isPublic ? styles.privateCard : ""
          )}
        >
          <div className={styles.textContainer}>
            <div className={styles.darker}>{collection.name}</div>
            {collection.collaborators && (
              <Contributors small contributors={collection.collaborators} />
            )}
          </div>
          <div>
            {!collection.isPublic && <i className={"far fa-lock"} />}
            {this.renderVisibility()}
          </div>
        </div>
      </div>
    );
  }
}
