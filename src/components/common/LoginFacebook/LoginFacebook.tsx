import React from "react";
import FacebookLogin from "react-facebook-login";
import cn from "classnames";
import styles from "./LoginFacebook.module.scss";

const appId = "473685456965260";

type Props = {
  buttonText: string;
  className?: string;
};

function LoginFacebook(props: Props) {
  const onCallback = (res) => {
    console.log("[Facebook callback] currentUser:", res.profileObj);
  };

  return (
    <div>
      <FacebookLogin
        appId="562118384400275"
        fields="name,email,picture"
        scope="public_profile,user_friends"
        callback={onCallback}
        textButton={props.buttonText}
        render={(renderProps) => (
          <button onClick={renderProps.onClick}>
            This is my custom FB button
          </button>
        )}
        cssClass={styles.signIn}
        icon={<div className={cn("fab", "fa-facebook-f", styles.icon)} />}
      >
        Sign in with Faceook
      </FacebookLogin>
    </div>
  );
}

export default LoginFacebook;
