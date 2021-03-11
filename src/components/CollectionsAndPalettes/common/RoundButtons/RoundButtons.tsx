import * as React from "react";
import cn from "classnames";

interface Props {
  buttons: string[];
  selectedButton: string;
  onButtonSelected: Function;
  buttonClassName?: string;
  activeButtonClassName?: string;
  onClick?: Function;
}

//TODO create another component for filter round buttons
export default class RoundButtons extends React.Component<Props, any> {
  switchDisplay(e, index, button) {
    this.props.onButtonSelected(button);
  }

  renderButton(index, button, buttonStyling) {
    return (
      <div
        onClick={(e) => {
          this.switchDisplay(e, index, button);
          this.props.onClick(button);
        }}
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

    return (
      <React.Fragment>
        {this.props.buttons.map((button: any, index: number) =>
          this.renderButton(index, button, buttonStyling)
        )}
      </React.Fragment>
    );
  }
}
