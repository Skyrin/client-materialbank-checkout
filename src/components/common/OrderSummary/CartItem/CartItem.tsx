import { CartItemT } from "constants/types";
import { AppContext, AppContextState } from "context/AppContext";
import * as React from "react";
import styles from "./CartItem.module.scss";
import { get, sample } from "lodash-es";
import { getSamplePage } from "utils/general";

type Props = {
  cartItem: CartItemT;
};

export default class CartItem extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  render() {
    const cartItem = this.props.cartItem;
    const algoliaProduct = this.context.productsCache.getProduct(
      cartItem.product.sku
    );
    const color = get(algoliaProduct, "data.color", "cartItem.color");
    const manufacturer = get(
      algoliaProduct,
      "data.manufacturer",
      "cartItem.manufacturer"
    );
    const imageUrl = get(
      algoliaProduct,
      "data.thumbnail_url",
      get(
        cartItem,
        "product.image.url",
        "https://dev.design.shop/static/version1613493863/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg"
      )
    );
    const sampleUrl = getSamplePage(cartItem.product.sku);
    return (
      <div className={styles.CartItem}>
        <div className={styles.itemInfo}>
          <a href={sampleUrl}>
            <img className={styles.image} alt="" src={imageUrl} />
          </a>
          <div className={styles.infoContainer}>
            <span className={styles.lightText}>{manufacturer}</span>
            <a href={sampleUrl} className={styles.boldText}>
              {cartItem.product?.name}
            </a>
            {color && <span className={styles.lightText}>{color}</span>}
          </div>
        </div>
        <div className={styles.priceContainer}>
          <span className={styles.price}>{`$${
            cartItem.prices?.row_total_including_tax?.value || ""
          }`}</span>
          <span
            className={styles.quantity}
          >{`Quantity: ${cartItem.quantity}`}</span>
        </div>
      </div>
    );
  }
}
