import { CartT } from "constants/types";
import * as React from "react";
import { AppContext, AppContextT, defaultValues } from "./AppContext";
import { cloneDeep, merge } from "lodash-es";
import { applyCouponToCart, requestCartInfo } from "./CheckoutAPI";

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
      applyCouponToCart: this.applyCouponToCart,
    };
  }

  updateCart = (newCart: CartT) => {
    this.contextState.cart = merge(this.contextState.cart, newCart);
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

  applyCouponToCart = async (cartId: string, couponCode: string) => {
    this.contextState.cartInfoLoading = true;
    this.forceUpdate();
    const cartInfo = await applyCouponToCart(cartId, couponCode);
    console.log("COUPON", cartInfo);
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
