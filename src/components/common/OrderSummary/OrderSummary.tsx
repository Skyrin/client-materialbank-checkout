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
import OrderItem from "./OrderItem/OrderItem";
import { isEqual } from "lodash-es";
import { getSamplePage } from "utils/general";

type Props = RouteComponentProps & {
  className?: string;
};
type State = {
  isOpen: boolean;
};

class OrderSummary extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  oldContext!: AppContextState;

  state = {
    isOpen: false,
  };

  componentDidMount() {
    this.oldContext = this.context;
  }

  componentDidUpdate = (prevProps: Props, prevState: State) => {
    if (!isEqual(this.oldContext, this.context)) {
      const oldCart = this.oldContext.cart;
      const newCart = this.context.cart;
      if (!isEqual(oldCart, newCart)) {
        this.context.requestRecommendedProductSKUs(2);
      }
    }
    this.oldContext = this.context;
  };

  renderSummaryHeader = () => {
    const cart = this.context.cart;
    const confirmedOrder = this.context.confirmedOrder;

    const total = this.isOnConfirmationPage()
      ? confirmedOrder?.total?.subtotal?.value || 0
      : cart?.prices?.subtotal_including_tax?.value || 0;

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
        <span className={styles.total}>{`$${total}`}</span>
      </div>
    );
  };

  renderGiftSection = () => {
    const recommendedSKUs = this.context.recommendedProductSKUs;
    const products = recommendedSKUs
      .map((sku) => this.context.productsCache.getProduct(sku))
      .filter((p) => !p.loading);
    // const products = [
    //   { sku: "123", name: "Test", color: "Blue", manufacturer: "Test Man", thumbnail_url: "https://dev.design.shop/media/catalog/product/cache/53e412d837cb1f799c5a72f2deb3b0f2/base_image/10000/100305223.jpg" },
    //   { sku: "234", name: "Test 2", color: "Red", manufacturer: "Test Man 2", thumbnail_url: "https://dev.design.shop/media/catalog/product/cache/53e412d837cb1f799c5a72f2deb3b0f2/base_image/10000/100305223.jpg" }
    // ]

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
              product={product}
              onClick={() => {
                window.location = getSamplePage(product.sku);
              }}
            />
          ))}
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
    const confirmedOrder = this.context.confirmedOrder;

    const subtotal = this.isOnConfirmationPage()
      ? confirmedOrder?.total?.subtotal?.value || 0
      : cart?.prices?.subtotal_including_tax?.value || 0;

    return (
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
    );
  };

  isOnConfirmationPage = () => {
    return !!matchPath(this.props.location.pathname, {
      path: ORDER_CONFIRMATION_URL,
      exact: true,
    });
  };

  render() {
    const cart = this.context.cart;
    const confirmedOrder = this.context.confirmedOrder;

    const items = this.isOnConfirmationPage()
      ? confirmedOrder?.items || []
      : cart?.items || [];

    const total = this.isOnConfirmationPage()
      ? confirmedOrder?.total?.subtotal?.value || 0
      : cart?.prices?.subtotal_including_tax?.value || 0;

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
            {items.map((item: any) => (
              <React.Fragment key={item.id}>
                {this.isOnConfirmationPage() ? (
                  <OrderItem orderItem={item} />
                ) : (
                  <CartItem cartItem={item} />
                )}
              </React.Fragment>
            ))}
          </div>
          {!isOnMobile() &&
            (this.isOnConfirmationPage()
              ? this.renderAddedGiftsSection()
              : this.renderGiftSection())}
          {this.renderPricesSection()}
          <div className={styles.totalContainer}>
            <span>Total</span>
            <span>{`$${total}`}</span>
          </div>

          {(this.context.cartInfoLoading ||
            this.context.confirmedOrderLoading) && (
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
