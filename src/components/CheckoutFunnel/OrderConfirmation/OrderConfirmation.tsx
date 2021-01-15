import React from "react";
import cn from "classnames";
import styles from "./OrderConfirmation.module.scss";
import Logo from "components/common/Logo/Logo";
import { Recommendations } from "components/common/Recommendations/Recommendations";
import { isOnMobile } from "../../../utils/responsive";
import { scrollToTop } from "utils/general";
import { MAIN_SHOP_URL } from "constants/urls";

export default class OrderConfirmation extends React.Component {
  user = {
    firstName: "John",
  };
  order = {
    number: 2625117283,
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

  // TODO: Create a class/type for this info once we have API docs
  customerInfo = {
    customerEmail: "johndoe@gmail.com",
    customerName: "John Doe",
    paymentInfo: {
      cardIssuer: "VISA",
      cardNumber: "1234",
      amount: 178.72,
      currency: "$",
    },
    shippingAddress: {
      name: "John Doe",
      companyName: "Vaudeville Ventures",
      address: "236 W 30th Street 11th Floor",
      city: "New York",
      state: "NY",
      postalCode: "10001",
    },
    billingAddress: {
      name: "John Doe",
      companyName: "Vaudeville Ventures",
      address: "236 W 30th Street 11th Floor",
      city: "New York",
      state: "NY",
      postalCode: "10001",
    },
  };

  componentDidMount() {
    scrollToTop();
  }

  recommendationClick(productId: number): void {}

  render() {
    const customerEmail = this.customerInfo.customerEmail;
    const customerName = this.customerInfo.customerName;
    const paymentInfo = this.customerInfo.paymentInfo;
    const shippingAddress = this.customerInfo.shippingAddress;
    const billingAddress = this.customerInfo.billingAddress;

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
            Order #{this.order.number}
          </div>
          <h2
            className={cn(
              styles["thank-you"],
              styles["confirmation-text-row"],
              "font-weight-medium"
            )}
          >
            Thank you, {this.user.firstName}!
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
                <span>{shippingAddress.name}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>{shippingAddress.companyName}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>{shippingAddress.address}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>
                  {shippingAddress.city},&nbsp;{shippingAddress.state}&nbsp;
                  {shippingAddress.postalCode}
                </span>
              </div>
            </div>
          </div>

          <div className={styles["customer-info-column"]}>
            <div className={cn(styles["info-cell"], styles["payment-method"])}>
              <div className={styles["cell-title"]}>Payment Method</div>
              <div className={styles["text-row"]}>
                <div className={styles["card-img"]} />
                <span>
                  ending in {paymentInfo.cardNumber}&nbsp; -{" "}
                  {paymentInfo.currency}
                  {paymentInfo.amount}
                </span>
              </div>
            </div>

            <div className={cn(styles["info-cell"], styles["billing-address"])}>
              <div className={styles["cell-title"]}>Billing Address</div>
              <div className={styles["text-row"]}>
                <span>{billingAddress.name}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>{billingAddress.companyName}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>{billingAddress.address}</span>
              </div>
              <div className={styles["text-row"]}>
                <span>
                  {billingAddress.city},&nbsp;{billingAddress.state}&nbsp;
                  {billingAddress.postalCode}
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
