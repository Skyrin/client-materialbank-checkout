import * as React from "react";
import cn from "classnames";
import { COLLECTIONS_URL, PALETTES_URL } from "../../../../constants/urls";
import { Link } from "react-router-dom";

interface Props {
  buttons: string[];
  selectedButton: string;
  onButtonSelected: Function;
  buttonClassName?: string;
  activeButtonClassName?: string;
  onClick?: Function;
}

export default class RoundButtons extends React.Component<Props, any> {
  switchDisplay(e, index, button) {
    this.props.onButtonSelected(button);
  }

  renderExploreButtons(index, button, buttonStyling) {
    return (
      <div
        onClick={(e) => this.switchDisplay(e, index, button)}
        className={cn(
          "button collection ",
          buttonStyling[button],
          this.props.buttonClassName
        )}
        key={index}
      >
        {button}
      </div>
    );
  }

  render() {
    let buttonStyling = {};
    this.props.buttons.forEach((button) => {
      buttonStyling[button] = `${
        this.props.selectedButton === button
          ? this.props.activeButtonClassName
          : ""
      }`;
    });
    console.log(this.props.buttons);

    return (
      <React.Fragment>
        {["collections", "palettes"].includes(this.props.selectedButton)
          ? this.props.buttons.map((button: any, index: number) => {
              return (
                <Link
                  to={button === "collections" ? COLLECTIONS_URL : PALETTES_URL}
                >
                  {this.renderExploreButtons(index, button, buttonStyling)}
                </Link>
              );
            })
          : this.props.buttons.map((button: any, index: number) => {
              return (
                <React.Fragment>
                  {this.renderExploreButtons(index, button, buttonStyling)}
                </React.Fragment>
              );
            })}
      </React.Fragment>
    );
  }
}
