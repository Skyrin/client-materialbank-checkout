import { CartT } from "constants/types";
import * as React from "react";
import { AppContext, AppContextT, defaultValues } from "./AppContext";
import { cloneDeep, isArray, mergeWith } from "lodash-es";
import {
  applyCouponToCart,
  removeCouponFromCart,
  requestCartInfo,
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
      applyCouponToCart: this.applyCouponToCart,
      removeCouponFromCart: this.removeCouponFromCart,
    };
  }

  updateCart = (newCart: CartT) => {
    const customizer = (objValue: any, newValue: any) => {
      // Replace arrays when merging carts
      // This will ensure that we always keep only the received items, and they don't merge with any existing ones.
      if (isArray(objValue)) {
        return newValue;
      }
    };

    this.contextState.cart = mergeWith(
      this.contextState.cart,
      newCart,
      customizer
    );
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
