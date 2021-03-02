import * as React from "react";
import { NavLink } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../../constants/urls";
import ItemCard from "../../common/ItemCard/ItemCard";
import CollectionsToolbar from "../../common/Toolbar/CollectionsToolbar";
import UploadCard from "../../common/UploadCard/UploadCard";
import AddToCartButton from "components/CollectionsAndPalettes/common/AddToCartButton/AddToCartButton";
import styles from "components/CollectionsAndPalettes/Collections/Collection/Collection.module.scss";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../../context/AppContext";

export default class Collection extends React.Component<any, any> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;
  uploadPhoto = () => {
    this.context.openModal(Modals.UploadPhoto);
  };

  constructor(props) {
    super(props);
    this.state = {
      isInViewPort: false,
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
      person: [],
    };
  }

  isInViewport = () => {
    const elem = document.querySelector(".commonArea");
    if (elem) {
      const bounding = elem.getBoundingClientRect();
      return (
        bounding.bottom < 0 ||
        bounding.right < 0 ||
        bounding.left > window.innerWidth ||
        bounding.top > window.innerHeight
      );
    }
  };
  scrollingBehaviour = () => {
    let moreIdeas = this.isInViewport();
    this.setState({ isInViewPort: moreIdeas });
  };

  toggleMode = (mode) => {
    this.setState({ mode: mode });
  };

  toggleDisplay = (display) => {
    this.setState({ display: display });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", this.scrollingBehaviour);

    //TODO implement the call
    const collaborators = [
      {
        firstName: "Anne",
        lastName: "Enduser",
        isAuthenticated: true,
        imagePath:
          "https://vanishingportrait.com/wp-content/uploads/2019/05/tiffanytrenda-vanishingportrait-identity.jpg",
        email: "anne.enduser@gmail.com",
      },
      {
        firstName: "Dave",
        lastName: "Friendname",
        isAuthenticated: false,
        imagePath:
          "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?size=626&ext=jpg",
        email: "name.@gmail.com",
      },
      {
        firstName: "Michael",
        lastName: "Otherguy",
        isAuthenticated: false,
        imagePath:
          "https://i.pinimg.com/originals/9c/a9/b2/9ca9b293ed52b3a124b802449eb653d0.jpg",
        email: "name@gmail.com",
      },
      {
        firstName: "Amelia",
        lastName: "User",
        isAuthenticated: false,
        imagePath:
          "data:image/jpeg;base64,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",
        email: "name@gmail.com",
      },
      {
        firstName: "Marie",
        lastName: "Ishere",
        isAuthenticated: false,
        imagePath:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWRntDjXs_RggTSWM4AdHwTQ4ppLL44GLoFw&usqp=CAU",
        email: "name@gmail.com",
      },
    ];
    this.context.storeCollaborators(collaborators);
    this.setState({ person: collaborators });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollingBehaviour);
  }

  render() {
    return (
      <React.Fragment>
        <NavLink className={styles.yourCollections} to={COLLECTIONS_URL}>
          Your Collections
          <i className={"fas fa-chevron-right"} />
        </NavLink>
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
          collaborators={this.state.person.map(
            (person: any) => person.imagePath
          )}
          activeButtonDisplay={this.state.display}
          toggleDisplay={this.toggleDisplay}
          activeButtonMode={this.state.mode}
          toggleMode={this.toggleMode}
        />
        <div className="masonry-container ">
          <UploadCard
            caption={"Upload a photo or drag & drop here "}
            onClick={this.uploadPhoto}
          />
          {this.state.card.map((item: any, index: number) => {
            return (
              <ItemCard
                key={index}
                mode={this.state.mode}
                item={this.state.card[index]}
              />
            );
          })}
          <AddToCartButton isInViewPort={this.state.isInViewPort} />
        </div>
      </React.Fragment>
    );
  }
}
