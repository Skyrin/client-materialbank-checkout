import * as React from "react";
import styles from "./LogoMobile.module.scss";
import cn from "classnames";
import { matchPath, RouteComponentProps, withRouter } from "react-router-dom";
import {
  MAIN_SHOP_URL,
  ORDER_CONFIRMATION_URL,
  PERSONAL_INFORMATION_URL,
} from "constants/urls";
import { AppContext, AppContextState } from "context/AppContext";
import Logo from "../Logo/Logo";

type Props = RouteComponentProps & {
  className?: string;
};

const BACK_BUTTON_URL_MAPPING = {
  [ORDER_CONFIRMATION_URL]: MAIN_SHOP_URL, // Once order is confirmed, shouldn't be able to go back to the prev pages (i think)
  [PERSONAL_INFORMATION_URL]: MAIN_SHOP_URL, // TODO: Update with cart url whenever we figure out who should make it
};

class LogoMobile extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  isOnConfirmationPage = () => {
    return !!matchPath(this.props.location.pathname, {
      path: ORDER_CONFIRMATION_URL,
      exact: true,
    });
  };

  render() {
    return (
      <div className={cn(styles.LogoMobile, this.props.className)}>
        <div className={styles.logoWrapper}>
          <a
            href={BACK_BUTTON_URL_MAPPING[this.props.location.pathname]}
            className={cn(styles["back-button"], "fas fa-arrow-left")}
          >
            {" "}
          </a>
          <Logo className={styles.logo} circleClassName={styles.circle} />
        </div>
        {!this.isOnConfirmationPage() && (
          <span
            className={styles.orderSummaryText}
            onClick={() => {
              this.context.setOrderSummaryOpen(!this.context.orderSummaryOpen);
            }}
          >
            Order Summary
          </span>
        )}
      </div>
    );
  }
}

export default withRouter(LogoMobile);
