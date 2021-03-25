import { AUTH_TOKEN_STORAGE_KEY } from "constants/general";
import { AppContextState } from "context/AppContext";

// Although I don't really like this approach, passing the context allows us to log the user out in case
// of an authorization error instead of having to deal with this in a lot of other places...

export const collectionsGraphqlRequest = async (
  context: AppContextState,
  query: string,
  variables?: Object
) => {
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
  const url =
    process.env.REACT_APP_COLLECTIONS_GRAPHQL_URL ||
    (isDev
      ? "/collections-api/query"
      : "https://dev-collections.design.shop/query");

  const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const requestBody = JSON.stringify({
    query: query,
    variables: variables,
  });

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers,
      body: requestBody,
      credentials: "omit",
    });
  } catch (error) {
    console.error("Logging error:" + error);
    throw new ClientError(getErrorMessage([], error), [], error);
  }

  const parsedResponse = await parseResponse(response);

  if (response.ok && !parsedResponse.errors && parsedResponse.data) {
    return parsedResponse.data;
  } else {
    console.error(parsedResponse);
    if (!parsedResponse.errors) {
      return;
    }
    if (
      parsedResponse.errors.find((e) =>
        e.message.toLowerCase().includes("unauthorized")
      )
    ) {
      // TEMP: This is a very quick way to deal with tokens expiring.
      // TODO: Improve this.
      await context.logout();
      window.location.reload();
      return;
    }
    console.error(parsedResponse.errors);

    throw new ClientError(
      getErrorMessage(parsedResponse.errors),
      parsedResponse.errors,
      null
    );
  }
};

const parseResponse = async (response: any) => {
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.startsWith("application/json")) {
    return response.json();
  }
  return response.text();
};

export class ClientError extends Error {
  graphqlErrors: { message: string }[];
  networkError: any;

  constructor(
    message: string,
    graphqlErrors: { message: string }[],
    networkError: any
  ) {
    super(message);
    this.graphqlErrors = graphqlErrors;
    this.networkError = networkError;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, ClientError);
    }
  }
}

const getErrorMessage = (
  graphqlErrors: { message: string }[],
  networkError?: Error
) => {
  let message = "";
  if (graphqlErrors.length > 0) {
    graphqlErrors.forEach((err: { message: string }) => {
      const errorMessage = err ? err.message : "Error message not found.";
      message += `GraphQL error: ${errorMessage}\n`;
    });
  }
  if (networkError) {
    message += "Network error: " + networkError.message + "\n";
  }
  // strip newline from the end of the message
  message = message.replace(/\n$/, "");
  return message;
};
