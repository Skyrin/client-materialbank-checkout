import * as React from "react";
import styles from "./RadioButton.module.scss";
import cn from "classnames";

type Props = {
  value: any;
  option: any;
  onChange?: (value: any) => void;
  className?: string;
};

export default function RadioButton(props: Props) {
  return (
    <div
      className={cn(styles.RadioButton, props.className, {
        [styles.selected]: props.value === props.option,
      })}
      onClick={() => {
        props.onChange?.(props.option);
      }}
    />
  );
}
