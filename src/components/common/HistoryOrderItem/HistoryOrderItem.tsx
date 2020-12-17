import React from "react";
import cn from "classnames";
import styles from "./HistoryOrderItem.module.scss";

interface Props {
  item: Item;
  onClick?: (...params: any) => any
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

  // TODO: Rename this once we know what the (n) number is on the "Shop this flooring" button
  shopNumber: number;
}

export function HistoryOrderItem(props: Props) {
  const item = props.item;
  return (
    <div className={cn(styles["HistoryOrderItem"])}>

      <div className={cn(styles["left-container"])}>
        <div className={cn(styles["image"])}>

        </div>
        <div className={cn(styles["brand-model"])}>
          <div className={cn(styles["brand"], "font-size-sm", "text-color-xlight")}>
            {item.brand}
          </div>
          <div className={cn(styles["model"], "font-weight-medium")}>
            {item.model}
          </div>
        </div>
      </div>

      <div className={cn(styles["middle-container"])}>
        <div className={cn(styles["label"], "font-size-sm", "text-color-xlight")}>
          {item.color}
        </div>
        <div
          className={cn(styles["label"], "font-size-sm", "text-color-xlight")}>
          {item.currency}{item.pricePerArea} / {item.areaMeasurementUnit}
        </div>
        <div
          className={cn(styles["label"], "font-size-sm", "text-color-xlight")}>
          {item.currency}{item.pricePerSample} / sample
        </div>

      </div>

      <div className={cn(styles["right-container"])}>
        <button className={cn(styles["shop-button"], "font-weight-medium")}
                onClick={props.onClick}>
          Shop this flooring ({item.shopNumber})
        </button>
      </div>

    </div>
  );
}
