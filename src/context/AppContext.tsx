import * as React from "react";
import { CartT } from "constants/types";
import { cloneDeep } from "lodash-es";
import { CART_MOCK_DATA } from "./cartMockData";

/**
 * This class is used for handling the Context's internal data.
 * All properties must be private and accessible ONLY through getters/setters
 * Getters and setters should usually use deepClone (unless necessary otherwise)
 * */
abstract class BaseAppContextState {
  private internalCart?: CartT = CART_MOCK_DATA;
  private internalCartInfoLoading?: boolean = false;

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

/**
 * By instantiating the BaseAppContextState and defining what context-manipulation
 * methods can be implemented, this class describes the 'shape' the context
 * which will be provided to consumers
 */
export class AppContextState extends BaseAppContextState {
  updateCart(newCart: CartT) {}

  async requestCartInfo(cartId: string) {}

  async applyCouponToCart(cartId: string, couponCode: string) {}

  async removeCouponFromCart(cartId: string, couponCode: string) {}
}

export const AppContext = React.createContext(new AppContextState() as any);
