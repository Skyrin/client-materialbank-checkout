import GoogleLogin from "react-google-login";
import React from "react";
import { RESTRequest } from "RestClient";
import { AppContext, AppContextState } from "context/AppContext";
import { isString } from "lodash";

const clientId =
  "86276352424-1vrsegskhdhdduvfvnk45mkofbac46tp.apps.googleusercontent.com";

type Props = {
  className?: string;
  buttonProp?: any;
  link?: boolean;
};
class LoginGoogle extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  onSuccess = async (res) => {
    console.log("[Google Login] response", res);
    console.log("[Google Login] OAuth token", res.getAuthResponse());
    const requestURL = this.props.link
      ? "social/google/auth/link"
      : "social/google/auth/generateCustomerToken";

    if (this.props.link) {
      console.log("[Google Login] Attempting to link to account");
    } else {
      console.log("[Google Login] Attempting to create a new account");
    }

    const resp = await RESTRequest("POST", requestURL, {
      token: res.getAuthResponse().access_token,
    });
    console.log("MAGENTO CALL RESPONSE", resp);
    const body = await resp.json();
    console.log("MAGENTO BODY", body);

    if (!this.props.link && body && isString(body)) {
      await this.context.loginWithToken(body);
    }
  };

  onFailure = (res) => {
    console.log("[Login failed] res:", res);
  };

  render() {
    return (
      <div>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          render={(renderProps) => (
            <div onClick={renderProps.onClick}>{this.props.buttonProp}</div>
          )}
          onSuccess={this.onSuccess}
          onFailure={this.onFailure}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    );
  }
}

export default LoginGoogle;
