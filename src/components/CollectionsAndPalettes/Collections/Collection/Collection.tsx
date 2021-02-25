import ItemCard from "../../common/ItemCard/ItemCard";
import * as React from "react";
import CollectionsToolbar from "../../common/Toolbar/CollectionsToolbar";
import face1 from "../../../../assets/images/face1.jpeg";
import face2 from "../../../../assets/images/face2.jpg";
import letter1 from "../../../../assets/images/letter1.png";

export default class Collection extends React.Component<any, any> {
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
        {
          type: "room",
          title1: "Indusparquet",
          title2: "Brazilian Pecan Engineered",
          title3: "$8.95 / sq ft",
          price: "6",
          imagePath:
            "https://www.john-lewis.co.uk/wp-content/uploads/2018/09/JLH-10.1443821-2500x3559.jpg",
        },
        {
          type: "room",
          title1: "Indusparquet",
          title2: "Brazilian Pecan Engineered",
          title3: "$8.95 / sq ft",
          price: "6",
          imagePath:
            "https://www.thespruce.com/thmb/ygpyRaJpg4ubo3l-sDmiQph9YuQ=/1500x1000/filters:no_upscale():max_bytes(150000):strip_icc()/Scandi1-590ba2563df78c9283f4febf.jpg",
        },
        {
          type: "sample",
          title1: "Indusparquet",
          title2: "Brazilian Pecan Engineered",
          title3: "$8.95 / sq ft",
          price: "6",
          imagePath:
            "https://s.cdnmpro.com/846376239/p/l/5/tapet-albastru-artisan-tiles-rebel-walls~22815.jpg",
        },
        {
          type: "sample",
          title1: "Indusparquet",
          title2: "Brazilian Pecan Engineered",
          title3: "$8.95 / sq ft",
          price: "6",
          imagePath:
            "https://www.thespruce.com/thmb/qbpval5ZAScQyH84n882Q5XKiAo=/4352x3264/smart/filters:no_upscale()/colourful-glazed-rectangular-ceramic-tiles-on-the-exterior-wall-of-a-building-1017505168-175e8d7651074d0eaa21d15fb7ac7019.jpg",
        },
        {
          type: "room",
          title1: "Indusparquet",
          title2: "Brazilian Pecan Engineered",
          title3: "$8.95 / sq ft",
          price: "6",
          imagePath:
            "https://i.pinimg.com/474x/af/61/57/af6157319df8490fa1e6b68946da1ca2.jpg",
        },
      ],
    };
  }

  toggleMode = (mode) => {
    this.setState({ mode: mode });
  };

  toggleDisplay = (display) => {
    this.setState({ display: display });
  };

  render() {
    return (
      <React.Fragment>
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
          contributors={[face1, face2, letter1, face1, face2, letter1, face1]}
          activeButtonDisplay={this.state.display}
          toggleDisplay={this.toggleDisplay}
          activeButtonMode={this.state.mode}
          toggleMode={this.toggleMode}
        />
        <div className="masonry-container">
          {this.state.card.map((item: any, index: number) => {
            return (
              <ItemCard mode={this.state.mode} item={this.state.card[index]} />
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}
