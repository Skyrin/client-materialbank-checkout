import Footer from "components/common/Footer/Footer";
import {
  CHECKOUT_DEBUG_URL,
  CHECKOUT_FUNNEL_URL,
  ORDER_CONFIRMATION_URL,
  PAYMENT_URL,
  PERSONAL_INFORMATION_URL,
} from "constants/urls";
import * as React from "react";
import Cart from "components/CheckoutFunnel/Cart/Cart";
import PersonalInformation from "components/CheckoutFunnel/PersonalInformation/PersonalInformation";
import PaymentInformation from "components/CheckoutFunnel/PaymentInformation/PaymentInformation";
import OrderSummary from "components/common/OrderSummary/OrderSummary";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import styles from "./CheckoutFunnel.module.scss";
import OrderConfirmation from "components/CheckoutFunnel/OrderConfirmation/OrderConfirmation";
import { AppContext, AppContextState } from "context/AppContext";
import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import { BREADCRUMBS_STEPS } from "constants/general";
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
              <Route path={CHECKOUT_DEBUG_URL} component={Cart} />
              <Route
                path={PERSONAL_INFORMATION_URL}
                component={PersonalInformation}
              />
              <Route path={PAYMENT_URL} component={PaymentInformation} />
              <Route
                path={ORDER_CONFIRMATION_URL}
                component={OrderConfirmation}
              />
            </Switch>
          </div>
          {!this.context.confirmedOrderLoading && (
            <OrderSummary className={styles.orderSummary} />
          )}
          <Switch>
            {isOnMobile() && (
              <Route
                path={[PERSONAL_INFORMATION_URL, PAYMENT_URL]}
                render={() => (
                  <Breadcrumbs
                    steps={BREADCRUMBS_STEPS}
                    className={styles.breadCrumbs}
                  />
                )}
              />
            )}
          </Switch>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}
