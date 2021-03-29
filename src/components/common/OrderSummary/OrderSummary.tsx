import * as React from "react";
import CartItem from "./CartItem/CartItem";
import styles from "./OrderSummary.module.scss";
import { AppContext, AppContextState } from "context/AppContext";
import { isOnMobile } from "utils/responsive";
import cn from "classnames";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";
import Loader from "../Loader/Loader";
import { RouteComponentProps, withRouter, matchPath } from "react-router-dom";
import { ORDER_CONFIRMATION_URL } from "constants/urls";
import OrderItem from "./OrderItem/OrderItem";
import { isEmpty, isEqual, get } from "lodash-es";
import { getSamplePage } from "utils/general";
import Logo from "../Logo/Logo";
import { DateTime } from "luxon";
import fedexLogo from "assets/images/fedex_logo.svg";

type Props = RouteComponentProps & {
  className?: string;
};

type State = {
  showShippingInfo: boolean;
  showOrderItems: boolean;
  showPaymentInfo: boolean;
};

class OrderSummary extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  oldContext!: AppContextState;

  state = {
    showShippingInfo: !isOnMobile(),
    showOrderItems: false,
    showPaymentInfo: !isOnMobile(),
  };

  componentDidMount() {
    this.oldContext = this.context;
  }

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    if (!isEqual(this.oldContext, this.context)) {
      const oldCart = this.oldContext.cart;
      const newCart = this.context.cart;

      if (
        !this.isOnConfirmationPage() &&
        !isEqual(oldCart, newCart) &&
        !isEmpty(newCart)
      ) {
        const oldSkus = (oldCart.items || []).map((item) => item.product.sku);
        const newSkus = newCart.items.map((item) => item.product.sku);
        if (!isEqual(oldSkus, newSkus) && newSkus.length) {
          this.context.requestRecommendedProductSKUs(6);
        }
      }
    }
    this.oldContext = this.context;
  };

  renderCurrency = (value?: number, def?: string) => {
    if (!value) {
      return def;
    }
    return `$${value.toFixed(2)}`;
  };

  renderLogo = () => {
    return (
      <div className={styles.logoWrapper}>
        <a href="/" className={styles.backArrow}>
          <i className={"far fa-arrow-left"} />
        </a>
        <Logo className={styles.logo} circleClassName={styles.circle} header />
      </div>
    );
  };

  renderSubtotal = () => {
    return (
      <div className={styles.subtotalWrapper}>
        <div className={styles.label}>SUBTOTAL</div>
        <div className={styles.value}>
          {this.renderCurrency(
            this.context.cart?.prices?.subtotal_including_tax?.value,
            "-"
          )}
        </div>
      </div>
    );
  };

  renderRecommendationSection = () => {
    const recommendedSKUs = this.context.recommendedProductSKUs;
    const products = recommendedSKUs
      .map((sku) => this.context.productsCache.getProduct(sku))
      .filter((p) => !p.loading)
      .map((p) => p.data);
    if (!products.length) {
      return null;
    }

    return (
      <div className={styles.section}>
        <div className={styles.giftSectionHeader}>
          <span className={styles.giftSectionTitle}>You may also like</span>
        </div>
        <div className={styles.giftsContainer}>
          {products.map((product) => (
            <RecommendationCard
              key={`recommendation_${product.sku}`}
              product={product}
              onClick={() => {
                window.location = getSamplePage(product.sku);
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  isOnConfirmationPage = () => {
    return !!matchPath(this.props.location.pathname, {
      path: ORDER_CONFIRMATION_URL,
      exact: true,
    });
  };

  renderOrderInfo = () => {
    const order = this.context.confirmedOrder;
    return (
      <div className={cn(styles.section, styles.orderInfoContainer)}>
        <div className={styles.orderNumber}>{`Order #${order.number}`}</div>
        <div className={styles.thanks}>
          Thanks for your order, {this.context.customer.firstname}!
        </div>
        <div className={styles.confirmation}>
          Your order is confirmed. We'll send an email to{" "}
          {this.context.customer.email} when your order has shipped.
        </div>
      </div>
    );
  };

  renderShippingInfo = () => {
    const order = this.context.confirmedOrder;
    const shippingAddress = get(order, "shipping_address", {});

    return (
      <div className={cn(styles.section, styles.shippingInfoContainer)}>
        <div
          className={styles.header}
          onClick={() => {
            this.setState({ showShippingInfo: !this.state.showShippingInfo });
          }}
        >
          <div className={styles.title}>Delivery Details</div>
          <i
            className={cn(
              "far",
              styles.chevron,
              this.state.showShippingInfo ? "fa-chevron-up" : "fa-chevron-down"
            )}
          />
        </div>
        <div
          className={cn(styles.content, {
            [styles.collapsed]: !this.state.showShippingInfo,
          })}
        >
          <div className={styles.deliveryInfo}>
            <div className={styles.deliverTo}>
              <div className={styles.subtitle}>Deliver to</div>
              <div
                className={styles.value}
              >{`${this.context.customer.firstname} ${this.context.customer.lastname}`}</div>
              <div className={styles.value}>{this.context.customer.email}</div>
            </div>
            <div className={styles.shippingAddress}>
              <div className={styles.subtitle}>Shipping Address</div>
              <div
                className={styles.value}
              >{`${shippingAddress.firstname} ${shippingAddress.lastname}`}</div>
              <div className={styles.value}>
                {(shippingAddress.street || []).join(", ")}
              </div>
              <div className={styles.value}>
                {[
                  shippingAddress.city,
                  shippingAddress.region,
                  shippingAddress.postcode,
                ]
                  .filter((c) => c)
                  .join(", ")}
              </div>
            </div>
          </div>
          <div className={styles.shippingMethod}>
            <div className={styles.subtitle}>Shipping Method</div>
            <img src={fedexLogo} alt="FedEx" className={styles.fedexLogo} />
            <div className={styles.value}>
              FREE FedEx Overnight: Scheduled delivery tomorrow,{" "}
              {DateTime.local().plus({ days: 1 }).toFormat("MMMM d")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderOrderItems = () => {
    const items = this.context.confirmedOrder.items || [];

    return (
      <div className={cn(styles.section, styles.productsContainer)}>
        <div
          className={styles.header}
          onClick={() => {
            this.setState({ showOrderItems: !this.state.showOrderItems });
          }}
        >
          <div className={styles.title}>
            Order Summary (
            {this.renderCurrency(
              this.context.confirmedOrder.total?.subtotal?.value,
              "-"
            )}
            )
          </div>
          <i
            className={cn(
              "far",
              styles.chevron,
              this.state.showOrderItems ? "fa-chevron-up" : "fa-chevron-down"
            )}
          />
        </div>
        <div
          className={cn(styles.content, {
            [styles.collapsed]: !this.state.showOrderItems,
          })}
        >
          <div className={styles.list}>
            {items.map((item) => (
              <OrderItem key={item.id} orderItem={item} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  renderPaymentMethod = () => {
    const payment = this.context.confirmedOrder?.payment || {};
    if (payment.type === "Credit Card") {
      return (
        <React.Fragment>
          <div className={styles.value}>{`Card number: ${(
            payment.cardType || ""
          ).toUpperCase()} ****${payment.last4}`}</div>
          <div className={styles.value}>{`Expiration: ${payment.expires}`}</div>
          <div className={styles.value}>{`Amount: ${this.renderCurrency(
            this.context.confirmedOrder?.total?.grand_total?.value
          )}`}</div>
        </React.Fragment>
      );
    }
  };

  renderPaymentInfo = () => {
    const payment = this.context.confirmedOrder?.payment || {};
    const billingAddress = this.context.confirmedOrder?.billing_address || {};
    return (
      <div className={cn(styles.section, styles.paymentInfoContainer)}>
        <div
          className={styles.header}
          onClick={() => {
            this.setState({ showPaymentInfo: !this.state.showPaymentInfo });
          }}
        >
          <div className={styles.title}>Payment Information</div>
          <i
            className={cn(
              "far",
              styles.chevron,
              this.state.showPaymentInfo ? "fa-chevron-up" : "fa-chevron-down"
            )}
          />
        </div>
        <div
          className={cn(styles.content, {
            [styles.collapsed]: !this.state.showPaymentInfo,
          })}
        >
          <div className={styles.paymentInfo}>
            <div className={styles.paymentMethod}>
              <div className={styles.subtitle}>{payment.type}</div>
              {this.renderPaymentMethod()}
            </div>
            <div className={styles.billingAddress}>
              <div className={styles.subtitle}>Billing Address</div>
              <div
                className={styles.value}
              >{`${billingAddress.firstname} ${billingAddress.lastname}`}</div>
              <div className={styles.value}>
                {(billingAddress.street || []).join(", ")}
              </div>
              <div className={styles.value}>
                {[
                  billingAddress.city,
                  billingAddress.region,
                  billingAddress.postcode,
                ]
                  .filter((c) => c)
                  .join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const cart = this.context.cart;
    const confirmedOrder = this.context.confirmedOrder;

    const items = this.isOnConfirmationPage()
      ? confirmedOrder?.items || []
      : cart?.items || [];

    return (
      <div
        className={cn(styles.OrderSummary, this.props.className, {
          [styles.collapsed]: !this.context.orderSummaryOpen,
        })}
      >
        <div className={styles.contentWrapper}>
          {!isOnMobile() && this.renderLogo()}
          {!isOnMobile() &&
            !this.isOnConfirmationPage() &&
            this.renderSubtotal()}
          {this.isOnConfirmationPage() && this.renderOrderInfo()}
          {this.isOnConfirmationPage() && this.renderShippingInfo()}
          {this.isOnConfirmationPage() && this.renderOrderItems()}
          {this.isOnConfirmationPage() && this.renderPaymentInfo()}
          {!this.isOnConfirmationPage() && (
            <div className={styles.orderSummaryContainer}>
              <div className={styles.itemsContainer}>
                {items.map((item: any) => (
                  <React.Fragment key={item.id}>
                    <CartItem cartItem={item} />
                  </React.Fragment>
                ))}
              </div>
              {!isOnMobile() &&
                !this.isOnConfirmationPage() &&
                this.renderRecommendationSection()}
              {(this.context.cartInfoLoading ||
                this.context.updatingCartInfo) && (
                <Loader
                  containerClassName={styles.loaderContainer}
                  loaderClassName={styles.loader}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(OrderSummary);
