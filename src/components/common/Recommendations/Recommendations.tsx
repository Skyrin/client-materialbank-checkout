import React from "react";
import styles from "./Recommendations.module.scss";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";

type Props = {
  title?: string;
  recommendations: { id: number; [key: string]: any }[];
  recommendationClick: (productId: number) => any;
};

export function Recommendations(props: Props) {
  if (props.recommendations?.length) {
    return (
      <div className={styles.Recommendations}>
        <div className={styles.title}>{props.title || "Recommendations:"}</div>
        <div className={styles["recommendations-grid"]}>
          {props.recommendations.map((r) => (
            <RecommendationCard
              key={r.id}
              title={r.title}
              type={r.type}
              image={r.image}
              click={() => props.recommendationClick(r.id)}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
