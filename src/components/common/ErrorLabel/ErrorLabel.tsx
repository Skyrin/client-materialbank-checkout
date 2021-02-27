import styles from "./ErrorLabel.module.scss";
import cn from "classnames";
import React from "react";

type Props = {
  className?: string;
  errorText: string;
};

export default function ErrorLabel(props: Props) {
  return (
    <div className={cn(styles.errorAlert, props.className)}>
      <i className={cn("fas", "fa-exclamation-triangle", styles.errorIcon)} />
      {props.errorText}
    </div>
  );
}
