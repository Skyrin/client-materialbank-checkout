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
          src="http://18.221.132.151/pub/static/version1605751353/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg"
        />
        <div className={styles.infoContainer}>
          <span className={styles.lightText}>{props.cartItem.productType}</span>
          <span className={styles.boldText}>{props.cartItem.name}</span>
          <span className={styles.lightText}>Oatmeal</span>
        </div>
      </div>
      <span className={styles.price}>{`$${props.cartItem.price}`}</span>
    </div>
  );
}
