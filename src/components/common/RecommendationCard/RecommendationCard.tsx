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
  return (
    <div className={styles.wrapper}>
      <img
        className={styles.RecommendationCard}
        onClick={props.onClick}
        src={image}
        alt=""
      />
    </div>
  );
}
