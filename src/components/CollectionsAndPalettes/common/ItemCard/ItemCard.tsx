import * as React from "react";
import cn from "classnames";
import styles from "../../common/ItemCard/ItemCard.module.scss";

interface Props {
  mode: any;
  item: {
    type: any;
    title1: string;
    title2: string;
    title3: string;
    price: string;
    imagePath: string;
  };
}

export default class ItemCard extends React.Component<Props, any> {
  constructor(props) {
    super(props);
  }

  renderImageItem(type) {
    return (
      <React.Fragment>
        {this.props.item.type === "sample" && this.renderSampleImage()}
        {this.props.item.type !== "sample" && (
          <React.Fragment>
            <div className={styles.imageContainer}>
              <img src={this.props.item.imagePath} />
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  renderEditItem(type) {
    return (
      <React.Fragment>
        <div className={styles.imageContainer}>
          <img src={this.props.item.imagePath} />
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

  renderInfoItem(type) {
    return (
      <React.Fragment>
        {this.props.item.type === "sample" && this.renderSampleInfo()}
        {this.props.item.type !== "sample" && (
          <React.Fragment>
            <div className={styles.imageContainer}>
              <img src={this.props.item.imagePath} />
            </div>
            <div className={styles.infoContainer}>
              <div>{this.props.item.title1}</div>
              <div>{this.props.item.title2}</div>
              <div className={styles.darker}>{this.props.item.title3}</div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  renderSampleImage = () => {
    return (
      <div className={styles.imageContainer}>
        <img src={this.props.item.imagePath} />
        <div className={styles.priceIndicator}>$ $ $</div>
      </div>
    );
  };
  renderSampleInfo = () => {
    return (
      <React.Fragment>
        <div className={styles.imageContainer}>
          <img src={this.props.item.imagePath} />
          <div className={styles.sampleCart}>
            <i
              className={cn("far", "fa-cart-arrow-down", styles.addCartIcon)}
            />
            <span className={cn(styles["button-text"], styles.sampleText)}>
              Sample
            </span>
            <span>${this.props.item.price}</span>
          </div>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.darker}>{this.props.item.title1}</div>
          <div className={styles.darker}>{this.props.item.title2}</div>
          <div>{this.props.item.title3}</div>
          <div className={styles.priceIndicator}>$ $ $</div>
        </div>
      </React.Fragment>
    );
  };

  renderSwitch(mode) {
    switch (mode) {
      case "image":
        return this.renderImageItem(this.props.item.type);
      case "info":
        return this.renderInfoItem(this.props.item.type);
      case "edit":
        return this.renderEditItem(this.props.item.type);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.itemCard}>
          {this.renderSwitch(this.props.mode)}
        </div>
      </React.Fragment>
    );
  }
}
