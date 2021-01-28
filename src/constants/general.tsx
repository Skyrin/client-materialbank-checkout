import { MAIN_SHOP_URL, PAYMENT_URL, PERSONAL_INFORMATION_URL } from "./urls";

export const BREADCRUMBS_STEPS = [
  { url: MAIN_SHOP_URL, name: "Cart" }, // TODO: Update this to the proper cart url whenever we figure out who should make it
  { url: PERSONAL_INFORMATION_URL, name: "Information" },
  { url: PAYMENT_URL, name: "Payment" },
];

export const AUTH_TOKEN_STORAGE_KEY = "token";
export const GUEST_CART_ID_STORAGE_KEY = "guest_cart_id";
export const ORDER_ID_STORAGE_KEY = "order_id";
