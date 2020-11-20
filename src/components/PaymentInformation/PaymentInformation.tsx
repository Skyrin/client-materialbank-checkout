import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import Logo from "components/common/Logo/Logo";
import { BREADCRUMBS_STEPS } from "constants/general";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PaymentInformation.module.scss";
import cn from "classnames";

type Props = RouteComponentProps;

type State = {
  paymentInfo: any;
};

export class PaymentInformation extends React.Component<Props, State> {
  state = {
    paymentInfo: {},
  };

  render() {
    return (
      <div className={cn("funnel-page", styles.PaymentInformation)}>
        <Logo className={styles.logo} />
        <Breadcrumbs steps={BREADCRUMBS_STEPS} className={styles.breadcrumbs} />
        Payment Information
      </div>
    );
  }
}

export default withRouter(PaymentInformation);
