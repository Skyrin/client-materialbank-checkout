import React from "react";
import cn from "classnames";
import styles from "./OrderItemOverlay.module.scss";
import { Item } from "components/common/HistoryOrderItem/HistoryOrderItem";
import { OrderItemT } from "constants/types";
import { parseCurrency } from "utils/general";

interface Props {
  item: OrderItemT;
  close?: () => any;
  addToCart: (item: OrderItemT) => any;
}

export function OrderItemOverlay(props: Props) {
  const item = props.item;
  return (
    <div className={cn(styles["OrderItemOverlay"])}>
      <button className={cn(styles["x-button"])} onClick={props.close}>
        <i className="far fa-times" />
      </button>
      <div className={cn(styles["header"])}>
        <div className={cn(styles["image"])} />
        <div className={cn(styles["title-price"])}>
          <div className={cn(styles["title"], "font-weight-medium")}>
            Where to buy {item.product_sku} {item.product_name} in{" "}
            {"item.color"}
          </div>
          <div className="row center-vertically margin-top-half">
            <div className={styles.priceIndicator}>$$$$$</div>
            <div className={cn(styles["price"], "font-size-sm")}>
              {parseCurrency(item.product_sale_price.currency)}
              {item.product_sale_price.value} / {"item.areaMeasurementUnit"}
            </div>
          </div>
        </div>
      </div>
      <div className={cn(styles["shops"])}>
        {/*{item.shops.map((shop, i) => (*/}
        {/*  <a*/}
        {/*    href={shop.link}*/}
        {/*    className={cn(styles["shop"])}*/}
        {/*    key={shop.link + i}*/}
        {/*  >*/}
        {/*    <div className={cn(styles["title"], "font-weight-medium")}>*/}
        {/*      {shop.name}*/}
        {/*    </div>*/}
        {/*    <div className={cn(styles["address"], "font-size-sm")}>*/}
        {/*      {shop.address}*/}
        {/*    </div>*/}
        {/*    <div*/}
        {/*      className={cn(styles["chevron"], "far fa-chevron-right")}*/}
        {/*    ></div>*/}
        {/*  </a>*/}
        {/*))}*/}
      </div>
      <div className={cn(styles["bottom"])}>
        <div className={cn("font-size-sm", "font-text-light")}>
          Need to re-order this sample?
        </div>
        <button
          className={cn(styles["add-to-cart-button"], "button")}
          onClick={props.addToCart(item)}
        >
          <div>
            <i
              className={cn("far", "fa-cart-arrow-down", styles.addCartIcon)}
            />
            <span className={cn(styles["button-text"])}>
              Add sample to cart
            </span>
          </div>
          <span className={styles.addCartPrice}>
            {parseCurrency(item.product_sale_price.currency)}
            {item.product_sale_price.value}
          </span>
        </button>
      </div>
    </div>
  );
}
