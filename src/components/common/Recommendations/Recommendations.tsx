import React from "react";
import styles from "./Recommendations.module.scss";
import cn from "classnames";
import { RecommendationCard } from "components/common/RecommendationCard/RecommendationCard";

type Props = {
  recommendations: { id: number; [key: string]: any }[];
  recommendationClick: (productId: number) => any;
  className: string;
};

export function Recommendations(props: Props) {
  if (props.recommendations?.length) {
    return (
      <div className={cn(styles.Recommendations, props.className)}>
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
