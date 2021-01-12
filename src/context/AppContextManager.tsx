import { CartT } from "constants/types";
import * as React from "react";
import { AppContext, AppContextState } from "./AppContext";
import { cloneDeep, isArray, merge, mergeWith } from "lodash-es";
import {
  applyCouponToCart,
  removeCouponFromCart,
  requestCartInfo,
} from "./CheckoutAPI";

type Props = {
  children: React.ReactNode;
};

export default class AppContextManager extends React.Component<Props> {
  // 'contextState' holds the context data
  private contextState: AppContextState = new AppContextState();

  // 'methods' holds all the functions which can be used by context consumers to manipulate the context
  private methods = {
    updateCart: (newCart: CartT) => {
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
      return this.contextState.cart;
    },

    requestCartInfo: async (cartId: string) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();

      const cartInfo = await requestCartInfo(cartId);
      console.log("GOT CART INFO", cartInfo);
      this.contextState.cartInfoLoading = false;
      this.methods.updateCart(cartInfo);
      return this.contextState.cart;
    },

    applyCouponToCart: async (cartId: string, couponCode: string) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const cartInfo = await applyCouponToCart(cartId, couponCode);
      console.log("COUPON", cartInfo);
      this.contextState.cartInfoLoading = false;
      this.methods.updateCart(cartInfo);
      return this.contextState.cart;
    },

    removeCouponFromCart: async (cartId: string, couponCode: string) => {
      this.contextState.cartInfoLoading = true;
      this.forceUpdate();
      const cartInfo = await removeCouponFromCart(cartId, couponCode);
      console.log("REMOVED COUPON", cartInfo);
      this.contextState.cartInfoLoading = false;
      this.methods.updateCart(cartInfo);
      return this.contextState.cart;
    },
  };

  constructor(props: Props) {
    super(props);
  }

  render() {
    // Provide both the cart data and the cart methods to consumers
    const context = cloneDeep(this.contextState);
    merge(context, cloneDeep(this.methods));

    return (
      <AppContext.Provider value={context}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
