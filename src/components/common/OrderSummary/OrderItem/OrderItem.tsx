import { OrderItemT } from "constants/types";
import { AppContext, AppContextState } from "context/AppContext";
import * as React from "react";
import styles from "./OrderItem.module.scss";
import { get } from "lodash-es";
import { getSamplePage } from "utils/general";

type Props = {
  orderItem: OrderItemT;
};

export default class OrderItem extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  render() {
    const orderItem = this.props.orderItem;
    const algoliaProduct = this.context.productsCache.getProduct(
      orderItem.product_sku
    );

    const color = get(algoliaProduct, "data.color", "orderItem.color");
    const manufacturer = get(
      algoliaProduct,
      "data.manufacturer",
      "orderItem.manufacturer"
    );

    const imageUrl = get(
      algoliaProduct,
      "data.thumbnail_url",
      "https://dev.design.shop/static/version1613493863/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg"
    );
    return (
      <div className={styles.OrderItem}>
        <div className={styles.itemInfo}>
          <a href={getSamplePage(orderItem.product_sku)}>
            <img className={styles.image} alt="" src={imageUrl} />
          </a>
          <div className={styles.infoContainer}>
            <span className={styles.lightText}>{manufacturer}</span>
            <span className={styles.boldText}>{orderItem.product_name}</span>
            {color && <span className={styles.lightText}>{color}</span>}
          </div>
        </div>
        <div className={styles.priceContainer}>
          <span className={styles.price}>{`$${
            orderItem.product_sale_price.value || ""
          }`}</span>
          <span
            className={styles.quantity}
          >{`Quantity: ${orderItem.quantity_ordered}`}</span>
        </div>
      </div>
    );
  }
}
