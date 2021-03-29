import React from "react";
import cn from "classnames";
import styles from "./HistoryOrderItem.module.scss";
import { OrderItemT } from "constants/types";
import { getSamplePage, parseCurrency } from "utils/general";
import { AppContext, AppContextState } from "context/AppContext";
import { get } from "lodash-es";
import imagePlaceholder from "assets/images/Fill.png";
import { isOnMobile } from "utils/responsive";
import { OrderX, ProductX } from "constants/orderTypes";

interface Props {
  item?: Item;
  onClick?: (...params: any) => any;
  itemT: ProductX;
  order: OrderX;
}

export interface Item {
  id: string;
  image: string;
  brand: string;
  model: string;
  color: string;
  currency: string;
  pricePerArea: number;
  areaMeasurementUnit: string;
  pricePerSample: number;
  shops: Array<{ link: string; name: string; address?: string }>;
}

export class HistoryOrderItem extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  render() {
    const item = this.props.itemT;
    const order = this.props.order;
    const algoliaProduct = this.context.productsCache.getProduct(item.sku);
    const color = get(algoliaProduct, "data.color", "orderItem.color");
    const imageUrl = get(
      algoliaProduct,
      "data.thumbnail_url",
      imagePlaceholder
    );
    const sampleUrl = getSamplePage(item.sku);
    return (
      <div className={cn(styles["HistoryOrderItem"])}>
        <div className={cn(styles["left-container"])}>
          <a href={sampleUrl}>
            <img src={imageUrl} alt="" className={styles["image"]} />
          </a>
          <div className={cn(styles["brand-model"])}>
            {!isOnMobile() && (
              <div
                className={cn(
                  styles["brand"],
                  "font-size-sm",
                  "text-color-xlight"
                )}
              >
                {item.sku}
              </div>
            )}

            <a
              href={sampleUrl}
              className={cn(styles["model"], "font-weight-medium")}
            >
              {item.name}
            </a>

            <div
              className={cn(
                styles["label"],
                "font-size-sm",
                "text-color-xlight",
                styles.colorLabel
              )}
            >
              {color}
            </div>

            {isOnMobile() && (
              <div
                className={cn(
                  styles["label"],
                  "font-size-sm",
                  "text-color-xlight",
                  styles.pricePerArea
                )}
              >
                {parseCurrency(order.currency)}
                {item.price} / {item.unitOfMeasure}
              </div>
            )}

            {isOnMobile() && (
              <div
                className={cn(
                  styles["label"],
                  "font-size-sm",
                  "text-color-xlight",
                  styles.sample
                )}
              >
                {parseCurrency(order.currency)}
                {item.price} / {item.unitOfMeasure}
              </div>
            )}
          </div>
        </div>

        {!isOnMobile() && (
          <div className={cn(styles["middle-container"])}>
            <div
              className={cn(
                styles["label"],
                "font-size-sm",
                "text-color-xlight"
              )}
            >
              {parseCurrency(order.currency)}
              {item.price} / {item.unitOfMeasure}
            </div>
            <div
              className={cn(
                styles["label"],
                "font-size-sm",
                "text-color-xlight"
              )}
            >
              {parseCurrency(order.currency)}
              {item.price} / {item.unitOfMeasure}
            </div>
          </div>
        )}

        <div className={cn(styles["right-container"])}>
          <button
            className={cn(styles["shop-button"], "font-weight-medium")}
            onClick={this.props.onClick}
          >
            Buy Again
          </button>
        </div>
      </div>
    );
  }
}
