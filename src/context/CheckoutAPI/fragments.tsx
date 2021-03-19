export const CartAddressFragment = `
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

export const CartPricesFragment = `
  prices {
    subtotal_including_tax {
      value
    }
    subtotal_excluding_tax {
      value
    }
    grand_total {
      value
    }
  }
`;

export const CartItemsFragment = `
  items {
    id
    ... on ConfigurableCartItem {
      configurable_options {
        option_label
        value_label
      }
    }
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
`;

export const CartShippingAddressesFragment = `
  shipping_addresses {
    ${CartAddressFragment}
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
      amount {
        value
      }
    }
  }
`;

export const CartBillingAddressFragment = `
  billing_address {
    ${CartAddressFragment}
  }
`;

export const CartAvailablePaymentMethods = `
  available_payment_methods {
    code
    title
  }
`;

export const CartSelectedPaymentMethod = `
  selected_payment_method {
    code
    title
    purchase_order_number
  }
`;

export const CartAppliedCouponsFragment = `
  applied_coupons {
    code
  }
`;

export const CartFragment = `
  id
  email
  ${CartPricesFragment}
  ${CartBillingAddressFragment}
  ${CartShippingAddressesFragment}
  ${CartSelectedPaymentMethod}
  ${CartAppliedCouponsFragment}
  ${CartItemsFragment}
`;
