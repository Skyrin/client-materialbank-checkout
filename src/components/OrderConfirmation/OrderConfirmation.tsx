import React from "react";
import { Recommendations } from "../common/Recommendations/Recommendations";
import Logo from "../common/Logo/Logo";
import cn from "classnames";
import styles from "../OrderConfirmation/OrderConfirmation.module.scss";

export class OrderConfirmation extends React.Component {
  user = {
    firstName: "John",
  };
  order = {
    number: 2625117283,
  };
  recommendations = [
    {
      id: 1,
      title: "Your mother was a hamster",
      image:
        "https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png",
      type: 1,
    },
    {
      id: 2,
      title: "And your father smelled of elderberries",
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

  customerInfo = {
    customerEmail: "johndoe@gmail.com",
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

  constructor(props: any) {
    super(props);
  }

  recommendationClick(productId: number): void {
    console.log(productId);
  }

  render() {
    return (
      <div className={cn("funnel-page")}>
        <Logo />
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

        <h2 className={styles["section-title"]}>
          Based on your order, we think you'll love these:
        </h2>
        <Recommendations
          className={styles["Recommendations"]}
          recommendations={this.recommendations}
          recommendationClick={this.recommendationClick}
        />
        <h2 className={styles["section-title"]}>Customer Information</h2>
        <div className={styles["customer-information"]}>
          <div className={styles["customer-information"]}></div>
        </div>
      </div>
    );
  }
}
