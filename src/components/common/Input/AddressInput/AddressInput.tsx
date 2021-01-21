import * as React from "react";
import Input from "../Input";
import cn from "classnames";
import { debounce } from "lodash-es";
import styles from "./AddressInput.module.scss";

type Props = {
  initialValue?: string;
  placeholder?: string;
  componentRef?: Function;
};

type Suggestion = {
  text: string;
  placeId: string;
};

type State = {
  inputValue: string;
  suggestions: Suggestion[];
};

declare var google;

export default class AddressInput extends React.Component<Props, State> {
  autocompleteService!: google.maps.places.AutocompleteService;
  geocoder!: google.maps.Geocoder;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.initialValue || "",
      suggestions: [],
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
    this.debouncedFetchSuggestions();
  };

  // To be used from the outside through componentRef
  updateValue = (newVal: string) => {
    console.log("UPDATE VALUE", newVal);
  };

  fetchSuggestions = () => {
    const input = this.state.inputValue;
    console.log("SHOULD FETCH", input);
    this.setState({
      suggestions: [
        {
          text: "Suggestion 1",
          placeId: "1234",
        },
        {
          text: "Suggestion 2",
          placeId: "2345",
        },
      ],
    });
  };

  debouncedFetchSuggestions = debounce(this.fetchSuggestions, 400);

  render() {
    return (
      <div className={styles.addressInputWrapper}>
        <Input
          className={cn({
            [styles.hasSuggestions]: this.state.suggestions.length > 0,
          })}
          value={this.state.inputValue}
          onChange={(newVal) => this.handleChange(newVal)}
          placeholder={this.props.placeholder || "Address"}
        />
        {this.state.suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {this.state.suggestions.map((s) => (
              <div className={styles.suggestion} key={s.placeId}>
                {s.text}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
