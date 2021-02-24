import * as React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../constants/urls";
import CollectionsToolbar from "../common/Toolbar/CollectionsToolbar";
import styles from "components/CollectionsAndPalettes/Collections/Collections.module.scss";
import face1 from "../../../assets/images/face1.jpeg";
import face2 from "../../../assets/images/face2.jpg";
import letter1 from "../../../assets/images/letter1.png";
import ItemCard from "../common/ItemCard/ItemCard";

interface State {
  mode: string;
  display: string;
  card: {
    type: string;
    title1: string;
    title2: string;
    title3: string;
    price: string;
    imagePath: string;
  }[];
}
export default class Collections extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      mode: "image",
      display: "everything",
      card: [
        {
          type: "room",
          title1: "Living Room",
          title2: "Rhonda Roomdesigner",
          title3: "Scandinavian Oasis",
          price: null,
          imagePath:
            "https://www.mydomaine.com/thmb/MNBaDGmg4IW7tOvl3pxVNpqQ6uE=/2500x3049/filters:fill(auto,1)/DesignbyEmilyHendersonDesignandPhotobySaraLigorria-Tramp_654-b8122ec9f66b4c69a068859958d8db37.jpg",
        },
        {
          type: "palette",
          title1: "Palette",
          title2: "David Designername",
          title3: "Textils",
          price: null,
          imagePath:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5brHIzPOkAv7A4E5ul_mT5BaCRbykzf1xvA&usqp=CAU",
        },
        {
          type: "sample",
          title1: "Indusparquet",
          title2: "Brazilian Pecan Engineered",
          title3: "$8.95 / sq ft",
          price: "6",
          imagePath:
            "https://www.haro.com/media/custom/produktfinder/parkett/draufsicht/792x865/535575_HARO_PARKETT_Schiffsboden_Wenge_Favorit_Ver.jpg",
        },
      ],
    };
    this.toggleMode = this.toggleMode.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
  }

  toggleMode(mode) {
    this.setState({ mode: mode });
  }
  toggleDisplay(display) {
    this.setState({ display: display });
  }
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Redirect
            exact
            from={COLLECTIONS_URL}
            to={COLLECTIONS_URL + `/${this.state.mode}/${this.state.display}`}
          />
        </Switch>
        <React.Fragment>
          <div className="masonry-container">
            {this.state.card.map((item: any, index: number) => {
              return <ItemCard mode={"image"} item={this.state.card[index]} />;
            })}
            {this.state.card.map((item: any, index: number) => {
              return <ItemCard mode={"info"} item={this.state.card[index]} />;
            })}
            {this.state.card.map((item: any, index: number) => {
              return <ItemCard mode={"edit"} item={this.state.card[index]} />;
            })}
          </div>
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
              activeButtonMode={this.state.mode}
              activeButtonDisplay={this.state.display}
              toggleMode={this.toggleMode}
              toggleDisplay={this.toggleDisplay}
            />
          </div>
        </React.Fragment>
      </React.Fragment>
    );
  }
}
