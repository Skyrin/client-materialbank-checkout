import * as React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../constants/urls";
import CollectionsToolbar from "../common/Toolbar/CollectionsToolbar";
import styles from "components/CollectionsAndPalettes/Collections/Collections.module.scss";
import face1 from "../../../assets/images/face1.jpeg";
import face2 from "../../../assets/images/face2.jpg";
import letter1 from "../../../assets/images/letter1.png";

export default class Collections extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      mode: "image",
    };
    this.toggleMode = this.toggleMode.bind(this);
  }

  toggleMode(mode) {
    this.setState({ mode: mode });
  }

  render() {
    return (
      <React.Fragment>
        <Switch>
          <Redirect
            exact
            from={COLLECTIONS_URL}
            to={COLLECTIONS_URL + `/${this.state.mode}`}
          />
        </Switch>
        <React.Fragment>
          <div className={styles.collectionToolbar}>
            <CollectionsToolbar
              title={"Rustic Kitchens"}
              isCollection
              buttons={[
                "everything",
                "palettes",
                "materials",
                "rooms",
                "your uploads",
                "price",
              ]}
              contributors={[
                face1,
                face2,
                letter1,
                face1,
                face2,
                letter1,
                face1,
              ]}
              activeButton={this.state.mode}
              toggleMode={this.toggleMode}
            />
          </div>
        </React.Fragment>
      </React.Fragment>
    );
  }
}
