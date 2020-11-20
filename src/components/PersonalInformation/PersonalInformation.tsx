import Breadcrumbs from "components/common/Breadcrumbs/Breadcrumbs";
import Logo from "components/common/Logo/Logo";
import { BREADCRUMBS_STEPS } from "constants/general";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./PersonalInformation.module.scss";
import cn from "classnames";

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
      </div>
    );
  }
}

export default withRouter(PersonalInformation);
