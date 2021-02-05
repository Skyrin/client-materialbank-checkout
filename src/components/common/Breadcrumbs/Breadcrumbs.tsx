import * as React from "react";
import {
  matchPath,
  NavLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import styles from "./Breadcrumbs.module.scss";
import cn from "classnames";
import { findIndex } from "lodash-es";
import { CART_URL, goToStorefront } from "constants/urls";

type StepT = {
  url: string;
  name: string;
};

type Props = RouteComponentProps & {
  steps: StepT[];
  className?: string;
};

export function Breadcrumbs(props: Props) {
  // TODO: We probably have to implement some better logic for figuring out where the user is allowed to be.
  // For now, the breadcrumbs only allow going back from the current page.

  const activeIndex = findIndex(
    props.steps,
    (step) =>
      !!matchPath(props.location.pathname, {
        path: step.url,
        exact: true,
      })
  );
  return (
    <div className={cn(styles.Breadcrumbs, props.className)}>
      {props.steps.map((step, index) => (
        <div className={styles.stepContainer} key={`Breadcrumbs_${step.name}`}>
          <NavLink
            to={step.url}
            className={cn(styles.link, {
              [styles.disabled]: index >= activeIndex,
            })}
            exact
            tabIndex={index >= activeIndex ? -1 : 0}
            activeClassName={styles.active}
            onClick={(e) => {
              if (step.url === CART_URL) {
                e.preventDefault();
                e.stopPropagation();
                // In order to go to the cart page, we want to make the browser refresh the storefront
                goToStorefront(CART_URL);
              }
            }}
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

export default withRouter(Breadcrumbs);
