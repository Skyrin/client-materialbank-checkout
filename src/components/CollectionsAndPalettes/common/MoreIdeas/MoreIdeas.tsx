import * as React from "react";
import styles from "components/CollectionsAndPalettes/common/MoreIdeas/MoreIdeas.module.scss";
import cn from "classnames";
import ItemCard from "../ItemCard/ItemCard";
import RoundButtons from "../RoundButtons/RoundButtons";
import UploadCard from "../UploadCard/UploadCard";
import { isOnMobile } from "../../../../utils/responsive";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

type Props = {
  headerText?: string;
};

export default class MoreIdeas extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      maxCards: 8,
      mode: "info",
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
            url:
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
            url:
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
        {
          id: 5,
          collectionId: 56,
          position: 4,
          name: "sample",
          objectId: "4",
          objectType: "material",
          material: {
            sku: "100003120",
          },
          updatedBy: 92,
          createdOn: "createdon4",
          updatedOn: "updatedon4",
        },
        {
          id: 6,
          collectionId: 56,
          position: 4,
          name: "sample",
          objectId: "4",
          objectType: "material",
          material: {
            sku: "100095896",
          },
          updatedBy: 92,
          createdOn: "createdon4",
          updatedOn: "updatedon4",
        },
        {
          id: 7,
          collectionId: 56,
          position: 4,
          name: "sample",
          objectId: "4",
          objectType: "material",
          material: {
            sku: "100305823",
          },
          updatedBy: 92,
          createdOn: "createdon4",
          updatedOn: "updatedon4",
        },
        {
          id: 8,
          collectionId: 56,
          position: 4,
          name: "sample",
          objectId: "4",
          objectType: "material",
          material: {
            sku: "100253513",
          },
          updatedBy: 92,
          createdOn: "createdon4",
          updatedOn: "updatedon4",
        },
        {
          id: 9,
          collectionId: 56,
          position: 4,
          name: "sample",
          objectId: "4",
          objectType: "material",
          material: {
            sku: "100305223",
          },
          updatedBy: 92,
          createdOn: "createdon4",
          updatedOn: "updatedon4",
        },
      ],
    };
  }

  showMoreCards = () => {
    if (this.state.items) {
      this.setState({ maxCards: this.state.items.length });
    }
  };

  render() {
    const headerText =
      this.props.headerText || "More ideas for this collection";
    return (
      <div className={cn(styles.moreIdeasContainer)}>
        <div className={styles.ideasHeader}>{headerText}</div>
        <div className="horizontal-divider-toolbar extra-margin"></div>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 400: 2, 650: 3, 920: 4, 1080: 4 }}
        >
          <Masonry columnsCount={4} gutter="20px">
            {this.state.items
              .slice(0, this.state.maxCards)
              .map((item: any, index: number) => {
                return (
                  <ItemCard key={index} mode={this.state.mode} item={item} />
                );
              })}
          </Masonry>
        </ResponsiveMasonry>
        {this.state.items && this.state.items.length > this.state.maxCards && (
          <div className={styles.buttonContainer}>
            <RoundButtons
              buttons={[
                `Load ${this.state.items.length - this.state.maxCards} more`,
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
