import * as React from "react";
import { CartT } from "constants/types";

export type AppContextT = {
  cart: CartT;
  updateCart: (newCart: CartT) => void;
  requestCartInfo: (cartId: string) => void;
  cartInfoLoading: boolean;
};

export const defaultValues = {
  cart: {} as CartT,
  updateCart: (newCart: CartT) => {},
  requestCartInfo: (cartId: string) => {},
  cartInfoLoading: false,
};

export const AppContext = React.createContext(defaultValues);
