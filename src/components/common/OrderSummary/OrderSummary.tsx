import Input from "components/common/Input/Input";
import { CartItemT } from "constants/types";
import * as React from "react";
import CartItem from "./CartItem/CartItem";
import styles from "./OrderSummary.module.scss";
import { AppContext, AppContextT } from "context/AppContext";
import { isOnMobile } from "utils/responsive";
import cn from "classnames";

type Props = {
  className?: string;
};
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

  renderPromoCodeSection = () => {
    return (
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
    );
  };

  renderPricesSection = () => {
    const cart = this.context.cart;

    return (
      <div className={styles.pricesContainer}>
        <div className={styles.priceLine}>
          <span>Subtotal</span>
          <span>{`$${cart.prices?.subtotal_including_tax?.value || 0}`}</span>
        </div>
        <div className={styles.priceLine}>
          <span>Shipping</span>
          <span>FREE</span>
        </div>
      </div>
    );
  };

  render() {
    const cart = this.context.cart;
    const cartItems = cart.items || [];

    return (
      <div className={cn(styles.OrderSummary, this.props.className)}>
        <h3 className={styles.title}>Order Summary</h3>
        <div className={styles.itemsContainer}>
          {cartItems.map((ci: CartItemT) => (
            <CartItem key={ci.id} cartItem={ci} />
          ))}
        </div>
        {!isOnMobile() && (
          <React.Fragment>
            {this.renderPromoCodeSection()}
            {this.renderPricesSection()}
          </React.Fragment>
        )}
        <div className={styles.totalContainer}>
          <span>Total</span>
          <span>{`$${cart.prices?.subtotal_including_tax?.value || 0}`}</span>
        </div>
      </div>
    );
  }
}
