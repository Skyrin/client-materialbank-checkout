import * as React from "react";
import styles from "./LogoMobile.module.scss";
import cn from "classnames";

type Props = {
  className?: string;
};

export default function LogoMobile(props: Props) {
  return (
    <div className={cn(styles.LogoMobile, props.className)}>
      <div className={cn(styles["back-button"], "far fa-arrow-left")} />
      <h1>Design Shop</h1>
    </div>
  );
}
