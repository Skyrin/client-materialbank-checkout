import React from "react";
import styles from "./App.module.scss";
import { Redirect, Route, Switch } from "react-router-dom";
import Footer from "components/common/Footer/Footer";
import {
  CART_URL,
  PAYMENT_URL,
  PERSONAL_INFORMATION_URL,
} from "constants/urls";
import Cart from "components/Cart/Cart";
import PersonalInformation from "components/PersonalInformation/PersonalInformation";
import PaymentInformation from "components/PaymentInformation/PaymentInformation";
import OrderSummary from "components/OrderSummary/OrderSummary";
import AppContextManager from "context/AppContextManager";
import cn from "classnames";

function App() {
  return (
    <AppContextManager>
      <div className={styles.App}>
        <div className={styles.pageContent}>
          <div className={styles.pageWrapper}>
            <Switch>
              <Redirect exact from="/" to={CART_URL} />
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
      </div>
      {/* Hidden icons that should make the browser pre-load the webfonts for fas(FontAwesome Solid) and far(FontAwesome Regular) */}
      <i className={cn("fas fa-star", styles.hiddenIcon)} />
      <i className={cn("far fa-star", styles.hiddenIcon)} />
    </AppContextManager>
  );
}

export default App;
