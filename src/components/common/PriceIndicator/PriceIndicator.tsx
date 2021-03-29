import styles from "./PriceIndicator.module.scss";
import cn from "classnames";
import React from "react";
import _ from "lodash";

type Props = {
  className?: string;
  priceValue: number;
  maxPrice: number;
};

export default function PriceIndicator(props: Props) {
  return (
    <div className={cn(styles.priceIndicator, props.className)}>
      {_.times(props.maxPrice, (index) => {
        return (
          <div
            key={index}
            className={cn(styles.dollarSign, {
              [styles.disabled]: props.priceValue < index + 1,
            })}
          >
            $
          </div>
        );
      })}
    </div>
  );
}
