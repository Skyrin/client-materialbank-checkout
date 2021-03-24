import * as React from "react";
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../../constants/urls";
import ItemCard from "../../common/ItemCard/ItemCard";
import CollectionsToolbar from "../../common/CollectionsToolbar/CollectionsToolbar";
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
import { isOnMobile } from "../../../../utils/responsive";
import { get } from "lodash-es";
import Loader from "components/common/Loader/Loader";
import { CollaboratorT, CollectionItemT } from "../../../../constants/types";

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

  uploadPhoto = () => {
    this.context.openModal(Modals.UploadPhoto);
  };

  constructor(props) {
    super(props);
    this.state = {
      commonAreaIsInViewport: false,
      mode: "image",
      display: "everything",
      items: [
        {
          id: 1,
          collectionId: 58,
          position: 1,
          name: "nume",
          objectId: "1",
          objectType: "upload",
          upload: {
            name: "some_name",
            s3Url:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5brHIzPOkAv7A4E5ul_mT5BaCRbykzf1xvA&usqp=CAU",
          },
          updatedBy: 92,
          createdOn: "createdon",
          updatedOn: "updatedon",
        },
        {
          id: 2,
          collectionId: 56,
          position: 2,
          name: "nume2",
          objectId: "2",
          objectType: "upload",
          upload: {
            name: "some_name2",
            s3Url:
              "https://www.mydomaine.com/thmb/MNBaDGmg4IW7tOvl3pxVNpqQ6uE=/2500x3049/filters:fill(auto,1)/DesignbyEmilyHendersonDesignandPhotobySaraLigorria-Tramp_654-b8122ec9f66b4c69a068859958d8db37.jpg",
          },
          updatedBy: 92,
          createdOn: "createdon2",
          updatedOn: "updatedon2",
        },
        {
          id: 3,
          collectionId: 56,
          position: 3,
          name: "material",
          objectId: "3",
          objectType: "material",
          material: {
            sku: "100306199",
          },
          updatedBy: 92,
          createdOn: "createdon3",
          updatedOn: "updatedon3",
        },
        {
          id: 4,
          collectionId: 56,
          position: 4,
          name: "sample",
          objectId: "4",
          objectType: "material",
          material: {
            sku: "100067327",
          },
          updatedBy: 92,
          createdOn: "createdon4",
          updatedOn: "updatedon4",
        },
      ],
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

  componentDidMount() {
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
    const collection = this.getCollection();
    const collectionItems = get(collection, "items", []);
    const finalItems = collectionItems.length
      ? collectionItems
      : this.state.items;
    if (!collection.id) {
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
          title={collection.name || "collection.name"}
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
            !finalItems.length ? styles.emptyCollection : ""
          )}
        >
          <UploadCard
            caption={
              !isOnMobile()
                ? "Upload a photo or drag & drop here "
                : "Upload a photo"
            }
            onClick={this.uploadPhoto}
          />
          {!finalItems.length && (
            <div className={styles.empty}>
              You have not added anything to this collection yet!
            </div>
          )}
          {finalItems.map((item: any, index: number) => {
            return <ItemCard key={index} mode={this.state.mode} item={item} />;
          })}
          {finalItems.length && (
            <AddToCartButton
              commonAreaIsInViewport={this.state.commonAreaIsInViewport}
            />
          )}
        </div>
        {/*The commonArea element is added here in order to keep the AddToCart Button inside the Collection Cards container, also decide its position*/}
        <div className={"commonArea"}>
          <MoreIdeas />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Collection);
