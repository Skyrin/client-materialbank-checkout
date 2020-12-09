import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import Logo from "components/common/Logo/Logo";
import { BREADCRUMBS_STEPS } from "constants/general";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PaymentInformation.module.scss";
import cn from "classnames";
import { PERSONAL_INFORMATION_URL } from "constants/urls";
import EncryptionNotice from "./EncryptionNotice/EncryptionNotice";
import Input from "../common/Input/Input";

type Props = RouteComponentProps;

type State = {
  paymentInfo: any;
};

export class PaymentInformation extends React.Component<Props, State> {
  state = {
    paymentInfo: {},
  };

  renderContactInfoSection = () => {
    return (
      <div className={styles.infoSection}>
        <h3 className={styles.title}>Contact</h3>
        <div className={styles.changeButton}>Change</div>
        <div className={styles.value}>johndoe@gmail.com</div>
      </div>
    );
  };

  renderShipToInfoSection = () => {
    return (
      <div className={styles.infoSection}>
        <h3 className={styles.title}>Ship To</h3>
        <div className={styles.changeButton}>Change</div>
        <div className={styles.value}>
          236 West 30th Street 11th Floor, New York, NY 10001
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={cn("funnel-page", styles.PaymentInformation)}>
        <Logo className={styles.logo} />
        <Breadcrumbs steps={BREADCRUMBS_STEPS} className={styles.breadcrumbs} />
        <EncryptionNotice />

        {this.renderContactInfoSection()}
        {this.renderShipToInfoSection()}

        <div className={styles.navigationContainer}>
          <Link to={PERSONAL_INFORMATION_URL} className="link-button">
            <i className="far fa-long-arrow-left" />
            Return to information
          </Link>

          <button className="button large" disabled>
            Checkout
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(PaymentInformation);
