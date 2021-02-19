import React from "react";
import cn from "classnames";
import styles from "./OrderConfirmation.module.scss";
import Logo from "components/common/Logo/Logo";
import { Recommendations } from "components/common/Recommendations/Recommendations";
import { isOnMobile } from "../../../utils/responsive";
import { scrollToTop } from "utils/general";
import { MAIN_SHOP_URL } from "constants/urls";
import { AppContext, AppContextState } from "context/AppContext";
import { get } from "lodash-es";
import { PaymentOption } from "../PaymentInformation/PaymentInformation";
import applePayLogo from "assets/images/apple_pay_logo_black.svg";
import paypalLogo from "assets/images/paypal_logo.svg";
import {
  ORDER_ID_STORAGE_KEY,
  ORDER_NUMBER_STORAGE_KEY,
} from "constants/general";
import { requestCustomerOrders, requestOrder } from "context/CustomerAPI/api";
import { OrderT } from "constants/types";
import Loader from "components/common/Loader/Loader";

type State = {
  loadingOrder: boolean;
};

export default class OrderConfirmation extends React.Component<any, State> {
  static contextType = AppContext;
  context!: AppContextState;

  state = {
    loadingOrder: true,
  };

  // TODO: Create a class/type for this info once we have API docs
  recommendations = [
    {
      id: 1,
      title: "Product Title 1",
      image:
        "https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png",
      type: 1,
    },
    {
      id: 2,
      title: "Product Title 2",
      image: "",
      type: 1,
    },
    {
      id: 3,
      title: "Product Title 3",
      image: "",
      type: 1,
    },
    {
      id: 4,
      title: "Product Title 4",
      image: "",
      type: 1,
    },
    {
      id: 5,
      title: "Product Title 5",
      image: "",
      type: 1,
    },
    {
      id: 6,
      title: "Product Title 6",
      image: "",
      type: 1,
    },
  ];

  async componentDidMount() {
    scrollToTop();
    await this.context.requestConfirmedOrder();
  }

  recommendationClick(productId: number): void {}

  parseAddress = (address: any) => {
    const parsedAddress = {
      ...address,
    };
    if (get(address, "region.code")) {
      parsedAddress.region = address.region.code;
    }
    return parsedAddress;
  };

  render() {
    console.log(this.context.confirmedOrderLoading);
    if (this.context.confirmedOrderLoading) {
      return (
        <div className={cn("funnel-page", styles["OrderConfirmation"])}>
          {!isOnMobile() && <Logo className={styles.logo} />}
          <Loader />
        </div>
      );
    }
    const customerEmail = this.context.customer.email;
    const customerName = `${this.context.customer.firstname} ${this.context.customer.lastname}`;
    const orderPaymentOption = get(
      this.context.confirmedOrder,
      "payment_methods[0]"
    );
    let selectedPaymentOption = this.context.selectedPaymentOption;
    if (orderPaymentOption && orderPaymentOption.type === "paypal_express") {
      selectedPaymentOption = PaymentOption.PayPal;
    }
    if (orderPaymentOption && orderPaymentOption.type === "stripe_payments") {
      selectedPaymentOption = PaymentOption.CreditCard;
    }
    console.log(this.context.confirmedOrder);
    const shippingAddress = this.parseAddress(
      get(
        this.context.confirmedOrder,
        "shipping_address",
        get(this.context.cart, "shipping_addresses[0]")
      )
    );
    const billingAddress = this.parseAddress(
      get(
        this.context.confirmedOrder,
        "billing_address",
        get(this.context.cart, "billing_address")
      )
    );
    const orderNumber = get(this.context.confirmedOrder, "number", "");
    const orderAmount = get(
      this.context.confirmedOrder,
      "total.subtotal.value",
      get(this.context.cart, "prices.subtotal_including_tax.value", 172)
    );
    return (
      <div className={cn("funnel-page", styles["OrderConfirmation"])}>
        {!isOnMobile() && <Logo className={styles.logo} />}

        {/* CONFIRMATION TEXTS */}

        <div className={styles["confirmation-text"]}>
          <div
            className={cn(
              styles["order-number"],
              styles["confirmation-text-row"],
              "text-color-light font-size-md"
            )}
          >
            Order #{orderNumber}
          </div>
          <h2
            className={cn(
              styles["thank-you"],
              styles["confirmation-text-row"],
              "font-weight-medium"
            )}
          >
            Thank you, {this.context.customer.firstname}!
          </h2>
          <div
            className={cn(
              styles["confirmation-details"],
              styles["confirmation-text-row"]
            )}
          >
            Your order is confirmed. You’ll recieve an email when your order has
            shipped.
          </div>
          <div
            className={cn(
              styles["pill"],
              styles["confirmation-text-row"],
              "font-size-md"
            )}
          >
            <i className="far fa-shipping-fast font-size-xxl" />
            <span>
              All Design Shop orders are shipped
              <span className="font-weight-bold">&nbsp;FREE&nbsp;</span>via
              FedEx Priority Overnight!
            </span>
          </div>
        </div>

        {/* RECOMMENDATIONS */}

        <div className={styles["recommendations-container"]}>
          <h2 className={styles["section-title"]}>
            Based on your order, we think you'll love these:
          </h2>
          <Recommendations
            className={styles["Recommendations"]}
            recommendations={this.recommendations}
            recommendationClick={this.recommendationClick}
          />
        </div>

        {/* CUSTOMER INFORMATION */}

        <h2 className={styles["section-title"]}>Customer Information</h2>

        <div className={styles["customer-info-grid"]}>
          <div className={styles["customer-info-column"]}>
            <div
              className={cn(styles["info-cell"], styles["contact-information"])}
            >
              <div className={styles["cell-title"]}>Contact Information</div>
              <div className={styles["text-row"]}>{customerName}</div>
              <div className={styles["text-row"]}>{customerEmail}</div>
            </div>

            <div
              className={cn(styles["info-cell"], styles["shipping-address"])}
            >
              <div className={styles["cell-title"]}>Shipping Address</div>
              <div className={styles["text-row"]}>
                <span>{`${shippingAddress.firstname} ${shippingAddress.lastname}`}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>{shippingAddress.company}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>
                  {shippingAddress.street && shippingAddress.street.join(" ")}
                </span>
              </div>
              <div className={styles["text-row"]}>
                <span>
                  {shippingAddress.city},&nbsp;{shippingAddress.region}
                  &nbsp;
                  {shippingAddress.postcode}
                </span>
              </div>
            </div>
          </div>

          <div className={styles["customer-info-column"]}>
            <div className={cn(styles["info-cell"], styles["payment-method"])}>
              <div className={styles["cell-title"]}>Payment Method</div>
              <div className={styles["text-row"]}>
                {(!selectedPaymentOption ||
                  selectedPaymentOption === PaymentOption.ExistingCreditCard ||
                  selectedPaymentOption === PaymentOption.CreditCard) && (
                  <React.Fragment>
                    <div className={styles["card-img"]} />
                    <span>
                      Credit Card&nbsp;-&nbsp;
                      {this.context.cart?.prices?.subtotal_including_tax
                        ?.currency || "$"}
                      {orderAmount || "172"}
                    </span>
                  </React.Fragment>
                )}
                {selectedPaymentOption === PaymentOption.ApplePay && (
                  <React.Fragment>
                    <img
                      src={applePayLogo}
                      alt=""
                      className={styles.applePay}
                    />
                    <span>
                      &nbsp;-&nbsp;
                      {this.context.cart?.prices?.subtotal_including_tax
                        ?.currency || "$"}
                      {orderAmount || "172"}
                    </span>
                  </React.Fragment>
                )}
                {selectedPaymentOption === PaymentOption.PayPal && (
                  <React.Fragment>
                    <img src={paypalLogo} alt="" className={styles.paypal} />
                    <span>
                      &nbsp;-&nbsp;
                      {this.context.cart?.prices?.subtotal_including_tax
                        ?.currency || "$"}
                      {orderAmount || "172"}
                    </span>
                  </React.Fragment>
                )}
              </div>
            </div>

            <div className={cn(styles["info-cell"], styles["billing-address"])}>
              <div className={styles["cell-title"]}>Billing Address</div>
              <div className={styles["text-row"]}>
                <span>{`${billingAddress.firstname} ${billingAddress.lastname}`}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>{billingAddress.company}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>
                  {billingAddress.street && billingAddress.street.join(" ")}
                </span>
              </div>
              <div className={styles["text-row"]}>
                <span>
                  {billingAddress.city},&nbsp;{billingAddress.region}&nbsp;
                  {billingAddress.postcode}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles["bottom-actions"]}>
          <div className={styles["contact-us"]}>
            <i className={cn(styles["chat-icon"], "fas fa-comments-alt")} />
            Need Help?
            <a href="/">Contact Us</a>
          </div>

          <a
            href={MAIN_SHOP_URL}
            className={cn(styles["back-to-shopping"], "button")}
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }
}
