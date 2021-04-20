import React from "react";
import styles from "./Recommendations.module.scss";
import cn from "classnames";
import { RecommendationCard } from "components/common/RecommendationCard/RecommendationCard";
import { AppContext, AppContextState } from "context/AppContext";
import { OrderItemT } from "constants/types";
import { getSamplePage } from "utils/general";

type Props = {
  orderedProducts: OrderItemT[];
  className: string;
};

export class Recommendations extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  async componentDidMount() {
    const orderedSkus = this.props.orderedProducts.map((p) => p.product_sku);
    console.log("ordered_skus", orderedSkus);
    this.context.requestRecommendedProductSKUs(6, orderedSkus);
  }

  render() {
    const recommendations = this.context.recommendedProductSKUs
      .map((sku) => this.context.productsCache.getProduct(sku))
      .filter((p) => !p.loading)
      .map((p) => p.data);

    if (recommendations && recommendations.length) {
      return (
        <div className={cn(styles.Recommendations, this.props.className)}>
          <div className={styles["recommendations-grid"]}>
            {recommendations.map((r) => (
              <RecommendationCard
                product={r}
                onClick={() => {
                  window.location = getSamplePage(r.sku);
                }}
              />
            ))}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
