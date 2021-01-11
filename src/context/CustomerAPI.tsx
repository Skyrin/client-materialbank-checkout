import { graphqlRequest } from "GraphqlClient";

// For whatever reason, the adresses on the customer object are a bit different
// from the cart ones. Magento...why?
const CustomerAddressFragment = `
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

const CustomerFragment = `
  addresses {
    ${CustomerAddressFragment}
  }
  email
  firstname
  lastname
`;

export const requestCurrentCustomer = async () => {
  const CustomerQuery = `
    query {
      customer {
        ${CustomerFragment}
      }
    }
  `;

  try {
    const resp = await graphqlRequest(CustomerQuery);
    console.log("GQL RESPONSE", resp);
    // TODO: Process response
    return resp["customer"];
  } catch (e) {
    console.error(e);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const loginResponse = await fetch(
      "/rest/all/V1/integration/customer/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      }
    );
    return loginResponse.json();
  } catch (e) {
    console.error(e);
  }
};
