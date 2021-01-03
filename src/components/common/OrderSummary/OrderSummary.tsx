import Input from "components/common/Input/Input";
import { CartItemT } from "constants/types";
import * as React from "react";
import CartItem from "./CartItem/CartItem";
import styles from "./OrderSummary.module.scss";

type Props = {};
type State = {
  cartItems: CartItemT[];
  promoCode: string;
  isMobileExpanded: boolean;
};

export default class OrderSummary extends React.Component<Props, State> {
  state = {
    cartItems: [
      {
        itemId: "1",
        name: "Test Product 1",
        price: 100,
        productType: "Test Type 1",
      },
      {
        itemId: "2",
        name: "Test Product 2",
        price: 50,
        productType: "Test Type 2",
      },
      {
        itemId: "3",
        name: "Test Product 3",
        price: 25,
        productType: "Test Type 3",
      },
    ],
    promoCode: "",
    isMobileExpanded: false,
  };

  onActionButtonClick = () => {
    console.log("APPLY PROMO CODE", this.state.promoCode);
    this.setState({ promoCode: "" });
  };

  toggleExpand(): void {
    this.setState((prevState) => ({
      isMobileExpanded: !prevState.isMobileExpanded,
    }));
  }

  render() {
    const subtotal = this.state.cartItems.reduce((s, ci) => s + ci.price, 0);

    return (
      <div className={styles.OrderSummary}>
        {/* Mobile expand button*/}
        <div
          className={styles["mobile-expand-button"]}
          onClick={() => this.toggleExpand()}
        >
          <i className="fas fa-shopping-cart"></i>
          <span className={styles["expand-text"]}>Show order summary</span>
          {this.state.isMobileExpanded ? (
            <i className="far fa-chevron-up"></i>
          ) : (
            <i className="far fa-chevron-down"></i>
          )}
          <div className={styles["expand-price"]}>${subtotal}</div>
        </div>

        <div
          className={`${styles["content"]} ${
            this.state.isMobileExpanded ? styles["mobile-expanded"] : ""
          }`}
        >
          <h3 className={styles.title}>Order Summary</h3>
          <div className={styles.itemsContainer}>
            {this.state.cartItems.map((ci: CartItemT) => (
              <CartItem key={ci.itemId} cartItem={ci} />
            ))}
          </div>
          <div className={styles.promoCodeContainer}>
            <h4 className={styles.subtitle}>Promo Code</h4>
            <Input
              placeholder="Have a promo code?"
              value={this.state.promoCode}
              onChange={(val: string) => {
                this.setState({ promoCode: val });
              }}
              actionButton="Apply"
              onActionButtonClick={this.onActionButtonClick}
            />
          </div>
          <div className={styles.pricesContainer}>
            <div className={styles.priceLine}>
              <span>Subtotal</span>
              <span>{`$${subtotal}`}</span>
            </div>
            <div className={styles.priceLine}>
              <span>Shipping</span>
              <span>FREE</span>
            </div>
          </div>
          <div className={styles.totalContainer}>
            <span>Total</span>
            <span>{`$${subtotal}`}</span>
          </div>
        </div>
      </div>
    );
  }
}
