import { CollectionT } from "constants/types";
import * as React from "react";
import styles from "../../common/ItemCard/ItemCard.module.scss";
import Collaborators from "../Collaborators/Collaborators";
import cn from "classnames";
import { get } from "lodash-es";

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

  getImagePath = (item) => {
    if (item.upload) {
      return item.upload.url;
    } else if (item.material) {
      const algoliaProduct = this.context.productsCache.getProduct(
        item.material.sku
      );
      return get(
        algoliaProduct,
        "data.thumbnail_url",
        "https://dev.design.shop/static/version1613493863/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg"
      );
    } else if (JSON.parse(item.json).type === "room" || "palette") {
      return JSON.parse(item.json).imageUrl;
    }
  };

  render() {
    const { collection } = this.props;
    const imagePathEmpty =
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Color_icon_violet_v2.svg";
    return (
      <div className={cn(styles.itemCard, styles.collectionCard)}>
        <div
          className={cn(styles.imageContainer, {
            singleImg: collection.items.length === 1,
            twoImg: collection.items.length === 2,
            multipleImg: collection.items.length > 2,
          })}
        >
          {collection.items.slice(0, 4).map((collectionItem) => {
            return (
              <img
                key={collectionItem.id}
                src={this.getImagePath(collectionItem)}
                className={styles.image}
              />
            );
          })}
          {collection.items.length === 0 && <img src={imagePathEmpty} alt="" />}
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
              <Collaborators small collaborators={collection.collaborators} />
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
