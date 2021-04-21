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
import { get } from "lodash-es";
import Loader from "components/common/Loader/Loader";
import { HotspotT } from "../../../../constants/types";
import ExploreTags from "../../common/ExploreTags/ExploreTags";

interface State {
  commonAreaIsInViewport: boolean;
  mode: string;
  display: string;
  hotspots: HotspotT[];
  collectionMaterials: string[];
  hpTags: string[];
}

type Props = RouteComponentProps;

class Collection extends React.Component<Props, State> {
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
      hotspots: [],
      collectionMaterials: [],
      hpTags: [],
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
    const collectionId = parseInt(
      get(this.props.match, "params.collection_id", "")
    );
    if (collectionId) {
      await this.context.requestCollection(collectionId);
    }
    await this.gatherMaterialsAndTags();
    window.scrollTo(0, 0);
    window.addEventListener("scroll", this.scrollingBehaviour);
    // TODO: Figure out why this is needed. I suspect images are not loaded fully when this runs.
    window.setTimeout(() => {
      this.scrollingBehaviour();
    }, 100);
  }

  gatherMaterialsAndTags = async () => {
    const materials = [];
    const hotspots = [];
    const hpTags = [];
    materials.concat(
      this.context.collectionItems
        .filter((item) => item.objectType === "material")
        .map((item) => item.material.sku)
    );
    const hotspotsIds = this.context.collectionItems
      .filter((hp) => hp.objectType === "hotspot")
      .map((hp) => hp.hotspot.id);
    for (const hpId of hotspotsIds) {
      await this.context
        .requestHotspot(hpId)
        .then((hp: any) => hotspots.push(hp));
      this.setState({ hotspots: hotspots });
    }
    this.state.hotspots.forEach((hotspot) => {
      if (hotspot.markers && hotspot.markers.length > 0) {
        hotspot.markers.forEach((marker) => materials.push(marker.sku));
      }
      if (hotspot.tags && hotspot.tags.length > 0) {
        hotspot.tags.forEach((tag) => hpTags.push(tag));
        this.setState({ hpTags: hpTags });
        this.setState({
          hpTags: this.state.hpTags.reduce(function (acc, value) {
            if (acc.indexOf(value) < 0) acc.push(value);
            return acc;
          }, []),
        });
      }
    });
    if (materials.length > 0) {
      this.setState({
        collectionMaterials: this.state.collectionMaterials.concat(materials),
      });
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
    if (!this.context.collection.id) {
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
          title={this.context.collection.name}
          isCollection
          filter
          buttons={[
            "everything",
            "materials",
            "your uploads",
            "rooms",
            "palettes",
          ]}
          collaborators={this.context.collection.collaborators}
          activeButtonDisplay={this.state.display}
          toggleDisplay={this.toggleDisplay}
          activeButtonMode={this.state.mode}
          toggleMode={this.toggleMode}
        />
        <div
          style={{ position: "relative" }}
          className={
            this.context.collectionItems.length < 1
              ? styles.emptyCollection
              : ""
          }
        >
          {this.context.collectionItems.length > 0 && (
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
                  {this.context.collectionItems
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
          {this.context.collectionItems.length < 1 && (
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
        {this.state.collectionMaterials.length > 0 && (
          <div className={"commonArea"}>
            <MoreIdeas collectionMaterials={this.state.collectionMaterials} />
          </div>
        )}
        {this.state.hpTags.length > 0 && (
          <ExploreTags buttons={this.state.hpTags} />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Collection);
