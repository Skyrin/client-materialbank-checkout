import { AppContextState } from "context/AppContext";
import { graphqlRequest } from "GraphqlClient";
import { AddressFragment } from "./CheckoutAPI";

// For whatever reason, the adresses on the customer object are a bit different
// from the cart ones. Magento...why?
const CustomerAddressFragment = `
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

const OrderAddressFragment = `
  city
  company
  firstname
  lastname
  postcode
  street
  telephone
  region
`;

const CustomerFragment = `
  addresses {
    ${CustomerAddressFragment}
  }
  email
  firstname
  lastname
  default_shipping
`;

export const requestCurrentCustomer = async (context: AppContextState) => {
  const CustomerQuery = `
    query {
      customer {
        ${CustomerFragment}
      }
    }
  `;

  try {
    const resp = await graphqlRequest(context, CustomerQuery);
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["customer"];
  } catch (e) {
    console.error(e);
  }
};

export const login = async (
  context: AppContextState,
  email: string,
  password: string
) => {
  try {
    const LoginMutation = `
      mutation($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
          token
        }
      }
    `;
    const loginResponse = await graphqlRequest(context, LoginMutation, {
      email: email,
      password: password,
    });
    return loginResponse["generateCustomerToken"]["token"];
  } catch (e) {
    console.error(e);
  }
};

export class CreateCustomerInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;

  constructor(obj?: any) {
    this.firstname = obj?.firstname;
    this.lastname = obj?.lastname;
    this.email = obj?.email;
    this.password = obj?.password;
  }
}

export const createCustomer = async (
  context: AppContextState,
  customer: CreateCustomerInput
) => {
  const Mutation = `
    mutation($input: CustomerCreateInput!) {
      createCustomerV2(input: $input) {
        customer {
          ${CustomerFragment}
        }
      }
    }
  `;

  try {
    const response = await graphqlRequest(context, Mutation, {
      input: customer,
    });
    return response["createCustomerV2"]["customer"];
  } catch (e) {
    console.error(e);
  }
};

export class CustomerAddressInput {
  city: string;
  company: string;
  country_code: string;
  firstname: string;
  lastname: string;
  postcode: string;
  region: {
    region_id: number;
  };
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
    this.city = obj?.city || CustomerAddressInput.defaults.city;
    this.company = obj?.company || CustomerAddressInput.defaults.company;
    this.country_code =
      obj?.country_code || CustomerAddressInput.defaults.country_code;
    this.firstname =
      obj?.firstname ||
      obj?.firstName ||
      CustomerAddressInput.defaults.firstname;
    this.lastname =
      obj?.lastname || obj?.lastName || CustomerAddressInput.defaults.lastname;
    this.postcode =
      obj?.postcode || obj?.zipCode || CustomerAddressInput.defaults.postcode;
    this.region = {
      region_id: obj?.region_id || CustomerAddressInput.defaults.region_id,
    };
    this.telephone =
      obj?.telephone || obj?.phone || CustomerAddressInput.defaults.telephone;
    this.street = [obj?.address];
    if (obj?.aptNumber) {
      this.street.push(obj?.aptNumber);
    }

    // TEMPORARY OVERRIDES SO THAT WE HAVE A VALID ADDRESS
    this.city = CustomerAddressInput.defaults.city;
    this.region.region_id = CustomerAddressInput.defaults.region_id;
    this.postcode = "10001";
  }
}

export const createCustomerAddress = async (
  context: AppContextState,
  address: CustomerAddressInput
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

export const requestOrder = async (
  context: AppContextState,
  orderNumber: string
) => {
  const OrdersQuery = `
    query CustomerOrder($filter: CustomerOrdersFilterInput!) {
      customer {
        orders(filter: $filter){
          items {
            number
            payment_methods {
              type
              name
            }
            billing_address {
              ${OrderAddressFragment}
            }
            shipping_address {
              ${OrderAddressFragment}
            }
            total {
              grand_total {
                value
              }
              subtotal {
                value
              }
            }
          }
        }
      }
    }
  `;
  try {
    const resp = await graphqlRequest(context, OrdersQuery, {
      filter: { number: { eq: orderNumber } },
    });
    return resp["customer"]["orders"]["items"][0];
  } catch (e) {
    console.error(e);
  }
};
