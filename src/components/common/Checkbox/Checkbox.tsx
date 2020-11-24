import * as React from "react";
import styles from "./Checkbox.module.scss";
import cn from "classnames";

type Props = {
  value: boolean;
  onChange: Function;
  className?: string;
};

export default function Checkbox(props: Props) {
  return (
    <div
      className={cn(styles.container, props.className, {
        [styles.checked]: props.value,
      })}
      onClick={() => props.onChange(!props.value)}
    >
      <i className="fas fa-check" />
    </div>
  );
}
