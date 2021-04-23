import GoogleLogin from "react-google-login";
import React from "react";
import { RESTRequest } from "RestClient";

const clientId =
  "86276352424-1vrsegskhdhdduvfvnk45mkofbac46tp.apps.googleusercontent.com";

type Props = {
  className?: string;
  buttonProp?: any;
};

function LoginGoogle(props: Props) {
  const onSuccess = async (res) => {
    console.log("[Google Login Success] currentUser:", res.profileObj);
    const resp = await RESTRequest("POST", "social/google/auth", {
      email: res.profileObj.email,
      name: res.profileObj.name,
      googleId: res.profileObj.googleId,
    });
    console.log("MAGENTO CALL RESPONSE", resp);
    const body = await resp.json();
    console.log("MAGENTO BODY", body);
  };

  const onFailure = (res) => {
    console.log("[Login failed] res:", res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        render={(renderProps) => (
          <div onClick={renderProps.onClick}>{props.buttonProp}</div>
        )}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />
    </div>
  );
}

export default LoginGoogle;
