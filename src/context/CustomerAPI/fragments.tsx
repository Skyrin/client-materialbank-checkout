// For god knows what reason, Magento has slightly different Address models on
// Customer / Order / Cart...WHYYYYY!?!?
export const CustomerAddressFragment = `
  id
  city
  company
  firstname
  lastname
  postcode
  street
  telephone
  default_billing
  default_shipping
  region {
    region_code
    region_id
  }
`;

export const OrderAddressFragment = `
  city
  company
  firstname
  lastname
  postcode
  street
  telephone
  region
`;

export const CustomerFragment = `
  addresses {
    ${CustomerAddressFragment}
  }
  email
  firstname
  lastname
  default_shipping
  is_subscribed
`;

export const UpdateCustomerFragment = `
  email
  firstname
  lastname
  is_subscribed
`;

export const OrderFragment = `
  id
  order_date
  number
  status
  total {
    base_grand_total {
      value
      currency
    }
    grand_total {
      value
      currency
    }
    total_shipping {
      value
      currency
    }
    total_tax {
      value
      currency
    }
    subtotal {
      currency
      value
    }
  }
  payment_methods {	
    type	
    name	
    additional_data {	
      name	
      value	
    }	
  }
  billing_address {
    firstname
    lastname
    middlename
    city
    country_code
    postcode
    region
    street
  }
  shipping_address {
    firstname
    lastname
    middlename
    city
    country_code
    postcode
    region
    street
  }
  items {
    product_sku
    product_name
    id
    product_type
    product_sale_price {
      currency
      value
    }
    entered_options {
      label
      value
    }
    quantity_invoiced
    quantity_ordered
    status
    selected_options {
      label
      value
    }
  }
`;
