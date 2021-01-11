import { CartT, CustomerT } from "constants/types";
import * as React from "react";
import { AppContext, AppContextT, defaultValues } from "./AppContext";
import { cloneDeep, merge } from "lodash-es";
import { requestCartInfo } from "./CheckoutAPI";
import { login, requestCurrentCustomer } from "./CustomerAPI";

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
    };
  }

  updateCart = (newCart: CartT) => {
    this.contextState.cart = merge(this.contextState.cart, newCart);
    this.forceUpdate();
  };

  updateCustomer = (newCustomer: CustomerT) => {
    this.contextState.customer = merge(this.contextState.customer, newCustomer);
    this.forceUpdate();
  };

  requestCartInfo = async (cartId: string) => {
    this.contextState.cartInfoLoading = true;
    this.forceUpdate();
    const cartInfo = await requestCartInfo(cartId);
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
      this.contextState.isLoggedIn = true;
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
    this.contextState.isLoggedIn = false;
    this.forceUpdate();
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
