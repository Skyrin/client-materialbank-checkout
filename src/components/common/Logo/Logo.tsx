import * as React from "react";
import styles from "./Logo.module.scss";
import cn from "classnames";

type Props = {
  className?: string;
};

export default function Logo(props: Props) {
  return (
    <div className={cn(styles.Logo, props.className)}>
      <div className={cn(styles["back-button"], "far fa-arrow-left")} />
      <div className={styles.circle} />
      <h1>Design Shop</h1>
    </div>
  );
}
