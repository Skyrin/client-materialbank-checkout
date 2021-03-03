import * as React from "react";
import { Link } from "react-router-dom";
import { PALETTES_URL } from "../../../constants/urls";
import styles from "components/CollectionsAndPalettes/Palettes/Palettes.module.scss";
import CollectionCard from "../common/CollectionCard/CollectionCard";
import face1 from "../../../assets/images/face1.jpeg";
import face2 from "../../../assets/images/face2.jpg";
import letter1 from "../../../assets/images/letter1.png";
import palette1 from "../../../assets/images/palette1.png";
import UploadCard from "../common/UploadCard/UploadCard";

interface State {
  card: {
    id: number;
    type: string;
    title1: string;
    contributors: any;
    imagePath: string;
  }[];
}

export default class Palettes extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      card: [
        {
          id: 1,
          type: "palette",
          title1: "Fun textures",
          contributors: [face1, face2, letter1, face1, face2, letter1, face1],
          imagePath: palette1,
        },
      ],
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.cardCollection}>
          <UploadCard
            caption={"Build a Palette on Design Desk"}
            icon={"far fa-wrench"}
          />
          {this.state.card &&
            this.state.card.map((item: any, index: number) => {
              return (
                <Link to={PALETTES_URL + `/${this.state.card[index].id}`}>
                  <CollectionCard item={this.state.card[index]} />
                </Link>
              );
            })}
        </div>
      </React.Fragment>
    );
  }
}
