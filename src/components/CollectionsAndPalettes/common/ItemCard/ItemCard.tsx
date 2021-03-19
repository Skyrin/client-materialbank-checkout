import * as React from "react";
import cn from "classnames";
import styles from "../../common/ItemCard/ItemCard.module.scss";
import { CollectionItemT } from "../../../../constants/types";
import { AppContext, AppContextState } from "../../../../context/AppContext";
import { get } from "lodash-es";

interface Props {
  mode: any;
  item: CollectionItemT;
}

export default class ItemCard extends React.Component<Props, any> {
  static contextType = AppContext;
  context!: AppContextState;
  materialItem: any;

  mapAlgoleaToObject(): any {
    let item = null;
    if (this.props.item.material) {
      item = this.props.item.material.id.toString();
    } else {
      item = this.props.item.upload;
    }
    const algoliaProduct = this.context.productsCache.getProduct(item);
    const color = get(
      algoliaProduct,
      "data.color",
      "this.props.item.material.color"
    );
    const manufacturer = get(
      algoliaProduct,
      "data.manufacturer",
      "this.props.item.material.manufacturer"
    );
    const imageUrl = get(
      algoliaProduct,
      "data.thumbnail_url",
      "https://dev.design.shop/static/version1613493863/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg"
    );
    const priceSign = get(
      algoliaProduct,
      "data.price_sign",
      "this.props.item.material.price_sign"
    );
    const name = get(
      algoliaProduct,
      "data.name",
      "this.props.item.material.name"
    );
    this.materialItem = {
      type: this.props.item.objectType,
      priceSign,
      imageUrl,
      color,
      name,
      manufacturer,
    };
  }

  renderUploadImage = () => {
    return (
      <React.Fragment>
        <div className={styles.front}>
          <div className={cn(styles.imageContainer)}>
            <img src={this.props.item.upload.s3Url} alt="" />
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderMaterialImage = () => {
    return (
      <React.Fragment>
        <div className={styles.imageContainer}>
          <img src={this.materialItem.imageUrl} alt="" />
          <div className={styles.priceIndicator}>
            {this.materialItem.priceSign}
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderImageItem() {
    return (
      <React.Fragment>
        <div className={styles.front}>
          {this.props.item.objectType === "upload" && this.renderUploadImage()}
          {this.props.item.objectType === "material" &&
            this.renderMaterialImage()}
        </div>
        <div className={styles.back}>{this.renderInfoItem()}</div>
      </React.Fragment>
    );
  }

  renderEditItem() {
    return (
      <React.Fragment>
        <div className={styles.imageContainer}>
          {this.props.item.objectType === "upload" && (
            <img src={this.props.item.upload.s3Url} alt="" />
          )}
          {this.props.item.objectType === "material" && (
            <img src={this.materialItem.imageUrl} alt="" />
          )}
          <div className={cn(styles.delete, styles.editButton)}>
            <i className="fal fa-trash"></i>
          </div>
          <div className={cn(styles.move, styles.editButton)}>
            <i className="fal fa-arrows"></i>
          </div>
          <div className={cn(styles.duplicate, styles.editButton)}>
            <i className="fal fa-copy"></i>
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderInfoItem() {
    return (
      <React.Fragment>
        {this.props.item.objectType === "upload" && this.renderUploadInfo()}
        {this.props.item.objectType === "material" && this.renderMaterialInfo()}
      </React.Fragment>
    );
  }

  renderUploadInfo = () => {
    return (
      <React.Fragment>
        <div className={cn(styles.imageContainer, styles.infoMode)}>
          <img src={this.props.item.upload.s3Url} alt="" />
        </div>
        <div className={cn(styles.infoContainer, styles.infoMode)}>
          <div>{this.props.item.name}</div>
        </div>
      </React.Fragment>
    );
  };

  renderMaterialInfo = () => {
    return (
      <React.Fragment>
        <React.Fragment>
          <div className={styles.imageContainer}>
            <img src={this.materialItem.imageUrl} alt="" />
            <div className={styles.sampleCart}>
              <i
                className={cn("far", "fa-cart-arrow-down", styles.addCartIcon)}
              />
              <span className={cn(styles["button-text"], styles.sampleText)}>
                Sample
              </span>
            </div>
          </div>
          <div className={cn(styles.infoContainer, styles.infoMode)}>
            <div className={styles.darker}>{this.materialItem.name}</div>
            <div className={styles.darker}>
              {this.materialItem.manufacturer}
            </div>
            <div>{this.materialItem.color}</div>
            <div className={styles.priceIndicator}>
              {this.materialItem.priceSign}
            </div>
          </div>
        </React.Fragment>
      </React.Fragment>
    );
  };

  renderSwitch(mode) {
    switch (mode) {
      case "image":
        return this.renderImageItem();
      case "info":
        return this.renderInfoItem();
      case "edit":
        return this.renderEditItem();
    }
  }

  render() {
    this.mapAlgoleaToObject();
    return (
      <React.Fragment>
        <div className={cn("masonry-item")}>
          <div
            className={cn(
              styles.itemCard,
              this.props.mode === "info" ? styles.infoModeCard : ""
            )}
          >
            {this.renderSwitch(this.props.mode)}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
