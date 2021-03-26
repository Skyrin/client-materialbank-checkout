import * as React from "react";
import styles from "./LogoMobile.module.scss";
import cn from "classnames";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  MAIN_SHOP_URL,
  ORDER_CONFIRMATION_URL,
  PERSONAL_INFORMATION_URL,
} from "constants/urls";
import Logo from "../Logo/Logo";

type Props = RouteComponentProps & {
  className?: string;
};

const BACK_BUTTON_URL_MAPPING = {
  [ORDER_CONFIRMATION_URL]: MAIN_SHOP_URL, // Once order is confirmed, shouldn't be able to go back to the prev pages (i think)
  [PERSONAL_INFORMATION_URL]: MAIN_SHOP_URL, // TODO: Update with cart url whenever we figure out who should make it
};

function LogoMobile(props: Props) {
  return (
    <div className={cn(styles.LogoMobile, props.className)}>
      <a className={styles.pageHeader} href="/">
        <Logo header></Logo>
      </a>
    </div>
  );
}

export default withRouter(LogoMobile);
