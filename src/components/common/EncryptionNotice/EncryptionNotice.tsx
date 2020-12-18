import styles from "./EncryptionNotice.module.scss";
import cn from "classnames";
import * as React from "react";
import { isOnMobile } from "utils/responsive";

export default function EncryptionNotice() {
  return (
    <div className={styles.encryptionNotice}>
      <i className={cn("fas fa-lock-alt", styles.lockIcon)} />
      {!isOnMobile() &&
        "This is a secure 128-bit SSL Encrypted payment. You’re safe."}
      {isOnMobile() && (
        <React.Fragment>
          This is a secure 128-bit SSL Encrypted payment.
          <br />
          You're safe.
        </React.Fragment>
      )}
    </div>
  );
}
