import {
  COLLECTIONS_URL,
  PALETTES_URL,
  COLLECTIONS_AND_PALETTES_URL,
  COLLECTION_URL,
  PALETTE_URL,
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
import ExploreTags from "./common/ExploreTags/ExploreTags";
import MoreIdeas from "./common/MoreIdeas/MoreIdeas";
import Palette from "./Palettes/Palette/Palette";

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
    let display;

    if (window.location.href.includes(COLLECTIONS_URL)) {
      display = "collections";
    } else if (window.location.href.includes(PALETTES_URL)) {
      display = "palettes";
    }
    this.state = {
      display,
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
              <Route path={COLLECTION_URL} component={Collection} />
              <Route path={PALETTE_URL} component={Palette} />
              <Route
                exact
                path={COLLECTIONS_URL}
                render={() => {
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
              <Route
                exact
                path={PALETTES_URL}
                render={() => {
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
            <div className={"commonArea"}>
              <MoreIdeas />
              <ExploreTags
                buttons={[
                  "farmhouse",
                  "kitchen",
                  "farmsink",
                  "tile backsplash",
                  "wood-look flooring",
                  "white cabinetry",
                  "tile flooring",
                  "cozy color scheme",
                ]}
              />
            </div>
          </div>
          <CollectionsFooter />
        </div>
      </React.Fragment>
    );
  }
}
