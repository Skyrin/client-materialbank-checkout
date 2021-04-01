import { AppContextState } from "context/AppContext";
import { graphqlRequest } from "GraphqlClient";
import { getAddressId } from "utils/context";
import {
  CartAppliedCouponsFragment,
  CartBillingAddressFragment,
  CartFragment,
  CartPricesFragment,
  CartSelectedPaymentMethod,
  CartShippingAddressesFragment,
} from "./fragments";
import { CartAddressInput } from "./models";
import { get } from "lodash-es";

export const requestGuestCartInfo = async (
  context: AppContextState,
  cartId: string
) => {
  const CartQuery = `
    query($cart_id: String!) {
      cart(cart_id: $cart_id) {
        ${CartFragment}
      }
    }
  `;
  const resp = await graphqlRequest(context, CartQuery, { cart_id: cartId });
  // TODO: Process response
  return resp["cart"];
};

export const requestCustomerCartInfo = async (context: AppContextState) => {
  const CartQuery = `
    query {
      customerCart {
        ${CartFragment}
      }
    }
  `;
  const resp = await graphqlRequest(context, CartQuery);
  return resp["customerCart"];
};

export const applyCouponToCart = async (
  context: AppContextState,
  cartId: string,
  couponCode: string
) => {
  const ApplyCouponMutation = `
    mutation($input: ApplyCouponToCartInput!) {
      applyCouponToCart(input: $input) {
        cart {
          ${CartAppliedCouponsFragment}
          ${CartPricesFragment}
        }
      }
    }
  `;
  const resp = await graphqlRequest(context, ApplyCouponMutation, {
    input: {
      cart_id: cartId,
      coupon_code: couponCode,
    },
  });
  console.log("APPLY COUPON RESPONSE", resp);
  // TODO: Process response
  return resp["applyCouponToCart"]["cart"];
};

export const removeCouponFromCart = async (
  context: AppContextState,
  cartId: string,
  couponCode: string
) => {
  const RemoveCouponMutation = `
    mutation($input: RemoveCouponFromCartInput!) {
      removeCouponFromCart(input: $input) {
        cart {
          ${CartAppliedCouponsFragment}
          ${CartPricesFragment}
        }
      }
    }
  `;
  const resp = await graphqlRequest(context, RemoveCouponMutation, {
    input: {
      cart_id: cartId,
    },
  });
  console.log("REMOVE COUPON RESPONSE, resp");
  return resp["removeCouponFromCart"]["cart"];
};

export const setShippingAddressOnCart = async (
  context: AppContextState,
  cartId: string,
  addressId: number,
  address?: CartAddressInput
) => {
  const query = `
    mutation ($input: SetShippingAddressesOnCartInput!) {
      setShippingAddressesOnCart(input: $input) {
        cart {
          ${CartShippingAddressesFragment}
          ${CartPricesFragment}
        }
      }
    }
  `;

  try {
    const resp = await graphqlRequest(context, query, {
      input: {
        cart_id: cartId,
        shipping_addresses: [
          {
            address: address,
            customer_address_id: addressId,
          },
        ],
      },
    });
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["setShippingAddressesOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};

export const setBillingAddressOnCart = async (
  context: AppContextState,
  cartId: string,
  sameAsShipping: boolean,
  billingAddress?: CartAddressInput
) => {
  const query = `
    mutation ($input: SetBillingAddressOnCartInput!) {
      setBillingAddressOnCart(input: $input) {
        cart {
          ${CartBillingAddressFragment}
        }
      }
    }
  `;

  try {
    let billingAddressInput = {};
    if (sameAsShipping) {
      billingAddressInput = {
        customer_address_id: getAddressId(
          context,
          context.cart.shipping_addresses[0]
        ),
      };
    } else {
      billingAddressInput = {
        address: billingAddress,
      };
    }
    const resp = await graphqlRequest(context, query, {
      input: {
        cart_id: cartId,
        billing_address: billingAddressInput,
      },
    });
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["setBillingAddressOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};

export const createTestCart = async (context: AppContextState) => {
  const CreateEmptyCartMutation = `
    mutation createEmptyCart {
      createEmptyCart
    }
  `;
  const AddSimpleProductsToCartMutation = `
    mutation addSimpleProductsToCart($input: AddSimpleProductsToCartInput!) {
      addSimpleProductsToCart(input: $input) {
        cart {
          ${CartFragment}
        }
      }
    }
  `;

  try {
    const createCartResponse = await graphqlRequest(
      context,
      CreateEmptyCartMutation
    );
    let cartId = get(context.cart, "id");
    if (!cartId) {
      cartId = createCartResponse["createEmptyCart"];
    }
    const addProductsResponse = await graphqlRequest(
      context,
      AddSimpleProductsToCartMutation,
      {
        input: {
          cart_id: cartId,
          cart_items: [{ data: { sku: "test", quantity: 2 } }],
        },
      }
    );
    return addProductsResponse["addSimpleProductsToCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};

export const mergeGuestCart = async (
  context: AppContextState,
  guestCartId: string,
  customerCartId: string
) => {
  const MergeCartsMutation = `
    mutation mergeCarts ($sourceCartId: String!, $destinationCartId: String!) {
      mergeCarts (source_cart_id: $sourceCartId, destination_cart_id: $destinationCartId) {
        ${CartFragment}
      }
    }
  `;

  try {
    const mergedCart = await graphqlRequest(context, MergeCartsMutation, {
      sourceCartId: guestCartId,
      destinationCartId: customerCartId,
    });
    return mergedCart["mergeCarts"];
  } catch (e) {
    console.error(e);
  }
};

export const setPaymentMethod = async (
  context: AppContextState,
  input: any
) => {
  const SetPaymentMethodMutation = `
    mutation setPaymentMethodOnCart($input: SetPaymentMethodOnCartInput!) {
      setPaymentMethodOnCart(input: $input) {
        cart {
          ${CartSelectedPaymentMethod}
        }
      }
    }
  `;

  try {
    const setPaymentMethodResponse = await graphqlRequest(
      context,
      SetPaymentMethodMutation,
      { input: input }
    );
    return setPaymentMethodResponse["setPaymentMethodOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};

export const placeOrder = async (context: AppContextState, cartId: string) => {
  const PlaceOrderMutation = `
    mutation placeOrder($input: PlaceOrderInput!) {
      placeOrder(input: $input) {
        order {
          order_number
        }
      }
    }
  `;

  try {
    const placeOrderResponse = await graphqlRequest(
      context,
      PlaceOrderMutation,
      { input: { cart_id: cartId } }
    );
    return placeOrderResponse["placeOrder"]["order"];
  } catch (e) {
    console.error(e);
  }
};

export const setShippingMethodOnCart = async (
  context: AppContextState,
  cartId: string,
  shippingMethod: string = "flatrate"
) => {
  const SetShippingMethodsOnCartMutation = `
    mutation setShippingMethodsOnCart($input: SetShippingMethodsOnCartInput!) {
      setShippingMethodsOnCart(input: $input) {
        cart {
          ${CartShippingAddressesFragment}
          ${CartPricesFragment}
        }
      }
    }
  `;

  try {
    const setShippingMethodsResponse = await graphqlRequest(
      context,
      SetShippingMethodsOnCartMutation,
      {
        input: {
          cart_id: cartId,
          shipping_methods: [
            {
              method_code: shippingMethod,
              carrier_code: shippingMethod,
            },
          ],
        },
      }
    );
    return setShippingMethodsResponse["setShippingMethodsOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};

export const createPaypalTokenForCart = async (
  context: AppContextState,
  cartId: string,
  expressButton?: boolean
) => {
  const CreatePaypalTokenMutation = `
      mutation createPaypalExpressToken($input: PaypalExpressTokenInput!) {
        createPaypalExpressToken(input: $input) {
          token
          paypal_urls {
            edit
            start
          }
        }
      }
    `;

  const variables = {
    input: {
      cart_id: cartId,
      code: "paypal_express",
      express_button: expressButton,
      urls: {
        cancel_url: "checkout/payment/paypal-cancelled",
        return_url: "checkout/payment/paypal-success",
      },
    },
  };

  try {
    // Request Paypal Express Token from Magento and pass it to the Paypal SDK
    const response = await graphqlRequest(
      context,
      CreatePaypalTokenMutation,
      variables
    );
    return response["createPaypalExpressToken"];
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateCartItems = async (
  context: AppContextState,
  cartId: string,
  cartItems: any
) => {
  const UpdateCartItemsMutation = `
    mutation updateCartItems($input: UpdateCartItemsInput!) {
      updateCartItems(input: $input) {
        cart {
          ${CartFragment}
        }
      }
    }
  `;
  try {
    const response = await graphqlRequest(context, UpdateCartItemsMutation, {
      input: {
        cart_id: cartId,
        cart_items: cartItems,
      },
    });
    return response["updateCartItems"]["cart"];
  } catch (e) {
    console.error(e);
    throw e;
  }
};
