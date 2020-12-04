import * as React from "react";
import cn from "classnames";
import styles from "./Input.module.scss";

type Props = {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  type?: string;
  formatter?: (value: string) => string;
  parser?: (value: string) => string;
  pattern?: string;
  inputMode?:
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search"
    | undefined;
  actionButton?: React.ReactNode;
  onActionButtonClick?: () => void;
  className?: string;
};

export default function Input(props: Props) {
  const value = !!props.formatter ? props.formatter(props.value) : props.value;
  const parseValue = (value: string) => {
    return !!props.parser ? props.parser(value) : value;
  };

  return (
    <div className={cn(styles.Input, props.className)}>
      <input
        className={cn(styles.input)}
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={value}
        onChange={(evt) => {
          props.onChange(parseValue(evt.target.value));
        }}
        pattern={props.pattern}
        inputMode={props.inputMode}
      />
      {props.actionButton && (
        <div
          className={styles.actionButton}
          onClick={() => {
            props.onActionButtonClick && props.onActionButtonClick();
          }}
        >
          {props.actionButton}
        </div>
      )}
    </div>
  );
}
