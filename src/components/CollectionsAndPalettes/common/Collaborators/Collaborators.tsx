import * as React from "react";
import styles from ".//Collaborators.module.scss";
import cn from "classnames";
import {
  AppContext,
  AppContextState,
  Modals,
} from "../../../../context/AppContext";

interface Props {
  collaborators: any;
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
            {this.props.collaborators.map(
              (collaborator: any, index: number) => {
                return (
                  <React.Fragment>
                    {this.props.collaborators.length <
                      this.maxNoCollaborators && (
                      <img src={this.props.collaborators[index]} />
                    )}
                    {this.props.collaborators.length >=
                      this.maxNoCollaborators &&
                      index < this.maxNoCollaborators && (
                        <img src={this.props.collaborators[index]} />
                      )}
                  </React.Fragment>
                );
              }
            )}
            {this.props.collaborators.length - this.maxNoCollaborators > 0 && (
              <a className={styles.numberToShow}>+{this.numberToShow}</a>
            )}
            <a onClick={this.shareCollection}>
              <i className="fas fa-share contributors-share"></i>
            </a>
          </div>
        )}
      </React.Fragment>
    );
  }
}
