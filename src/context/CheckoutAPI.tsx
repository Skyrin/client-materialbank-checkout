import { graphqlRequest } from "GraphqlClient";

const AddressFragment = `
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

export const requestCartInfo = async (cartId: string) => {
  const CartQuery = `
    query($cart_id: String!) {
      cart(cart_id: $cart_id) {
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
      }
    }
  `;
  try {
    const resp = await graphqlRequest(CartQuery, { cart_id: cartId });
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["cart"];
  } catch (e) {
    console.error(e);
  }
};


export const setGuestEmailOnCart = async (cart_id: string, email: string) => {

  email = email || "gmail@gmail.com";

  const query = `
    mutation ($input: SetGuestEmailOnCartInput!) {
      setGuestEmailOnCart(input: $input)
      {
        cart {
          id
          email
        }
      }
    }
  `;

  try {
    const resp = await graphqlRequest(
      query, { input: { cart_id, email } }
    );
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["setGuestEmailOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};

export class CartAddressInput {
  city: string;
  company: string;
  country_code: string;
  firstname: string;
  lastname: string;
  postcode: string;
  region_id: number;
  telephone: string;
  street: string[];

  private static readonly defaults = {
    city: "Washington",
    company: undefined,
    country_code: "US",
    firstname: undefined,
    lastname: undefined,
    postcode: undefined,
    region_id: 1, // TODO Address this: Currently region is not present on design, but required on backend
    telephone: undefined,
    street: undefined
  };

  constructor(obj?: any) {
    this.city = obj?.city || CartAddressInput.defaults.city;
    this.company = obj?.company || CartAddressInput.defaults.company;
    this.country_code = obj?.country_code || CartAddressInput.defaults.country_code;
    this.firstname = obj?.firstname || obj?.firstName || CartAddressInput.defaults.firstname;
    this.lastname = obj?.lastname || obj?.lastName || CartAddressInput.defaults.lastname;
    this.postcode = obj?.postcode || obj?.zipCode || CartAddressInput.defaults.postcode;
    this.region_id = obj?.region_id || CartAddressInput.defaults.region_id;
    this.telephone = obj?.telephone || obj?.phone || CartAddressInput.defaults.telephone;
    this.street =
      obj?.street ?
        Array.isArray(obj.street) ? obj.street : [obj.street]
        : obj?.address ?
        Array.isArray(obj.address) ? obj.address : [obj.address]
        : CartAddressInput.defaults.street;
  }
}

export const setShippingAddressOnCart = async (
  cartId: string,
  shippingAddress: CartAddressInput
) => {
  const query = `
    mutation ($input: SetShippingAddressesOnCartInput!) {
      setShippingAddressesOnCart(input: $input) {
        cart {
          id
          shipping_addresses {
            city
            company
            country {
              code
              label
            }
            firstname
            lastname
            postcode
            region {
              code
              label
              region_id
            }
            street
            telephone
          }
        }
      }
    }
  `;

  try {
    const resp = await graphqlRequest(query, {
      input: {
        cart_id: cartId,
        shipping_addresses: [{
          address: shippingAddress
        }]
      }
    });
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["setShippingAddressesOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};

export const setBillingAddressOnCart = async (
  cartId: string,
  billingAddress: CartAddressInput,
  sameAsShipping = false
) => {
  const billingAddressInput = sameAsShipping
    ? { same_as_shipping: true }
    : { address: billingAddress };

  const query = `
  mutation {
    setShippingAddressesOnCart(
      input: {
        cart_id: "${cartId}",
        billing_address: ${JSON.stringify(billingAddressInput)}
      }
    )
    {
      cart {
        id,
        billing_address {
          ${AddressFragment}
        }
      }
    }
  }
`;

  try {
    // TODO: See why the server tells us Error: GraphQL error: Syntax Error: Expected Name, found String "city"

    const resp = await graphqlRequest(query, {
      cart_id: cartId,
      billing_address: billingAddress
    });
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["setShippingAddressesOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};
