import { CartT, CustomerT } from "constants/types";
import * as React from "react";
import { AppContext, AppContextT, defaultValues } from "./AppContext";
import { login, requestCurrentCustomer } from "./CustomerAPI";
import { cloneDeep, isArray, mergeWith } from "lodash-es";
import {
  applyCouponToCart,
  removeCouponFromCart,
  requestGuestCartInfo,
  requestCustomerCartInfo,
} from "./CheckoutAPI";

type Props = {
  children: React.ReactNode;
};

export default class AppContextManager extends React.Component<Props> {
  contextState: AppContextT;

  constructor(props: Props) {
    super(props);
    this.contextState = {
      ...defaultValues,
      updateCart: this.updateCart,
      requestCartInfo: this.requestCartInfo,
      requestCurrentCustomer: this.requestCurrentCustomer,
      login: this.login,
      logout: this.logout,
      setLoggedIn: this.setLoggedIn,
      applyCouponToCart: this.applyCouponToCart,
      removeCouponFromCart: this.removeCouponFromCart,
    };
  }

  fieldCustomizer = (objValue: any, newValue: any) => {
    // Replace arrays when merging carts
    // This will ensure that we always keep only the received items, and they don't merge with any existing ones.
    if (isArray(objValue)) {
      return newValue;
    }
  };

  updateCart = (newCart: CartT) => {
    this.contextState.cart = mergeWith(
      this.contextState.cart,
      newCart,
      this.fieldCustomizer
    );
    this.forceUpdate();
  };

  updateCustomer = (newCustomer: CustomerT) => {
    this.contextState.customer = mergeWith(
      this.contextState.customer,
      newCustomer,
      this.fieldCustomizer
    );
    this.forceUpdate();
  };

  requestCartInfo = async (cartId: string) => {
    this.contextState.cartInfoLoading = true;
    this.forceUpdate();
    let cartInfo = {};
    if (this.contextState.isLoggedIn) {
      cartInfo = await requestCustomerCartInfo();
    } else {
      cartInfo = await requestGuestCartInfo(cartId);
    }
    console.log("GOT CART INFO", cartInfo);
    this.contextState.cartInfoLoading = false;
    this.updateCart(cartInfo);
  };

  requestCurrentCustomer = async () => {
    this.contextState.customerLoading = true;
    this.forceUpdate();
    const customer = await requestCurrentCustomer();
    console.log("GOT CUSTOMER", customer);
    this.contextState.customerLoading = false;
    this.updateCustomer(customer);
  };

  login = async (email: string, password: string) => {
    const token = await login(email, password);
    console.log("LOGIN", token);
    if (token) {
      localStorage.setItem("token", token);
      this.setLoggedIn(true);
      await this.contextState.requestCurrentCustomer();
    }
  };

  setLoggedIn = (loggedIn: boolean) => {
    this.contextState.isLoggedIn = loggedIn;
    this.forceUpdate();
  };

  logout = () => {
    // TODO: Figure out what else we might need to do here
    localStorage.removeItem("token");
    this.setLoggedIn(false);
  };

  applyCouponToCart = async (cartId: string, couponCode: string) => {
    this.contextState.cartInfoLoading = true;
    this.forceUpdate();
    const cartInfo = await applyCouponToCart(cartId, couponCode);
    console.log("COUPON", cartInfo);
    this.contextState.cartInfoLoading = false;
    this.updateCart(cartInfo);
  };

  removeCouponFromCart = async (cartId: string, couponCode: string) => {
    this.contextState.cartInfoLoading = true;
    this.forceUpdate();
    const cartInfo = await removeCouponFromCart(cartId, couponCode);
    console.log("REMOVED COUPON", cartInfo);
    this.contextState.cartInfoLoading = false;
    this.updateCart(cartInfo);
  };

  render() {
    const context = cloneDeep(this.contextState);
    return (
      <AppContext.Provider value={context}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
