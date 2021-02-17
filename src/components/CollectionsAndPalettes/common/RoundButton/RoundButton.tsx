import * as React from "react";
import cn from "classnames";
import { AppContext, AppContextState } from "../../../../context/AppContext";
import { Link } from "react-router-dom";
import { COLLECTIONS_URL, PALETTES_URL } from "../../../../constants/urls";

interface Props {
  buttons: any;
  background?: string;
}

const activeButtons = {
  palettes: PALETTES_URL,
  collections: COLLECTIONS_URL,
};

export default class RoundButton extends React.Component<Props, any> {
  static contextType = AppContext;
  context!: AppContextState;

  render() {
    const activeButton = window.location.href.includes(COLLECTIONS_URL)
      ? "collections"
      : "palettes";
    let buttonStyling = {};
    this.props.buttons.forEach((button) => {
      buttonStyling[button] = `${this.props.background ? "grey" : ""} ${
        activeButton === button ? "active" : ""
      }`;
    });
    return (
      <React.Fragment>
        {this.props.buttons.map((button: any, index: number) => {
          return (
            <Link to={activeButtons[button]}>
              <div
                className={cn("button collection", buttonStyling[button])}
                key={index}
              >
                {button}
              </div>
            </Link>
          );
        })}
      </React.Fragment>
    );
  }
}
