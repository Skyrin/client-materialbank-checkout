import {
  COLLECTIONS_URL,
  PALETTES_URL,
  COLLECTIONS_AND_PALETTES_URL,
} from "constants/urls";
import * as React from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import styles from "./CollectionsAndPalettes.module.scss";
import { AppContext, AppContextState } from "../../context/AppContext";
import Collections from "./Collections/Collections";
import Palettes from "./Palettes/Palettes";
import CollectionsToolbar from "./common/Toolbar/CollectionsToolbar";
import ExploreTags from "./common/ExploreTags/ExploreTags";
import CollectionsHeader from "./common/CollectionsHeader/CollectionsHeader";
import CollectionsFooter from "./common/CollectionsFooter/CollectionsFooter";

type Props = RouteComponentProps;

export default class CollectionsAndPalettes extends React.Component<Props> {
  static contextType = AppContext;
  context!: AppContextState;

  render() {
    return (
      <React.Fragment>
        <div className={styles.pageWrapper}>
          <CollectionsHeader />
          <div className={styles.pageContent}>
            <CollectionsToolbar title={"Your collections & palettes"} />
            <Switch>
              <Redirect
                exact
                from={COLLECTIONS_AND_PALETTES_URL}
                to={COLLECTIONS_URL}
              />
              <Route path={COLLECTIONS_URL} component={Collections} />
              <Route path={PALETTES_URL} component={Palettes} />
            </Switch>
            <ExploreTags />
          </div>
          <CollectionsFooter />
        </div>
      </React.Fragment>
    );
  }
}
