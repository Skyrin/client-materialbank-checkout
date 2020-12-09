import React from "react";
import { Recommendations } from "../common/Recommendations/Recommendations";
import Logo from "../common/Logo/Logo";
import cn from "classnames";
import styles from "../PersonalInformation/PersonalInformation.module.scss";

export class OrderConfirmation extends React.Component {
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
  user = {
    firstName: "John",
  };
  order = {
    number: 2625117283,
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
          <div className={styles["order-number"]}>
            Order {this.order.number}
          </div>
          <div className={styles["thank-you"]}>
            Thank you {this.user.firstName}
          </div>
        </div>

        <Recommendations
          title="Based on your order, we think you'll love these:"
          recommendations={this.recommendations}
          recommendationClick={this.recommendationClick}
        />
      </div>
    );
  }
}
