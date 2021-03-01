import GoogleLogin from "react-google-login";
import React from "react";
import styles from "./LoginGoogle.module.scss";
import cn from "classnames";

const clientId =
  "436309153549-c40ouqns46cb7k8tkpuva6ts9fa0krpv.apps.googleusercontent.com";

type Props = {
  buttonText: string;
  className?: string;
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
          <div
            className={cn(styles.signIn, props.className)}
            onClick={renderProps.onClick}
          >
            <div className={cn("fab", "fa-google", styles.icon)} />
            {props.buttonText}
          </div>
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
