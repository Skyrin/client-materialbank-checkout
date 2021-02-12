import Loader from "components/common/Loader/Loader";
import * as React from "react";
import styles from "./ButtonLoader.module.scss";
import cn from "classnames";

type Props = {
  containerClassName?: string,
  loaderClassName?: string,
};

export default function ButtonLoader(props: Props) {
  return (
    <Loader
      containerClassName={cn(styles.container, props.containerClassName)}
      loaderClassName={cn(styles.loader, props.loaderClassName)}
    />
  );
}
