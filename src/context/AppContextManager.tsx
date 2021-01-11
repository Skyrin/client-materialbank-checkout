import { CartT } from "constants/types";
import * as React from "react";
import { AppContext, AppContextState } from "./AppContext";
import { cloneDeep, merge } from "lodash-es";
import { requestCartInfo } from "./CheckoutAPI";

type Props = {
  children: React.ReactNode;
};

export default class AppContextManager extends React.Component<Props> {
  contextState: AppContextState;

  constructor(props: Props) {
    super(props);
    this.contextState = new AppContextState({
      updateCart: this.updateCart,
      requestCartInfo: this.requestCartInfo,
    });
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

  render() {
    const contextState = cloneDeep(this.contextState);
    return (
      <AppContext.Provider value={contextState}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
