import * as React from "react";
import Input from "../Input";

type Props = {
  initialValue?: string;
  placeholder?: string;
  componentRef?: Function;
};

type State = {
  inputValue: string;
};

declare var google;

export default class AddressInput extends React.Component<Props, State> {
  autocompleteService!: google.maps.places.AutocompleteService;
  geocoder!: google.maps.Geocoder;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.initialValue || "",
    };
  }

  componentDidMount() {
    this.props.componentRef && this.props.componentRef(this);
    if (typeof google !== "undefined") {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.geocoder = new google.maps.Geocoder();
    } else {
      const waitingForGoogle = window.setInterval(() => {
        if (google) {
          this.autocompleteService = new google.maps.places.AutocompleteService();
          this.geocoder = new google.maps.Geocoder();
          window.clearInterval(waitingForGoogle);
        }
      }, 100);
    }
    // service.getPlacePredictions({
    //   input: 'hel',
    //   componentRestrictions: {
    //     country: 'us',
    //   }
    // }, (predictions, status) => {
    //   if (status !== google.maps.places.PlacesServiceStatus.OK) {
    //     return;
    //   }
    //   console.log(predictions);
    //   geocoder.geocode({ placeId: predictions[0].place_id }, (results, status) => {
    //     console.log('GEOCODED', results, status);
    //   })
    // })
  }

  handleChange = (newVal: string) => {
    console.log("ADDRESS CHANGED", newVal);
    this.setState({
      inputValue: newVal,
    });
  };

  // To be used from the outside through componentRef
  updateValue = (newVal: string) => {
    console.log("UPDATE VALUE", newVal);
  };

  render() {
    return (
      <Input
        value={this.state.inputValue}
        onChange={(newVal) => this.handleChange(newVal)}
        placeholder={this.props.placeholder || "Address"}
      />
    );
  }
}
