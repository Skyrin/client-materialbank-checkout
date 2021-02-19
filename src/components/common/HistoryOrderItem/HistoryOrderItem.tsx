import React from "react";
import cn from "classnames";
import styles from "./HistoryOrderItem.module.scss";
import { OrderItemT } from "constants/types";
import { parseCurrency } from "utils/general";

interface Props {
  item?: Item;
  onClick?: (...params: any) => any;
  itemT: OrderItemT;
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

export function HistoryOrderItem(props: Props) {
  const item = props.itemT;
  return (
    <div className={cn(styles["HistoryOrderItem"])}>
      <div className={cn(styles["left-container"])}>
        <div className={cn(styles["image"])} />
        <div className={cn(styles["brand-model"])}>
          <div
            className={cn(styles["brand"], "font-size-sm", "text-color-xlight")}
          >
            {item.product_sku}
          </div>
          <div className={cn(styles["model"], "font-weight-medium")}>
            {item.product_name}
          </div>
        </div>
      </div>

      <div className={cn(styles["middle-container"])}>
        <div
          className={cn(styles["label"], "font-size-sm", "text-color-xlight")}
        >
          {"item.color"}
        </div>
        <div
          className={cn(styles["label"], "font-size-sm", "text-color-xlight")}
        >
          {parseCurrency(item.product_sale_price.currency)}
          {item.product_sale_price.value} / {"item.areaMeasurementUnit"}
        </div>
        <div
          className={cn(styles["label"], "font-size-sm", "text-color-xlight")}
        >
          {parseCurrency(item.product_sale_price.currency)}
          {item.product_sale_price.value} / sample
        </div>
      </div>

      <div className={cn(styles["right-container"])}>
        <button
          className={cn(styles["shop-button"], "font-weight-medium")}
          onClick={props.onClick}
        >
          Shop this flooring ({"item.shops.length"})
        </button>
      </div>
    </div>
  );
}
