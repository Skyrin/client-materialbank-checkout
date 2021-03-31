import GoogleLogin from "react-google-login";
import React from "react";

const clientId =
  "86276352424-1vrsegskhdhdduvfvnk45mkofbac46tp.apps.googleusercontent.com";

type Props = {
  className?: string;
  buttonProp?: any;
};

function LoginGoogle(props: Props) {
  const onSuccess = (res) => {
    console.log("[Login Success] currentUser:", res.profileObj);
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
