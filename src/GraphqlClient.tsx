export const graphqlRequest = async (query: string, variables?: Object) => {
  const url = process.env.REACT_APP_GRAPHQL_URL;
  if (!url) {
    console.error("GraphQL URL is not set");
    return;
  }

  const authToken = localStorage.getItem("token");
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
    });
  } catch (error) {
    throw new ClientError(getErrorMessage([], error), [], error);
  }

  const parsedResponse = await parseResponse(response);

  if (response.ok && !parsedResponse.errors && parsedResponse.data) {
    return parsedResponse.data;
  } else {
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
