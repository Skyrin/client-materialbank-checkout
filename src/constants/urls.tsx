export const CHECKOUT_FUNNEL_URL = "/checkout";
export const USER_MANAGEMENT_URL = "/user";
export const MAIN_SHOP_URL = "/"; // Note: This won't work locally

// Checkout funnel URLs
export const CART_URL = `/cart`;
export const CHECKOUT_DEBUG_URL = `${CHECKOUT_FUNNEL_URL}/debug`; // Used as a debug page
export const PERSONAL_INFORMATION_URL = `${CHECKOUT_FUNNEL_URL}/information`;
export const PAYMENT_URL = `${CHECKOUT_FUNNEL_URL}/payment`;
export const ORDER_CONFIRMATION_URL = `${CHECKOUT_FUNNEL_URL}/confirmation`;

// User management URLs
export const USER_ORDER_HISTORY_URL = `${USER_MANAGEMENT_URL}/order-history`;
export const USER_ACCOUNT_URL = `${USER_MANAGEMENT_URL}/account`;
export const USER_BILLING_URL = `${USER_MANAGEMENT_URL}/billing`;
export const USER_SHIPPING_URL = `${USER_MANAGEMENT_URL}/shipping`;
