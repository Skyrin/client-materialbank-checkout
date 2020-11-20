import * as React from "react";
import { CartT } from "constants/types";

export type AppContextT = {
  cart: CartT;
  updateCart: (newCart: CartT) => void;
};

export const defaultValues = {
  cart: {} as CartT,
  updateCart: (newCart: CartT) => {},
};

export const AppContext = React.createContext(defaultValues);
