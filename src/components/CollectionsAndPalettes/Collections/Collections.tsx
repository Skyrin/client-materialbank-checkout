import * as React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { SINGLE_COLLECTION_URL } from "../../../constants/urls";
import styles from "components/CollectionsAndPalettes/Collections/Collections.module.scss";
import ExploreTags from "../common/ExploreTags/ExploreTags";
import SingleCollection from "./SingleCollection/SingleCollection";
import CollectionCard from "../common/CollectionCard/CollectionCard";

interface State {
  card: {
    id: number;
    type: string;
    title1: string;
    title2: string;
    imagePath: string;
  }[];
}

export default class Collections extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      card: [
        {
          id: 1,
          type: "collection",
          title1: "collection",
          title2: "Rhonda Roomdesigner",
          imagePath:
            "https://upload.wikimedia.org/wikipedia/commons/7/76/Color_icon_violet_v2.svg",
        },
      ],
    };
  }

  render() {
    console.log(this.state.card);
    return (
      <React.Fragment>
        <Switch>
          <Route path={SINGLE_COLLECTION_URL} component={SingleCollection} />
          <div className={styles.cardCollection}>
            {this.state.card.map((item: any, index: number) => {
              return (
                <Link
                  to={SINGLE_COLLECTION_URL + `/${this.state.card[index].id}`}
                >
                  <CollectionCard item={this.state.card[index]} />
                </Link>
              );
            })}
          </div>
        </Switch>
        <React.Fragment>
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
        </React.Fragment>
      </React.Fragment>
    );
  }
}
