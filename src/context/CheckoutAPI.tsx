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

export const setGuestEmailOnCart = async (cartId: string, email: string) => {
  const query = `
      mutation{
      setGuestEmailOnCart(
        input: {
          cart_id: "${cartId}",
          email: "${email}"
        }
      )
      {
        cart {
          id
          email
        }
      }
    }
  `;

  try {
    const resp = await graphqlRequest(query, { cart_id: cartId, email: email });
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["setGuestEmailOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};

export class CartAddressInput {
  city: string = "Washington";
  company?: string = "Rodeapps";
  country_code: string = "001";
  firstname: string = "Test-Verginica";
  lastname: string = "Test-Vergescu";
  postcode?: string = "400123";
  region?: string = "Ardeal";
  region_id?: number = 1;
  street: string = "Str. Fericirii";
  telephone: string = "+40123123123";
}

export const setShippingAddressOnCart = async (
  cartId: string,
  shippingAddress: CartAddressInput
) => {
  const query = `mutation{
  setShippingAddressesOnCart(
    input: {
    	cart_id: "${cartId}",
      shipping_addresses: [
        ${JSON.stringify(shippingAddress)}
      ]
  	}
  )
  {
    cart {
      id,
      shipping_addresses {
        city
        company
        country {
          code
          label
        }
        customer_notes
        firstname
        lastname
        pickup_location_code
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
    // TODO: See why the server tells us Error: GraphQL error: Syntax Error: Expected Name, found String "city"

    const resp = await graphqlRequest(query, {
      cart_id: cartId,
      shipping_address: shippingAddress,
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

  const query = `mutation{
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
        city
        company
        country {
          code
          label
        }
        customer_notes
        firstname
        lastname
        pickup_location_code
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
    // TODO: See why the server tells us Error: GraphQL error: Syntax Error: Expected Name, found String "city"

    const resp = await graphqlRequest(query, {
      cart_id: cartId,
      billing_address: billingAddress,
    });
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["setShippingAddressesOnCart"]["cart"];
  } catch (e) {
    console.error(e);
  }
};
