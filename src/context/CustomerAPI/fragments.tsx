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
