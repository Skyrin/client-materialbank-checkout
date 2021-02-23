import * as React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import { COLLECTIONS_URL, PALETTES_URL } from "../../../../constants/urls";

interface Props {
  buttons: any;
  active?: string;
  background?: string;
  iconClass?: any;
  hasAnimation?: boolean;
  toggleMode?: any;
}

const activeButtonURLS = {
  palettes: PALETTES_URL,
  collections: COLLECTIONS_URL,
  image: COLLECTIONS_URL + "/image",
  info: COLLECTIONS_URL + "/info",
  edit: COLLECTIONS_URL + "/edit",
};

export default class RoundButton extends React.Component<Props, any> {
  activeButton: number;
  animate = null;
  animationDirection = null;

  constructor(props) {
    super(props);
    switch (this.props.active) {
      case "image": {
        this.activeButton = 0;
        break;
      }
      case "info": {
        this.activeButton = 1;
        break;
      }
      case "edit": {
        this.activeButton = 2;
        break;
      }
    }
  }

  toggleAnimation(e, index, button) {
    this.animate = "true";
    this.props.toggleMode(button);
    console.log(this.activeButton - index);
    if (this.activeButton - index == 2) {
      this.animationDirection = "animated-2steps-left";
    } else if (this.activeButton - index == -2) {
      this.animationDirection = "animated-2steps-right";
    } else if (this.activeButton > index) {
      this.animationDirection = "animated-left";
    } else if (this.activeButton < index) {
      this.animationDirection = "animated-right";
    } else {
      this.activeButton = null;
    }
    this.activeButton = index;
  }

  render() {
    const activeButton = window.location.href.includes(COLLECTIONS_URL)
      ? "collections"
      : "palettes";

    let buttonStyling = {};
    this.props.buttons.forEach((button) => {
      buttonStyling[button] = `${this.props.background ? "grey" : ""} 
      ${
        activeButton === button || this.props.active === button ? "active" : ""
      }`;
    });

    return (
      <React.Fragment>
        {this.props.buttons.map((button: any, index: number) => {
          return (
            <Link
              to={activeButtonURLS[button]}
              onClick={(e) => this.toggleAnimation(e, index, button)}
            >
              <div
                className={cn(
                  `${this.animationDirection}`,
                  "button collection",
                  buttonStyling[button]
                )}
                key={index}
              >
                {this.props.iconClass && (
                  <i className={this.props.iconClass[index]}></i>
                )}
                {button}
              </div>
            </Link>
          );
        })}
      </React.Fragment>
    );
  }
}
