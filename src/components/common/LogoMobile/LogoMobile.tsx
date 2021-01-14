import * as React from "react";
import styles from "./LogoMobile.module.scss";
import cn from "classnames";
import { RouteComponentProps, withRouter } from "react-router-dom";

type Props = RouteComponentProps & {
  className?: string;
};

function LogoMobile(props: Props) {
  return (
    <div className={cn(styles.LogoMobile, props.className)}>
      <div
        className={cn(styles["back-button"], "far fa-arrow-left")}
        onClick={() => {
          props.history.goBack();
        }}
      />
      <h1>Design Shop</h1>
    </div>
  );
}

export default withRouter(LogoMobile);
