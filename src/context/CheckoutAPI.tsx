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

export const requestCartInfo = async (cartId: string) => {
  const CartQuery = `
    query($cart_id: String!) {
      cart(cart_id: $cart_id) {
        ${CartFragment}
      }
    }
  `;
  const resp = await graphqlRequest(CartQuery, { cart_id: cartId });
  // TODO: Process response
  return resp["cart"];
};

export const applyCouponToCart = async (cartId: string, couponCode: string) => {
  const ApplyCouponMutation = `
    mutation($input: ApplyCouponToCartInput!) {
      applyCouponToCart(input: $input) {
        cart {
          ${CartFragment}
        }
      }
    }
  `;
  const resp = await graphqlRequest(ApplyCouponMutation, {
    input: {
      cart_id: cartId,
      coupon_code: couponCode,
    },
  });
  console.log("APPLY COUPON RESPONSE", resp);
  // TODO: Process response
  return resp["applyCouponToCart"]["cart"];
};
