import * as React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Breadcrumbs.module.scss";
import cn from "classnames";

type StepT = {
  url: string;
  name: string;
};

type Props = {
  steps: StepT[];
  className?: string;
};

export default function Breadcrumbs(props: Props) {
  return (
    <div className={cn(styles.Breadcrumbs, props.className)}>
      {props.steps.map((step, index) => (
        <div className={styles.stepContainer} key={`Breadcrumbs_${step.name}`}>
          <NavLink
            to={step.url}
            className={styles.link}
            activeClassName={styles.active}
          >
            {step.name}
          </NavLink>
          {index < props.steps.length - 1 && (
            <i className={cn("fas fa-chevron-right", styles.arrow)} />
          )}
        </div>
      ))}
    </div>
  );
}
