import React from "react";
import FacebookLogin from "react-facebook-login";
import cn from "classnames";
import styles from "./LoginFacebook.module.scss";

const appId = "473685456965260";

type Props = {
  buttonText: string;
  className?: string;
  hasIcon?: boolean;
};

function LoginFacebook(props: Props) {
  const onCallback = (res) => {
    console.log("[Facebook callback] currentUser:", res.profileObj);
  };

  return (
    <div>
      <FacebookLogin
        appId={appId}
        fields="name,email,picture"
        scope="public_profile,user_friends"
        callback={onCallback}
        textButton={props.buttonText}
        cssClass={props.className}
        icon={
          props.hasIcon && (
            <div className={cn("fab", "fa-facebook-f", styles.icon)} />
          )
        }
      >
        Sign in with Faceook
      </FacebookLogin>
    </div>
  );
}

export default LoginFacebook;
