import * as React from "react";
import { NavLink } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../../constants/urls";
import ItemCard from "../../common/ItemCard/ItemCard";
import CollectionsToolbar from "../../common/Toolbar/CollectionsToolbar";
import UploadCard from "../../common/UploadCard/UploadCard";
import AddToCartButton from "components/CollectionsAndPalettes/common/AddToCartButton/AddToCartButton";
import styles from "components/CollectionsAndPalettes/Collections/Collection/Collection.module.scss";
import cn from "classnames";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../../context/AppContext";
import MoreIdeas from "components/CollectionsAndPalettes/common/MoreIdeas/MoreIdeas";

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
      commonAreaIsInViewport: false,
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

  commonAreaIsInViewport = () => {
    const commonArea = document.querySelector(".commonArea");
    if (commonArea) {
      const bounding = commonArea.getBoundingClientRect();
      return (
        bounding.bottom < 0 ||
        bounding.right < 0 ||
        bounding.left > window.innerWidth ||
        bounding.top > window.innerHeight
      );
    }
  };

  scrollingBehaviour = () => {
    let isInViewport = this.commonAreaIsInViewport();
    this.setState({ commonAreaIsInViewport: isInViewport });
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
    // TODO: Figure out why this is needed. I suspect images are not loaded fully when this runs.
    window.setTimeout(() => {
      this.scrollingBehaviour();
    }, 100);

    //TODO implement the call
    const collaborators = [
      {
        id: 1,
        firstName: "Anne",
        lastName: "Enduser",
        isAuthenticated: true,
        isSharedWith: true,
        imagePath:
          "https://vanishingportrait.com/wp-content/uploads/2019/05/tiffanytrenda-vanishingportrait-identity.jpg",
        email: "anne.enduser@gmail.com",
      },
      {
        id: 2,
        firstName: "Dave",
        lastName: "Friendname",
        isAuthenticated: false,
        isSharedWith: true,
        imagePath:
          "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?size=626&ext=jpg",
        email: "name.@gmail.com",
      },
      {
        id: 3,
        firstName: "Michael",
        lastName: "Otherguy",
        isAuthenticated: false,
        isSharedWith: true,
        imagePath:
          "https://i.pinimg.com/originals/9c/a9/b2/9ca9b293ed52b3a124b802449eb653d0.jpg",
        email: "name@gmail.com",
      },
      {
        id: 4,
        firstName: "Amelia",
        lastName: "User",
        isAuthenticated: false,
        isSharedWith: true,
        imagePath:
          "https://www.adobe.com/content/dam/cc/us/en/creativecloud/photography/discover/portrait-photography/CODERED_B1_portrait_photography-P4a_438x447.jpg.img.jpg",
        email: "name@gmail.com",
      },
      {
        id: 5,
        firstName: "Marie",
        lastName: "Ishere",
        isAuthenticated: false,
        isSharedWith: false,
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
          collaborators={
            this.state.person &&
            this.state.person.map((person: any) => person.imagePath)
          }
          activeButtonDisplay={this.state.display}
          toggleDisplay={this.toggleDisplay}
          activeButtonMode={this.state.mode}
          toggleMode={this.toggleMode}
        />
        <div
          className={cn(
            "masonry-container",
            !this.state.card.length ? styles.emptyCollection : ""
          )}
        >
          <UploadCard
            caption={"Upload a photo or drag & drop here "}
            onClick={this.uploadPhoto}
          />
          {!this.state.card.length && (
            <div className={styles.empty}>
              You have not added anything to this collection yet!
            </div>
          )}
          {this.state.card.map((item: any, index: number) => {
            return (
              <ItemCard
                key={index}
                mode={this.state.mode}
                item={this.state.card[index]}
              />
            );
          })}
          {this.state.card.length && (
            <AddToCartButton
              commonAreaIsInViewport={this.state.commonAreaIsInViewport}
            />
          )}
        </div>
        {/*The commonArea element is added here in order to keep the AddToCart Button inside the Collection Cards container, also decide its position*/}
        {/*<div className={"commonArea"}>*/}
        {/*  <MoreIdeas />*/}
        {/*</div>*/}
      </React.Fragment>
    );
  }
}
