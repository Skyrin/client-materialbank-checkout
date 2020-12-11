import styles from "./EncryptionNotice.module.scss";
import cn from "classnames";
import * as React from "react";

export default function EncryptionNotice() {
  return (
    <div className={styles.encryptionNotice}>
      <i className={cn("fas fa-lock-alt", styles.lockIcon)} />
      This is a secure 128-bit SSL Encrypted payment. You’re safe.
    </div>
  );
}
