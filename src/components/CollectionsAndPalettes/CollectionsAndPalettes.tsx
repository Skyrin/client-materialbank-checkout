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
import CollectionsToolbar from "./common/CollectionsToolbar/CollectionsToolbar";
import CollectionsHeader from "./common/CollectionsHeader/CollectionsHeader";
import CollectionsFooter from "./common/CollectionsFooter/CollectionsFooter";
import Collection from "./Collections/Collection/Collection";
import ExploreTags from "./common/ExploreTags/ExploreTags";
import MoreIdeas from "./common/MoreIdeas/MoreIdeas";
import { AppContext, AppContextState, Modals } from "context/AppContext";

type Props = RouteComponentProps;

interface State {
  display: string;
}

enum DisplayOption {
  Collections = "collections",
  Palettes = "palettes",
}

export default class CollectionsAndPalettes extends React.Component<
  Props,
  State
> {
  static contextType = AppContext;
  context!: AppContextState;

  constructor(props) {
    super(props);
    let display = DisplayOption.Collections;
    if (window.location.href.includes(COLLECTIONS_URL)) {
      display = DisplayOption.Collections;
    } else if (window.location.href.includes(PALETTES_URL)) {
      display = DisplayOption.Palettes;
    }
    this.state = {
      display: display,
    };
  }

  componentDidMount() {
    if (!this.context.isLoggedIn) {
      this.context.openModal(Modals.Login);
    }
  }

  toggleDisplay = (display: DisplayOption) => {
    this.setState({ display: display });
  };

  render() {
    return (
      <React.Fragment>
        <div className={styles.pageWrapper}>
          <CollectionsHeader />
          {this.context.isLoggedIn ? (
            <div className={styles.pageContent}>
              <Switch>
                <Redirect
                  exact
                  from={COLLECTIONS_AND_PALETTES_URL}
                  to={COLLECTIONS_URL}
                />
                <Route path={COLLECTION_URL} component={Collection} />
                <Route
                  exact
                  path={COLLECTIONS_URL}
                  render={() => {
                    return (
                      <React.Fragment>
                        <CollectionsToolbar
                          history={this.props.history}
                          title={"Your Collections & Palettes"}
                          buttons={[
                            DisplayOption.Collections,
                            DisplayOption.Palettes,
                          ]}
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
                          history={this.props.history}
                          title={"Your Collections & Palettes"}
                          buttons={[
                            DisplayOption.Collections,
                            DisplayOption.Palettes,
                          ]}
                          activeButtonDisplay={this.state.display}
                          toggleDisplay={this.toggleDisplay}
                        />
                        <Palettes />
                      </React.Fragment>
                    );
                  }}
                />
              </Switch>
              {/*The commonArea element is added here in order to keep the AddToCart Button inside the Collection Cards container, also decide its position*/}
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
          ) : (
            <div className={styles.pageContent}></div>
          )}
          <CollectionsFooter />
        </div>
      </React.Fragment>
    );
  }
}
