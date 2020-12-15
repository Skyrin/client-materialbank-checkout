import { CartItemT } from "constants/types";
import * as React from "react";
import styles from "./CartItem.module.scss";

type Props = {
  cartItem: CartItemT;
};

export default function CartItem(props: Props) {
  return (
    <div className={styles.CartItem}>
      <div className={styles.itemInfo}>
        <img
          className={styles.image}
          alt=""
          src={props.cartItem.product?.image?.url}
        />
        <div className={styles.infoContainer}>
          <span className={styles.lightText}>Walls & Co.</span>
          <span className={styles.boldText}>
            {props.cartItem.product?.name}
          </span>
          <span className={styles.lightText}>Oatmeal</span>
        </div>
      </div>
      <div className={styles.priceContainer}>
        <span className={styles.price}>{`$${
          props.cartItem.prices?.row_total_including_tax?.value || ""
        }`}</span>
        <span className={styles.quantity}>{}</span>
      </div>
    </div>
  );
}
