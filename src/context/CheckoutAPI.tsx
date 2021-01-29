import { AppContextState } from "context/AppContext";
import { graphqlRequest } from "GraphqlClient";
import { getAddressId } from "utils/context";

export const AddressFragment = `
  city
  company
  firstname
  lastname
  postcode
  street
  telephone
  region {
    code
    label
    region_id
  }
`;

const CartFragment = `
  id
  email
  prices {
    subtotal_including_tax {
      value
    }
  }
  items {
    id
    prices {
      price {
        value
      }
      row_total_including_tax {
        value
      }
    }
    product {
      id
      sku
      name
      image {
        url
      }
    }
    quantity
  }
  billing_address {
    ${AddressFragment}
  }
  shipping_addresses {
    ${AddressFragment}
    available_shipping_methods {
      method_code
      carrier_code
      amount {
        value
      }
    }
    selected_shipping_method {
      carrier_code
      method_code
    }
  }
  available_payment_methods {
    code
    title
  }
  selected_payment_method {
    code
    title
    purchase_order_number
  }
  applied_coupons {
    code
  }
`;

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
          ${CartFragment}
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
          ${CartFragment}
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

export class CartAddressInput {
  city: string;
  company: string;
  country_code: string;
  firstname: string;
  lastname: string;
  postcode: string;
  region: string;
  telephone: string;
  street: string[];

  // TODO Clarify this: city, country_code, region_id are required on Backend but not present in Design.
  // TODO: Figure out zip-code resolution / address validations
  private static readonly defaults = {
    city: "New York",
    company: undefined,
    country_code: "US",
    firstname: undefined,
    lastname: undefined,
    postcode: undefined,
    region_id: 43,
    telephone: undefined,
    street: undefined,
  };

  constructor(obj?: any) {
    this.city = obj?.city || CartAddressInput.defaults.city;
    this.company = obj?.company || CartAddressInput.defaults.company;
    this.country_code =
      obj?.country_code || CartAddressInput.defaults.country_code;
    this.firstname =
      obj?.firstname || obj?.firstName || CartAddressInput.defaults.firstname;
    this.lastname =
      obj?.lastname || obj?.lastName || CartAddressInput.defaults.lastname;
    this.postcode =
      obj?.postcode || obj?.zipCode || CartAddressInput.defaults.postcode;
    this.region =
      obj?.region || obj?.region_id || CartAddressInput.defaults.region_id;
    this.telephone =
      obj?.telephone || obj?.phone || CartAddressInput.defaults.telephone;
    this.street = [obj?.address];
    if (obj?.aptNumber) {
      this.street.push(obj?.aptNumber);
    }
  }
}

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
          ${CartFragment}
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
          ${CartFragment}
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
        same_as_shipping: true,
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
    const cartId = createCartResponse["createEmptyCart"];
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
          ${CartFragment}
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
          ${CartFragment}
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
