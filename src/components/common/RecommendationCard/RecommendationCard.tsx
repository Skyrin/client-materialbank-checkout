import * as React from "react";
import styles from "./RecommendationCard.module.scss";

type Props = {
  image?: string;
  title: string;
  type: number;
  click?: () => any;
  added?: boolean;
};

export function RecommendationCard(props: Props) {
  enum productTypes {
    "Upsell / Gift" = 1,
    "Free Gift" = 2,
  }

  return (
    <div className={styles.RecommendationCard}>
      {props.image ? (
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${props.image})` }}
        />
      ) : (
        <div className={styles.image} />
      )}
      <div className={styles.content}>
        <div className={styles.type}>{productTypes[props.type]}</div>
        <div className={styles.title}>{props.title}</div>
        <button
          className={styles["action-button"]}
          onClick={props.click}
          disabled={props.added}
        >
          {props.added ? (
            <React.Fragment>
              Added
              <i className="far fa-check" />
            </React.Fragment>
          ) : (
            <React.Fragment>
              Add for free
              <i className="far fa-plus-circle" />
            </React.Fragment>
          )}
        </button>
      </div>
    </div>
  );
}
