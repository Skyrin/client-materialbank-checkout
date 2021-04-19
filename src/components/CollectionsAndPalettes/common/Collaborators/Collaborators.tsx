import * as React from "react";
import styles from ".//Collaborators.module.scss";
import cn from "classnames";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../../context/AppContext";
import { CollectionCollaboratorT } from "constants/types";

interface Props {
  collaborators: CollectionCollaboratorT[];
  small?: boolean;
}

export default class Collaborators extends React.Component<Props, any> {
  maxNoCollaborators: number;
  numberToShow: number;
  static contextType = AppContext;
  context!: AppContextState;
  modalTarget = null;

  shareCollection = () => {
    this.context.openModal(Modals.ShareCollection);
  };

  render() {
    if (this.props.small) {
      this.maxNoCollaborators = 3;
    } else {
      this.maxNoCollaborators = 4;
    }
    this.numberToShow =
      this.props.collaborators.length - this.maxNoCollaborators;

    return (
      <React.Fragment>
        {this.props.collaborators && (
          <div
            className={cn(
              styles.collaborators,
              this.props.small ? styles.small : ""
            )}
          >
            {this.props.collaborators
              .slice(0, this.maxNoCollaborators)
              .map((collaborator) => {
                if (collaborator.profileImage) {
                  return (
                    <img
                      key={`collaborator_${collaborator.userId}`}
                      src={collaborator.profileImage}
                      alt=""
                    />
                  );
                } else {
                  return (
                    <div
                      className={styles.userInitials}
                      key={`collaborator_${collaborator.userId}`}
                    >
                      {`${collaborator.firstName
                        .charAt(0)
                        .toUpperCase()}${collaborator.lastName
                        .charAt(0)
                        .toUpperCase()}`}
                    </div>
                  );
                }
              })}
            {this.props.collaborators.length - this.maxNoCollaborators > 0 && (
              <span className={styles.numberToShow}>+{this.numberToShow}</span>
            )}
            <span onClick={this.shareCollection}>
              <i className="fas fa-share contributors-share"></i>
            </span>
          </div>
        )}
      </React.Fragment>
    );
  }
}
