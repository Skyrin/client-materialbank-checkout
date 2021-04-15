import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/MoreIdeas/MoreIdeas.module.scss";
import cn from "classnames";
import { AppContext, AppContextState } from "context/AppContext";
import ItemCard from "../ItemCard/ItemCard";
import RoundButtons from "../RoundButtons/RoundButtons";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

type Props = {
  headerText?: string;
  collectionMaterials: any;
};

export default class MoreIdeas extends React.Component<Props, any> {
  static contextType = AppContext;
  context!: AppContextState;

  constructor(props: Props) {
    super(props);
    this.state = {
      maxCards: 8,
    };
  }

  async componentDidMount() {
    if (this.props.collectionMaterials) {
      const recommendedSKUs = this.props.collectionMaterials.map((p) => p);
      console.log("recommended_skus", recommendedSKUs);
      if (recommendedSKUs.length) {
        await this.context.requestRecommendedProductSKUs(10, recommendedSKUs);
      }
    }
  }

  render() {
    let recommendations;
    if (this.props.collectionMaterials) {
      recommendations = this.context.recommendedProductSKUs.map((sku) => {
        return {
          id: `fake_collection_item_${sku}`,
          objectType: "material",
          material: {
            sku: sku,
          },
        };
      });
    }
    const headerText =
      this.props.headerText || "More ideas for this collection";
    if (recommendations.length) {
      return (
        <div className={cn(styles.moreIdeasContainer)}>
          <div className={styles.ideasHeader}>{headerText}</div>
          <div className="horizontal-divider-toolbar extra-margin"></div>
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              350: 1,
              400: 2,
              650: 3,
              920: 4,
              1080: 4,
            }}
          >
            <Masonry columnsCount={4} gutter="20px">
              {recommendations
                .slice(0, this.state.maxCards)
                .map((item: any, index: number) => {
                  return <ItemCard key={index} mode="info" item={item} />;
                })}
            </Masonry>
          </ResponsiveMasonry>
          {recommendations && recommendations.length > this.state.maxCards && (
            <div className={styles.buttonContainer}>
              <RoundButtons
                buttons={[
                  `Load ${recommendations.length - this.state.maxCards} more`,
                ]}
                selectedButton={null}
                onButtonSelected={(recommendations) => {
                  if (recommendations) {
                    this.setState({ maxCards: recommendations.length });
                  }
                }}
              />
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}
