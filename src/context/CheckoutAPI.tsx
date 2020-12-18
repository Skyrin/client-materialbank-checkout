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
