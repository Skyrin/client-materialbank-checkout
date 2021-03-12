import { AlgoliaProductT } from "constants/types";
import * as React from "react";
import styles from "./RecommendationCard.module.scss";

type Props = {
  product: AlgoliaProductT;
  onClick: Function;
  disabled?: boolean;
};

export function RecommendationCard(props: Props) {
  const image = props.product.thumbnail_url;
  const manufacturer = props.product.manufacturer || "product.manufacturer";
  const name = props.product.name || "product.name";
  const color = props.product.color || "product.color";
  return (
    <div className={styles.RecommendationCard} onClick={props.onClick}>
      {image ? (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : (
        <div className={styles.image} />
      )}
      <div className={styles.content}>
        <div className={styles.type}>{manufacturer}</div>
        <div className={styles.title}>{name}</div>
        <div className={styles.color}>{color}</div>
      </div>
    </div>
  );
}
