import {
  COLLECTIONS_URL,
  PALETTES_URL,
  COLLECTIONS_AND_PALETTES_URL,
} from "constants/urls";
import * as React from "react";
import {
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import styles from "./CollectionsAndPalettes.module.scss";
import { AppContext, AppContextState } from "../../context/AppContext";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import { BREADCRUMBS_STEPS } from "../../constants/general";
import { isOnMobile } from "../../utils/responsive";
import LogoMobile from "../common/LogoMobile/LogoMobile";
import Collections from "./Collections/Collections";
import Palettes from "./Palettes/Palettes";

type Props = RouteComponentProps;

export default class CollectionsAndPalettes extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  render() {
    return (
      <React.Fragment>
        <div className={styles.pageContent}>
          {isOnMobile() && <LogoMobile />}
          <div className={styles.pageWrapper}>
            <Link to={COLLECTIONS_URL}>
              <h1>Collections</h1>
            </Link>
            <Link to={PALETTES_URL}>
              <h1>Pallete</h1>
            </Link>
            <Switch>
              <Redirect
                exact
                from={COLLECTIONS_AND_PALETTES_URL}
                to={COLLECTIONS_URL}
              />
              <Route path={COLLECTIONS_URL} component={Collections} />
              <Route path={PALETTES_URL} component={Palettes} />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
