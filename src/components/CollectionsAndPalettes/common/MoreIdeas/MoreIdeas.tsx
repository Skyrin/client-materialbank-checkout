import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/MoreIdeas/MoreIdeas.module.scss";
import cn from "classnames";
import ItemCard from "../ItemCard/ItemCard";
import RoundButtons from "../RoundButtons/RoundButtons";

type Props = {
  headerText?: string;
};

export default class MoreIdeas extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      maxCards: 8,
      mode: "info",
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

  showMoreCards = () => {
    this.setState({ maxCards: this.state.card.length });
  };

  render() {
    const headerText =
      this.props.headerText || "More ideas for this collection";
    return (
      <div className={cn(styles.moreIdeasContainer)}>
        <div className={styles.ideasHeader}>{headerText}</div>
        <div className="horizontal-divider-toolbar extra-margin"></div>
        <div className="masonry-container">
          {this.state.card
            .slice(0, this.state.maxCards)
            .map((item: any, index: number) => {
              return (
                <ItemCard
                  key={index}
                  mode={this.state.mode}
                  item={this.state.card[index]}
                />
              );
            })}
        </div>
        {this.state.card.length > this.state.maxCards && (
          <div className={styles.buttonContainer}>
            <RoundButtons
              buttons={[
                `Load ${this.state.card.length - this.state.maxCards} more`,
              ]}
              selectedButton={null}
              onButtonSelected={this.showMoreCards}
            />
          </div>
        )}
      </div>
    );
  }
}
