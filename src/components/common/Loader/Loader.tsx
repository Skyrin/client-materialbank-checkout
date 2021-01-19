import * as React from "react";
import styles from "./Loader.module.scss";
import cn from "classnames";

type Props = {
  containerClassName?: string;
  loaderClassName?: string;
};

export default class Loader extends React.Component<Props> {
  render() {
    return (
      <div className={cn(styles.container, this.props.containerClassName)}>
        <i
          className={cn(
            "far fa-circle-notch fa-spin",
            styles.loader,
            this.props.loaderClassName
          )}
        />
      </div>
    );
  }
}
