import { AppContextState } from "context/AppContext";
import { graphqlRequest } from "GraphqlClient";

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
  region: {
    region_id: string;
  };
  telephone: string;
  street: string[];

  // TODO Clarify this: city, country_code, region_id are required on Backend but not present in Design.
  // TODO: Figure out zip-code resolution / address validations
  private static readonly defaults = {
    city: "Washington",
    company: undefined,
    country_code: "US",
    firstname: undefined,
    lastname: undefined,
    postcode: undefined,
    region_id: 1,
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
    this.region = {
      region_id: obj?.region_id || CartAddressInput.defaults.region_id,
    };
    this.telephone =
      obj?.telephone || obj?.phone || CartAddressInput.defaults.telephone;
    this.street = [obj?.address];
    if (obj?.aptName) {
      this.street.push(obj?.aptName);
    }
  }
}

export const setShippingAddressOnCart = async (
  context: AppContextState,
  cartId: string,
  addressId: number
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
  billingAddress: CartAddressInput
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
    const resp = await graphqlRequest(context, query, {
      input: {
        cart_id: cartId,
        billing_address: { address: billingAddress },
      },
    });
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["setBillingAddressOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};

export const createCustomerAddress = async (
  context: AppContextState,
  address: CartAddressInput
) => {
  const Mutation = `
    mutation ($input: CustomerAddressInput!) {
      createCustomerAddress(input: $input) {
        id
      }
    }
  `;

  try {
    const resp = await graphqlRequest(context, Mutation, {
      input: { ...address, default_shipping: true, default_billing: true },
    });
    return resp["createCustomerAddress"];
  } catch (e) {
    console.error(e);
  }
};
