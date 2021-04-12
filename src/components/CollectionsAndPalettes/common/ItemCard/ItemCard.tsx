import * as React from "react";
import cn from "classnames";
import styles from "../../common/ItemCard/ItemCard.module.scss";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../../context/AppContext";
import { get } from "lodash-es";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import { COLLECTION_URL } from "../../../../constants/urls";
import { DateTime } from "luxon";

interface ItemProps {
  mode: any;
  item: any;
  recommended?: boolean;
}

type Props = RouteComponentProps;

class ItemCard extends React.Component<Props & ItemProps, any> {
  static contextType = AppContext;
  context!: AppContextState;
  materialItem: any;

  formatDate = (stringDate: string): string => {
    const date = DateTime.fromISO(stringDate);
    return date.toFormat("MMMM dd, yyyy");
  };

  getCollectionId = () => {
    const collectionPageResult = matchPath(this.props.location.pathname, {
      path: COLLECTION_URL,
      exact: true,
    });
    return get(collectionPageResult, "params.collection_id");
  };

  deleteItem = () => {
    this.context.openModal(Modals.DeleteItem, {
      collectionItemId: this.props.item.id,
    });
  };

  mapAlgoliaToObject(): any {
    let material = null;
    if (this.props.item.material) {
      material = this.props.item.material;
    } else return;

    const algoliaProduct = this.context.productsCache.getProduct(material.sku);
    const color = get(algoliaProduct, "data.color", "material.color");
    const manufacturer = get(
      algoliaProduct,
      "data.manufacturer",
      "material.manufacturer"
    );
    const imageUrl = get(
      algoliaProduct,
      "data.thumbnail_url",
      "https://dev.design.shop/static/version1613493863/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg"
    );
    const priceSign = get(
      algoliaProduct,
      "data.price_sign",
      "material.price_sign"
    );
    const name = get(algoliaProduct, "data.name", "material.name");

    return {
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
            <img src={this.props.item.upload.url} alt="" />
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderMaterialImage = () => {
    let materialItem = this.mapAlgoliaToObject();
    return (
      <React.Fragment>
        <div className={styles.imageContainer}>
          <img
            className={cn(styles.infoImage, styles.SKUimg)}
            src={materialItem.imageUrl}
            alt=""
          />
          <div className={styles.priceIndicator}>{materialItem.priceSign}</div>
        </div>
      </React.Fragment>
    );
  };

  renderHotspotImage = () => {
    let hotspotItem;
    if (this.props.item.objectType === "hotspot") {
      hotspotItem = JSON.parse(this.props.item.json);
    }
    return (
      <React.Fragment>
        <div className={styles.front}>
          <div className={cn(styles.imageContainer)}>
            <img
              className={
                hotspotItem.type === "room" ? styles.roomImg : styles.paletteImg
              }
              src={hotspotItem.imageUrl}
              alt=""
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderImageItem() {
    let hotspotItem;
    if (this.props.item.objectType === "hotspot") {
      hotspotItem = JSON.parse(this.props.item.json);
    }
    return (
      <React.Fragment>
        <div className={styles.front}>
          {this.props.item.objectType === "upload" && this.renderUploadImage()}
          {hotspotItem && this.renderHotspotImage()}
          {this.props.item.objectType === "material" &&
            this.renderMaterialImage()}
        </div>
        <div className={styles.back}>{this.renderInfoItem()}</div>
      </React.Fragment>
    );
  }

  renderEditItem() {
    let materialItem = this.mapAlgoliaToObject();
    let hotspotItem;
    if (this.props.item.objectType === "hotspot") {
      hotspotItem = JSON.parse(this.props.item.json);
    }
    return (
      <React.Fragment>
        <div className={styles.imageContainer}>
          {this.props.item.objectType === "upload" && (
            <img src={this.props.item.upload.url} alt="" />
          )}
          {this.props.item.objectType === "material" && (
            <img
              className={cn(styles.infoImage, styles.SKUimg)}
              src={materialItem.imageUrl}
              alt=""
            />
          )}
          {hotspotItem && (
            <img
              className={
                hotspotItem.type === "room" ? styles.roomImg : styles.paletteImg
              }
              src={hotspotItem.imageUrl}
              alt=""
            />
          )}
          <div
            onClick={this.deleteItem}
            className={cn(styles.delete, styles.editButton)}
          >
            <i className="fal fa-trash"></i>
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderInfoItem() {
    let hotspotItem;
    if (this.props.item.objectType === "hotspot") {
      hotspotItem = JSON.parse(this.props.item.json);
    }
    return (
      <React.Fragment>
        {this.props.item.objectType === "upload" && this.renderUploadInfo()}
        {this.props.item.objectType === "material" && this.renderMaterialInfo()}
        {hotspotItem && this.renderHotspotInfo()}
      </React.Fragment>
    );
  }

  renderUploadInfo = () => {
    return (
      <React.Fragment>
        <div className={cn(styles.imageContainer, styles.infoMode)}>
          <img
            className={styles.infoImage}
            src={this.props.item.upload.url}
            alt=""
          />
        </div>
        <div className={cn(styles.infoContainer, styles.infoMode)}>
          <div>{this.props.item.upload.name}</div>
        </div>
      </React.Fragment>
    );
  };

  renderHotspotInfo = () => {
    let hotspotItem;
    if (this.props.item.objectType === "hotspot") {
      hotspotItem = JSON.parse(this.props.item.json);
    }
    return (
      <React.Fragment>
        <div className={cn(styles.imageContainer, styles.infoMode)}>
          <img
            className={cn(
              styles.infoImage,
              hotspotItem.type === "room" ? styles.roomImg : styles.paletteImg
            )}
            src={hotspotItem.imageUrl}
            alt=""
          />
        </div>
        <div className={cn(styles.infoContainer, styles.infoMode)}>
          <div className={styles.darker}>{hotspotItem.name}</div>
          <div>Design Shop, {this.formatDate(hotspotItem.createdOn)}</div>
        </div>
      </React.Fragment>
    );
  };

  renderMaterialRecommended = () => {
    let materialItem = this.props.item;
    return (
      <React.Fragment>
        <div className={styles.imageContainer}>
          <img
            className={styles.infoImage}
            src={materialItem.image_url}
            alt=""
          />
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
          <div className={styles.darker}>{materialItem.name}</div>
          <div className={styles.darker}>{materialItem.manufacturer}</div>
          <div>{materialItem.color}</div>
          <div className={styles.priceIndicator}>{materialItem.price_sign}</div>
        </div>
      </React.Fragment>
    );
  };
  renderMaterialInfo = () => {
    let materialItem = this.mapAlgoliaToObject();
    return (
      <React.Fragment>
        <div className={styles.imageContainer}>
          <img
            className={cn(styles.infoImage, styles.SKUimg)}
            src={materialItem.imageUrl}
            alt=""
          />
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
          <div className={styles.darker}>{materialItem.name}</div>
          <div className={styles.darker}>{materialItem.manufacturer}</div>
          <div>{materialItem.color}</div>
          <div className={styles.priceIndicator}>{materialItem.priceSign}</div>
        </div>
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
    return (
      <React.Fragment>
        <div>
          <div
            className={cn(
              styles.itemCard,
              this.props.mode === "info" ? styles.infoModeCard : ""
            )}
          >
            {this.renderSwitch(this.props.mode)}
            {this.props.recommended && this.renderMaterialRecommended()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ItemCard);
