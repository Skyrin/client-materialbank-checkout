import * as React from "react";
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../../constants/urls";
import ItemCard from "../../common/ItemCard/ItemCard";
import CollectionsToolbar from "../../common/CollectionsToolbar/CollectionsToolbar";
import UploadCard from "../../common/UploadCard/UploadCard";
import styles from "components/CollectionsAndPalettes/Collections/Collection/Collection.module.scss";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../../context/AppContext";
import MoreIdeas from "components/CollectionsAndPalettes/common/MoreIdeas/MoreIdeas";
import { isOnMobile } from "../../../../utils/responsive";
import { get, isEmpty } from "lodash-es";
import Loader from "components/common/Loader/Loader";
import {
  CollaboratorT,
  CollectionHotspotT,
  CollectionItemT,
  HotspotT,
} from "../../../../constants/types";
import ExploreTags from "../../common/ExploreTags/ExploreTags";

interface State {
  commonAreaIsInViewport: boolean;
  mode: string;
  display: string;
  items: CollectionItemT[];
  person: CollaboratorT[];
}

type Props = RouteComponentProps;

class Collection extends React.Component<Props, State> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;
  hotspots: HotspotT[];
  collectionMaterials: any[];
  collectionItems: CollectionItemT[];
  collection: any;
  hpTags: [];

  uploadPhoto = () => {
    this.context.openModal(Modals.UploadPhoto);
  };

  constructor(props) {
    super(props);
    this.state = {
      commonAreaIsInViewport: false,
      mode: "image",
      display: "everything",
      items: [],
      person: null,
    };
  }

  commonAreaIsInViewport = () => {
    const commonArea = document.querySelector(".commonArea");
    const footer = document.querySelector(".footerArea");
    if (commonArea && footer) {
      const bounding = commonArea.getBoundingClientRect();
      const footerBound = footer.getBoundingClientRect();
      return (
        bounding.bottom + footerBound.bottom < 0 ||
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

  async componentDidMount() {
    await this.gatherMaterialsAndTags();
    window.scrollTo(0, 0);
    window.addEventListener("scroll", this.scrollingBehaviour);
    // TODO: Figure out why this is needed. I suspect images are not loaded fully when this runs.
    window.setTimeout(() => {
      this.scrollingBehaviour();
    }, 100);

    const collectionId = parseInt(
      get(this.props.match, "params.collection_id", "")
    );
    if (collectionId) {
      this.context.requestCollection(collectionId);
    }
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
        access: "write",
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
        access: "write",
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
        access: "read",
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
        access: "read",
      },
    ];
    this.context.storeCollaborators(collaborators);
    this.setState({ person: collaborators });
    this.forceUpdate();
  }

  gatherMaterialsAndTags = async () => {
    let hpMaterials = [];
    this.hotspots = [];
    this.hpTags = [];
    this.collection = this.getCollection();
    this.collectionItems = get(this.collection, "items", []);
    this.collectionMaterials = this.collectionItems
      .filter((item) => item.objectType === "material")
      .map((item) => item.material.sku);
    const hotspotsIds = this.collectionItems
      .filter((hp) => hp.objectType === "hotspot")
      .map((hp) => hp.hotspot.id);
    for (const hpId of hotspotsIds) {
      await this.context
        .requestHotspot(hpId)
        .then((hp: any) => this.hotspots.push(hp));
    }
    this.hotspots.forEach((hotspot) => {
      if (hotspot.markers && hotspot.markers.length > 0) {
        hotspot.markers.forEach((marker) => hpMaterials.push(marker.sku));
      }
      if (hotspot.tags && hotspot.tags.length > 0) {
        hotspot.tags.forEach((tag) => this.hpTags.push(tag));
        this.hpTags = this.hpTags.reduce(function (acc, value) {
          if (acc.indexOf(value) < 0) acc.push(value);
          return acc;
        }, []);
      }
    });
    if (hpMaterials.length > 0) {
      this.collectionMaterials.push(hpMaterials);
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollingBehaviour);
  }

  getCollection() {
    // TODO: Figure out why the collectionId filter doesn't work on the collections() query
    const collectionId = parseInt(
      get(this.props.match, "params.collection_id", "")
    );
    const contextCollection = this.context.collection;
    const contextCollections = this.context.collections;
    if (collectionId !== contextCollection.id) {
      return contextCollections.find((col) => col.id === collectionId) || {};
    }
    return contextCollection || {};
  }

  render() {
    if (!this.collection) {
      return (
        <React.Fragment>
          <NavLink className={styles.yourCollections} to={COLLECTIONS_URL}>
            Your Collections
            <i className={"fas fa-chevron-right"} />
          </NavLink>
          <Loader
            containerClassName={styles.loaderContainer}
            loaderClassName={styles.loader}
          />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <NavLink className={styles.yourCollections} to={COLLECTIONS_URL}>
          Your Collections
          <i className={"fas fa-chevron-right"} />
        </NavLink>
        <CollectionsToolbar
          title={this.collection.name || "collection.name"}
          isCollection
          filter
          buttons={[
            "everything",
            "materials",
            "your uploads",
            "rooms",
            "palettes",
          ]}
          collaborators={this.state.person}
          activeButtonDisplay={this.state.display}
          toggleDisplay={this.toggleDisplay}
          activeButtonMode={this.state.mode}
          toggleMode={this.toggleMode}
        />
        <div
          style={{ position: "relative" }}
          className={!this.collectionItems.length ? styles.emptyCollection : ""}
        >
          {this.collectionItems.length > 0 && (
            <div className={styles.masonryWrapper}>
              <ResponsiveMasonry
                columnsCountBreakPoints={{
                  350: 1,
                  400: 2,
                  650: 3,
                  920: 4,
                  1080: 4,
                }}
              >
                <Masonry columnsCount={4} gutter="20px">
                  <UploadCard
                    caption={
                      !isOnMobile()
                        ? "Upload a photo or drag & drop here "
                        : "Upload a photo"
                    }
                    onClick={this.uploadPhoto}
                  />
                  {this.collectionItems
                    .filter(
                      (item) =>
                        this.state.display.includes(item.objectType) ||
                        (item.json &&
                          this.state.display.includes(
                            JSON.parse(item.json).type
                          )) ||
                        this.state.display === "everything"
                    )
                    .map((item: any, index: number) => {
                      return (
                        <ItemCard
                          key={item.id}
                          mode={this.state.mode}
                          item={item}
                        />
                      );
                    })}
                </Masonry>
              </ResponsiveMasonry>
              {/*<AddToCartButton*/}
              {/*  commonAreaIsInViewport={this.state.commonAreaIsInViewport}*/}
              {/*/>*/}
            </div>
          )}
          {this.collectionItems.length < 1 && (
            <React.Fragment>
              <UploadCard
                caption={
                  !isOnMobile()
                    ? "Upload a photo or drag & drop here "
                    : "Upload a photo"
                }
                onClick={this.uploadPhoto}
              />
              <div className={styles.empty}>
                You have not added anything to this collection yet!
              </div>
            </React.Fragment>
          )}
        </div>

        {/*The commonArea element is added here in order to keep the AddToCart Button inside the Collection Cards container, also decide its position*/}
        {this.collectionMaterials.length > 0 && (
          <div className={"commonArea"}>
            <MoreIdeas collectionMaterials={this.collectionMaterials} />
          </div>
        )}
        {this.hpTags.length > 0 && <ExploreTags buttons={this.hpTags} />}
      </React.Fragment>
    );
  }
}

export default withRouter(Collection);
