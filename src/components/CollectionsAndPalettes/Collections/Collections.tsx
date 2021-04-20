import * as React from "react";
import styles from "components/CollectionsAndPalettes/Collections/Collections.module.scss";
import CollectionCard from "../common/CollectionCard/CollectionCard";
import { Link } from "react-router-dom";
import { COLLECTIONS_URL } from "../../../constants/urls";
import { AppContext, AppContextState, Modals } from "context/AppContext";
import UploadCard from "../common/UploadCard/UploadCard";
import Loader from "components/common/Loader/Loader";
import MoreIdeas from "../common/MoreIdeas/MoreIdeas";

export default class Collections extends React.Component<any, any> {
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  constructor(props) {
    super(props);
    this.state = {
      skus: [],
    };
  }

  createCollection = () => {
    this.context.openModal(Modals.CreateCollection);
  };

  async componentDidMount() {
    let hotspotsIds = [],
      materialSkus = [],
      hpMaterials = [],
      hotspotSkus = [],
      recommended = [];
    const collections = await this.context.requestCollections({
      limit: 100,
      offset: 0,
    });
    for (let collection of collections) {
      for (let item of collection.items) {
        if (item.objectType === "material") {
          materialSkus.push(item.material.sku);
        }
        if (item.objectType === "hotspot") {
          hotspotsIds.push(item.hotspot.id);
        }
      }
    }
    for (let hpId of hotspotsIds) {
      await this.context
        .requestHotspot(hpId)
        .then((hp: any) => hpMaterials.push(hp));
    }
    for (let hotspot of hpMaterials) {
      for (let marker of hotspot.markers) {
        hotspotSkus.push(marker.sku);
      }
      if (materialSkus.length > 0) {
        recommended = hotspotSkus.concat(materialSkus);
      }
      this.setState({ skus: recommended });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.cardCollection}>
          {this.context.collectionsLoading ? (
            <Loader
              containerClassName={styles.loaderContainer}
              loaderClassName={styles.loader}
            />
          ) : (
            <React.Fragment>
              <UploadCard
                caption={"Create a Collection"}
                icon={"far fa-plus"}
                onClick={this.createCollection}
              />
              {this.context.collections.map((collection) => {
                return (
                  <Link
                    to={COLLECTIONS_URL + `/${collection.id}`}
                    key={`collection_${collection.id}`}
                  >
                    <CollectionCard collection={collection} />
                  </Link>
                );
              })}
            </React.Fragment>
          )}
        </div>
        {this.state.skus.length > 0 && (
          <MoreIdeas
            collectionMaterials={this.state.skus}
            headerText="More ideas for you"
          />
        )}
      </React.Fragment>
    );
  }
}
