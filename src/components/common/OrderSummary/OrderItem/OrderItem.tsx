import { OrderItemT } from "constants/types";
import * as React from "react";
import styles from "./OrderItem.module.scss";

type Props = {
  orderItem: OrderItemT;
};

export default function OrderItem(props: Props) {
  const orderItem = props.orderItem;
  let color;
  for (const opt of orderItem.selected_options) {
    if (opt.label === "Configurable Color") {
      color = opt.value;
      break;
    }
  }
  const imageUrl =
    "https://dev.design.shop/static/version1613493863/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg";
  return (
    <div className={styles.OrderItem}>
      <div className={styles.itemInfo}>
        <img className={styles.image} alt="" src={imageUrl} />
        <div className={styles.infoContainer}>
          <span className={styles.lightText}>orderItem.brand</span>
          <span className={styles.boldText}>
            {props.orderItem.product_name}
          </span>
          {color && <span className={styles.lightText}>{color}</span>}
        </div>
      </div>
      <div className={styles.priceContainer}>
        <span className={styles.price}>{`$${
          orderItem.product_sale_price.value || ""
        }`}</span>
        <span
          className={styles.quantity}
        >{`Quantity: ${orderItem.quantity_invoiced}`}</span>
      </div>
    </div>
  );
}
