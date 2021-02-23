import * as React from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import {
  COLLECTIONS_EDIT_URL,
  COLLECTIONS_IMAGE_URL,
  COLLECTIONS_INFO_URL,
  COLLECTIONS_URL,
} from "../../../constants/urls";
import CollectionsImage from "./CollectionsImage/CollectionsImage";
import CollectionsInfo from "./CollectionsInfo/CollectionsInfo";
import CollectionsEdit from "./CollectionsEdit/CollectionsEdit";
import ItemCard from "../common/ItemCard/ItemCard";

interface State {
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
  constructor(props: any) {
    super(props);
    this.state = {
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
  }

  render() {
    return (
      <React.Fragment>
        <h1>collections</h1>
        <Switch>
          <Redirect exact from={COLLECTIONS_URL} to={COLLECTIONS_IMAGE_URL} />
          <Route path={COLLECTIONS_IMAGE_URL} component={CollectionsImage} />
          <Route path={COLLECTIONS_INFO_URL} component={CollectionsInfo} />
          <Route path={COLLECTIONS_EDIT_URL} component={CollectionsEdit} />
        </Switch>
        <Link to={COLLECTIONS_IMAGE_URL}>Image</Link>
        <Link to={COLLECTIONS_INFO_URL}>Info</Link>
        <Link to={COLLECTIONS_EDIT_URL}>Edit</Link>
        {/*for demo purposes*/}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            columnGap: "20px",
            width: "100%",
          }}
        >
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
      </React.Fragment>
    );
  }
}
