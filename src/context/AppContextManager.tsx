import { CartT } from "constants/types";
import * as React from "react";
import { AppContext, AppContextT, defaultValues } from "./AppContext";
import { cloneDeep, merge } from "lodash-es";
import { requestCartInfo } from "./CheckoutAPI";

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
    this.updateCart(cartInfo);
    this.contextState.cartInfoLoading = false;
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
