import {
  CHECKOUT_FUNNEL_URL,
  ORDER_CONFIRMATION_URL,
  PERSONAL_INFORMATION_URL,
} from "constants/urls";
import * as React from "react";
import PersonalInformation from "components/CheckoutFunnel/PersonalInformation/PersonalInformation";
import OrderSummary from "components/common/OrderSummary/OrderSummary";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import styles from "./CheckoutFunnel.module.scss";
import OrderConfirmation from "components/CheckoutFunnel/OrderConfirmation/OrderConfirmation";
import { AppContext, AppContextState } from "context/AppContext";
import { isOnMobile } from "utils/responsive";
import LogoMobile from "../common/LogoMobile/LogoMobile";
import cn from "classnames";

type Props = RouteComponentProps;

export default class CheckoutFunnel extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  render() {
    return (
      <React.Fragment>
        <div
          className={cn(styles.pageContent, {
            [styles.singleColumn]: this.context.confirmedOrderLoading,
          })}
        >
          {isOnMobile() && <LogoMobile />}

          <div className={styles.pageWrapper}>
            <Switch>
              <Redirect
                exact
                from={CHECKOUT_FUNNEL_URL}
                to={PERSONAL_INFORMATION_URL}
              />
              <Route
                path={PERSONAL_INFORMATION_URL}
                component={PersonalInformation}
              />
              <Route
                path={ORDER_CONFIRMATION_URL}
                component={OrderConfirmation}
              />
            </Switch>
          </div>
          {!this.context.confirmedOrderLoading && (
            <OrderSummary className={styles.orderSummary} />
          )}
        </div>
      </React.Fragment>
    );
  }
}
