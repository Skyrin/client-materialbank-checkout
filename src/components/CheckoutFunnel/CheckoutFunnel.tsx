import Footer from "components/common/Footer/Footer";
import {
  CART_URL,
  CHECKOUT_FUNNEL_URL,
  PAYMENT_URL,
  PERSONAL_INFORMATION_URL,
} from "constants/urls";
import * as React from "react";
import Cart from "components/Cart/Cart";
import PersonalInformation from "components/PersonalInformation/PersonalInformation";
import PaymentInformation from "components/PaymentInformation/PaymentInformation";
import OrderSummary from "components/common/OrderSummary/OrderSummary";
import { Redirect, Route, Switch } from "react-router-dom";
import styles from "./CheckoutFunnel.module.scss";

export default function CheckoutFunnel() {
  return (
    <React.Fragment>
      <div className={styles.pageContent}>
        <div className={styles.pageWrapper}>
          <Switch>
            <Redirect exact from={CHECKOUT_FUNNEL_URL} to={CART_URL} />
            <Route path={CART_URL} component={Cart} />
            <Route
              path={PERSONAL_INFORMATION_URL}
              component={PersonalInformation}
            />
            <Route path={PAYMENT_URL} component={PaymentInformation} />
          </Switch>
        </div>
        <OrderSummary />
      </div>
      <Footer />
    </React.Fragment>
  );
}
