import React from "react";
import { Recommendations } from "../common/Recommendations/Recommendations";
import Logo from "../PersonalInformation/PersonalInformation";

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

  constructor(props: any) {
    super(props);
  }

  recommendationClick(productId: number): void {
    console.log(productId);
  }

  render() {
    return (
      <div>
        <Logo />
        <Recommendations
          title="Based on your order, we think you'll love these:"
          recommendations={this.recommendations}
          recommendationClick={this.recommendationClick}
        />
      </div>
    );
  }
}
