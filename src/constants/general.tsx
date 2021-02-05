import { CART_URL, PAYMENT_URL, PERSONAL_INFORMATION_URL } from "./urls";

export const BREADCRUMBS_STEPS = [
  { url: CART_URL, name: "Cart" },
  { url: PERSONAL_INFORMATION_URL, name: "Information" },
  { url: PAYMENT_URL, name: "Payment" },
];

export const AUTH_TOKEN_STORAGE_KEY = "token";
export const GUEST_CART_ID_STORAGE_KEY = "cartId";
export const ORDER_ID_STORAGE_KEY = "order_id";
