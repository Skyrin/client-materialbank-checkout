export const CHECKOUT_FUNNEL_URL = "/checkout";
export const USER_MANAGEMENT_URL = "/user";
export const MAIN_SHOP_URL = "/"; // Note: This won't work locally
export const COLLECTIONS_AND_PALETTES_URL = `/collections`;

// Checkout funnel URLs
export const CART_URL = `/cart`;
export const CHECKOUT_DEBUG_URL = `${CHECKOUT_FUNNEL_URL}/debug`; // Used as a debug page
export const PERSONAL_INFORMATION_URL = `${CHECKOUT_FUNNEL_URL}/information`;
export const ORDER_CONFIRMATION_URL = `${CHECKOUT_FUNNEL_URL}/confirmation`;

// User management URLs
export const USER_ORDER_HISTORY_URL = `${USER_MANAGEMENT_URL}/order-history`;
export const USER_ACCOUNT_URL = `${USER_MANAGEMENT_URL}/account`;
export const USER_BILLING_URL = `${USER_MANAGEMENT_URL}/billing`;
export const USER_SHIPPING_URL = `${USER_MANAGEMENT_URL}/shipping`;

// Collections URLs
export const COLLECTION_ID = ":collection_id";
export const COLLECTIONS_URL = `${COLLECTIONS_AND_PALETTES_URL}/my-collections`;
export const PALETTES_URL = `${COLLECTIONS_AND_PALETTES_URL}/palettes`;
export const COLLECTION_URL = `${COLLECTIONS_URL}/:collection_id`;

export const goToStorefront = (path?: string) => {
  // Use this to go to the storefront in order to trigger the storefront app to reload
  // Might not need this eventually, but for now we need to re-initialize it so that it can create a new cart
  // after we complete a checkout
  const origin = window.location.origin;
  window.location.href = `${origin}${path}`;
};
