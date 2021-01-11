import * as React from "react";
import { CartT } from "constants/types";
import { cloneDeep } from "lodash-es";
import { CART_MOCK_DATA } from "./cartMockData";

const defaultValues = {
  cart: CART_MOCK_DATA,
  cartInfoLoading: false,
  updateCart: (newCart: CartT) => null,
  requestCartInfo: (cartId: string) => null,
};

/** BaseAppContext
 * This class is used for handling the Context's internal data.
 * All properties must be private and accessible ONLY through getters/setters
 * Getters and setters should usually use Deep Clones (unless required otherwise)
 * */
class InternalAppContextState {
  private internalCart: CartT;
  private internalCartInfoLoading: boolean;

  constructor(obj?: any) {
    this.internalCart = obj ? obj.internalCart : defaultValues.cart;
    this.internalCartInfoLoading = obj
      ? obj.cartInfoLoading
      : defaultValues.cartInfoLoading;
  }

  public get cart() {
    return cloneDeep(this.internalCart);
  }

  public set cart(newCart: CartT) {
    this.internalCart = cloneDeep(newCart);
  }

  public get cartInfoLoading() {
    return !!this.internalCartInfoLoading;
  }

  public set cartInfoLoading(newValue: boolean) {
    this.internalCartInfoLoading = newValue;
  }
}

/** AppContextState
 * This class holds public complex methods on the context
 * Its methods should be overwritten by the AppContextManager
 */
export class AppContextState extends InternalAppContextState {
  public updateCart: (newCart: CartT) => void;
  public requestCartInfo: (cartId: string) => void;

  constructor(obj: {
    updateCart: (...params) => any;
    requestCartInfo: (...params) => any;
  }) {
    super(obj);
    this.updateCart = obj.updateCart;
    this.requestCartInfo = obj.requestCartInfo;
  }
}

export const AppContext = React.createContext(
  new AppContextState({
    updateCart: defaultValues.updateCart,
    requestCartInfo: defaultValues.requestCartInfo,
  })
);
