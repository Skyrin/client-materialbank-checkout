import {
  CART_URL,
  MAIN_SHOP_URL,
  PAYMENT_URL,
  PERSONAL_INFORMATION_URL,
} from "./urls";

export const BREADCRUMBS_STEPS = [
  { url: MAIN_SHOP_URL, name: "Cart" }, // TODO: Update this to the proper cart url whenever we figure out who should make it
  { url: PERSONAL_INFORMATION_URL, name: "Information" },
  { url: PAYMENT_URL, name: "Payment" },
];
