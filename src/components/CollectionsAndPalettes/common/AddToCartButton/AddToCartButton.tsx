import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/AddToCartButton/AddToCartButton.module.scss";
import cn from "classnames";

interface Props {
  isInViewPort: boolean;
}

export default class CollectionsFooter extends React.Component<Props, any> {
  render() {
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
