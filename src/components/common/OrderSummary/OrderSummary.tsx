import Input from "components/common/Input/Input";
import { CartItemT } from "constants/types";
import * as React from "react";
import CartItem from "./CartItem/CartItem";
import styles from "./OrderSummary.module.scss";
import { AppContext, AppContextT } from "context/AppContext";

type Props = {};
type State = {
  promoCode: string;
};

export default class OrderSummary extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextT;

  state = {
    promoCode: "",
  };

  onActionButtonClick = () => {
    console.log("APPLY PROMO CODE", this.state.promoCode);
    this.setState({ promoCode: "" });
  };

  render() {
    const cart = this.context.cart;
    const cartItems = cart.items || [];
    console.log(cart);

    return (
      <div className={styles.OrderSummary}>
        <h3 className={styles.title}>Order Summary</h3>
        <div className={styles.itemsContainer}>
          {cartItems.map((ci: CartItemT) => (
            <CartItem key={ci.id} cartItem={ci} />
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
            <span>{`$${cart.prices?.subtotal_including_tax?.value}`}</span>
          </div>
          <div className={styles.priceLine}>
            <span>Shipping</span>
            <span>FREE</span>
          </div>
        </div>
        <div className={styles.totalContainer}>
          <span>Total</span>
          <span>{`$${cart.prices?.subtotal_including_tax?.value}`}</span>
        </div>
      </div>
    );
  }
}
