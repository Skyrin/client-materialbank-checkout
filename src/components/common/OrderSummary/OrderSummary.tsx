import { CartItemT } from "constants/types";
import * as React from "react";
import CartItem from "./CartItem/CartItem";
import styles from "./OrderSummary.module.scss";
import { AppContext, AppContextState } from "context/AppContext";
import { isOnMobile } from "utils/responsive";
import cn from "classnames";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";
import PromoCode from "../PromoCode/PromoCode";
import Loader from "../Loader/Loader";
import { RouteComponentProps, withRouter, matchPath } from "react-router-dom";
import { ORDER_CONFIRMATION_URL } from "constants/urls";

type Props = RouteComponentProps & {
  className?: string;
};
type State = {
  isOpen: boolean;
};

class OrderSummary extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;

  state = {
    isOpen: false,
  };

  renderSummaryHeader = () => {
    const cart = this.context.cart;

    return (
      <div
        className={styles.summaryHeader}
        onClick={() => {
          this.setState({ isOpen: !this.state.isOpen });
        }}
      >
        <div className={styles.text}>
          <i className={cn("fas fa-shopping-cart", styles.cartIcon)} />
          {this.state.isOpen ? "Hide order summary" : "Show order summary"}
          <i
            className={cn("far", styles.chevron, {
              "fa-angle-up": this.state.isOpen,
              "fa-angle-down": !this.state.isOpen,
            })}
          />
        </div>
        <span className={styles.total}>{`$${
          cart?.prices?.subtotal_including_tax?.value || 0
        }`}</span>
      </div>
    );
  };

  renderGiftSection = () => {
    return (
      <div className={styles.section}>
        <div className={styles.giftSectionHeader}>
          <i className={cn("fal", "fa-gift", styles.giftIcon)} />
          <span className={styles.giftSectionTitle}>
            Select A Free Gift With Your Order
          </span>
        </div>
        <span className={styles.giftSectionDescription}>
          Get an issue of Table Magazine or Mockup Magazine as a thank you for
          ordering from Design Shop!
        </span>
        <div className={styles.giftsContainer}>
          <RecommendationCard
            title="Table Magazine Issue #45"
            type={2}
            click={() => {
              console.log("CLICKED GIFT CARD");
            }}
          />
          <RecommendationCard
            title="Mockup Magazine Issue #21"
            type={2}
            click={() => {
              console.log("CLICKED GIFT CARD");
            }}
          />
        </div>
        <PromoCode />
      </div>
    );
  };

  renderAddedGiftsSection = () => {
    return (
      <div className={styles.addedGiftsContainer}>
        <div className={styles.giftsContainer}>
          <RecommendationCard title="Table Magazine Issue #45" type={2} added />
        </div>
      </div>
    );
  };

  renderPricesSection = () => {
    const cart = this.context.cart;

    return (
      <div className={styles.pricesContainer}>
        <div className={styles.priceLine}>
          <span>Subtotal</span>
          <span>{`$${cart?.prices?.subtotal_including_tax?.value || 0}`}</span>
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
    const cartItems = cart?.items || [];

    const isOnConfirmationPage = !!matchPath(this.props.location.pathname, {
      path: ORDER_CONFIRMATION_URL,
      exact: true,
    });

    return (
      <div
        className={cn(styles.OrderSummary, this.props.className, {
          [styles.collapsed]: !this.state.isOpen,
        })}
      >
        <h3 className={styles.title}>Order Summary</h3>
        {isOnMobile() && this.renderSummaryHeader()}

        <div className={styles.orderSummaryContainer}>
          <div className={styles.itemsContainer}>
            {cartItems.map((ci: CartItemT) => (
              <CartItem key={ci.id} cartItem={ci} />
            ))}
          </div>
          {!isOnMobile() &&
            (isOnConfirmationPage
              ? this.renderAddedGiftsSection()
              : this.renderAddedGiftsSection())}
          {this.renderPricesSection()}
          <div className={styles.totalContainer}>
            <span>Total</span>
            <span>{`$${
              cart?.prices?.subtotal_including_tax?.value || 0
            }`}</span>
          </div>

          {this.context.cartInfoLoading && (
            <Loader
              containerClassName={styles.loaderContainer}
              loaderClassName={styles.loader}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(OrderSummary);
