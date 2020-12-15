import { graphqlRequest } from "GraphqlClient";

export const requestCartInfo = async (cartId: string) => {
  const CartQuery = `
    query($cart_id: String!) {
      cart(cart_id: $cart_id) {
        id
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
