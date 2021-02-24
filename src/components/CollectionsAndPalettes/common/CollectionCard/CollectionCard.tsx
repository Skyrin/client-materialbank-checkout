import * as React from "react";
import styles from "../../common/CollectionCard/CollectionCard.module.scss";

interface Props {
  item: {
    id: number;
    title1: string;
    title2: string;
    // contributors: [{}];
    imagePath: string;
  };
}

export default class ItemCard extends React.Component<Props, any> {
  renderCollectionCard = () => {
    return (
      <React.Fragment>
        <div className={styles.imageContainer}>
          <img src={this.props.item.imagePath} />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.textContainer}>
            <div className={styles.darker}>{this.props.item.title1}</div>
            <div>{this.props.item.title2}</div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className={styles.itemCard}>{this.renderCollectionCard()}</div>
      </React.Fragment>
    );
  }
}
