import { AppContextState } from "context/AppContext";
import { graphqlRequest } from "GraphqlClient";
import { CustomerFragment, OrderAddressFragment } from "./fragments";
import { CreateCustomerInput, CustomerAddressInput } from "./models";

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

  // Don't use try-catch here, let the component catch the error and handle
  const response = await graphqlRequest(context, Mutation, {
    input: customer,
  });
  return response["createCustomerV2"]["customer"];
};

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
    throw e;
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