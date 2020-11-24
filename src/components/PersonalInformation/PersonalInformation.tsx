import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import Logo from "components/common/Logo/Logo";
import { BREADCRUMBS_STEPS } from "constants/general";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PersonalInformation.module.scss";
import cn from "classnames";
import { CART_URL, PAYMENT_URL } from "constants/urls";

type Props = RouteComponentProps;

type State = {
  personalInfo: any;
};

export class PersonalInformation extends React.Component<Props, State> {
  state = {
    personalInfo: {},
  };

  render() {
    return (
      <div className={cn("funnel-page", styles.PersonalInformation)}>
        <Logo className={styles.logo} />
        <Breadcrumbs steps={BREADCRUMBS_STEPS} className={styles.breadcrumbs} />
        Personal Information
        <div className={styles.navigationContainer}>
          <Link to={CART_URL} className="link-button">
            <i className="far fa-long-arrow-left" />
            Return to cart
          </Link>
          <button
            className="button large"
            onClick={() => {
              this.props.history.push(PAYMENT_URL);
            }}
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(PersonalInformation);
