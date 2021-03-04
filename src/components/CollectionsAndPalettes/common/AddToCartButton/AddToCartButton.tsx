import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/AddToCartButton/AddToCartButton.module.scss";
import cn from "classnames";

interface Props {
  isInViewPort: boolean;
}

export default class AddToCartButton extends React.Component<Props, any> {
  render() {
    console.log(this.props.isInViewPort);
    return (
      <div
        className={cn(
          styles.addToCartButton,
          this.props.isInViewPort ? styles.fixed : styles.absolute
        )}
      >
        <div>
          <i className="far fa-shopping-cart"></i>
          <span>Add all samples to cart</span>
        </div>
        <span>$120</span>
      </div>
    );
  }
}
