import {
  COLLECTIONS_URL,
  PALETTES_URL,
  COLLECTIONS_AND_PALETTES_URL,
  COLLECTION_URL,
} from "constants/urls";
import * as React from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import styles from "./CollectionsAndPalettes.module.scss";
import Collections from "./Collections/Collections";
import Palettes from "./Palettes/Palettes";
import CollectionsToolbar from "./common/Toolbar/CollectionsToolbar";
import CollectionsHeader from "./common/CollectionsHeader/CollectionsHeader";
import CollectionsFooter from "./common/CollectionsFooter/CollectionsFooter";
import Collection from "./Collections/Collection/Collection";

type Props = RouteComponentProps;

interface State {
  display: string;
}

export default class CollectionsAndPalettes extends React.Component<
  Props,
  State
> {
  constructor(props) {
    super(props);
    this.state = {
      display: "collections",
    };
  }

  toggleDisplay = (display) => {
    this.setState({ display: display });
  };

  render() {
    return (
      <React.Fragment>
        <div className={styles.pageWrapper}>
          <CollectionsHeader />
          <div className={styles.pageContent}>
            <Switch>
              <Redirect
                exact
                from={COLLECTIONS_AND_PALETTES_URL}
                to={COLLECTIONS_URL}
              />
              <Route
                exact
                path={COLLECTIONS_URL}
                component={() => {
                  return (
                    <React.Fragment>
                      <CollectionsToolbar
                        title={"Your Collections & Palettes"}
                        buttons={["collections", "palettes"]}
                        activeButtonDisplay={this.state.display}
                        toggleDisplay={this.toggleDisplay}
                      />
                      <Collections />
                    </React.Fragment>
                  );
                }}
              />
              <Switch>
                <Route path={COLLECTION_URL} component={Collection} />
                <Route
                  exact
                  path={PALETTES_URL}
                  component={() => {
                    return (
                      <React.Fragment>
                        <CollectionsToolbar
                          title={"Your Collections & Palettes"}
                          buttons={["collections", "palettes"]}
                          activeButtonDisplay={this.state.display}
                          toggleDisplay={this.toggleDisplay}
                        />
                        <Palettes />
                      </React.Fragment>
                    );
                  }}
                />
              </Switch>
            </Switch>
          </div>
          <CollectionsFooter />
        </div>
      </React.Fragment>
    );
  }
}
