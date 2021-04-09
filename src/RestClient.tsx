import { AUTH_TOKEN_STORAGE_KEY } from "constants/general";

export const RESTRequest = async (method: string, path: string, body?: any) => {
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
  const baseUrl =
    process.env.REACT_APP_REST_URL ||
    (isDev ? `/magento/rest/V1/` : `https://dev.design.shop/rest/V1/`);
  const url = `${baseUrl}${path}`;
  const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const requestBody = JSON.stringify(body);

  return fetch(url, {
    method: method,
    headers,
    body: requestBody,
  });
};
