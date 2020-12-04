import { CartItemT } from "constants/types";
import * as React from "react";
import CartItem from "./CartItem/CartItem";
import styles from "./OrderSummary.module.scss";

type Props = {};
type State = {
  cartItems: CartItemT[];
};

export default class OrderSummary extends React.Component<Props, State> {
  state = {
    cartItems: [
      { name: "Test Product 1", price: 100, productType: "Test Type 1" },
      { name: "Test Product 2", price: 50, productType: "Test Type 2" },
      { name: "Test Product 3", price: 25, productType: "Test Type 3" },
    ],
  };

  render() {
    return (
      <div className={styles.OrderSummary}>
        <h3 className={styles.title}>Order Summary</h3>
        <div className={styles.itemsContainer}>
          {this.state.cartItems.map((ci: CartItemT) => (
            <CartItem key={ci.itemId} cartItem={ci} />
          ))}
        </div>
      </div>
    );
  }
}
