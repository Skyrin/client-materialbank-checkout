import { REGIONS } from "constants/regions";

export class CustomerAddressInput {
  id: string;
  city: string;
  company: string;
  country_code: string;
  firstname: string;
  lastname: string;
  postcode: string;
  region: {
    region_code?: string;
    region_id?: number;
  };
  telephone: string;
  street: string[];
  default_shipping: boolean;

  // TODO Clarify this: city, country_code, region_id are required on Backend but not present in Design.
  // TODO: Figure out zip-code resolution / address validations
  private static readonly defaults = {
    city: "New York",
    company: undefined,
    country_code: "US",
    firstname: undefined,
    lastname: undefined,
    postcode: undefined,
    region_id: 43,
    region_code: "NY",
    telephone: "123456",
    street: undefined,
  };

  constructor(obj?: any) {
    this.id = obj?.id;
    this.city = obj?.city || CustomerAddressInput.defaults.city;
    this.company = obj?.company || CustomerAddressInput.defaults.company;
    this.country_code =
      obj?.country_code || CustomerAddressInput.defaults.country_code;
    this.firstname =
      obj?.firstname ||
      obj?.firstName ||
      CustomerAddressInput.defaults.firstname;
    this.lastname =
      obj?.lastname || obj?.lastName || CustomerAddressInput.defaults.lastname;
    this.postcode =
      obj?.postcode || obj?.zipCode || CustomerAddressInput.defaults.postcode;
    this.region = {
      region_id: obj?.region
        ? REGIONS[obj?.region].id
        : CustomerAddressInput.defaults.region_id,
      region_code: obj?.region || CustomerAddressInput.defaults.region_code,
    };
    this.telephone =
      obj?.telephone || obj?.phone || CustomerAddressInput.defaults.telephone;
    this.street = [obj?.address];
    if (obj?.aptNumber) {
      this.street.push(obj?.aptNumber);
    }
    this.default_shipping = obj?.default_shipping;

    // TEMPORARY OVERRIDES SO THAT WE HAVE A VALID ADDRESS
    if (!obj?.region) {
      this.city = CustomerAddressInput.defaults.city;
      this.region.region_id = CustomerAddressInput.defaults.region_id;
      this.postcode = "10001";
    }
  }
}

export class CreateCustomerInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;

  constructor(obj?: any) {
    this.firstname = obj?.firstname;
    this.lastname = obj?.lastname;
    this.email = obj?.email;
    this.password = obj?.password;
  }
}

export class UpdateCustomerInput {
  firstname: string;
  lastname: string;
  email: string;
  is_subscribed: string;
  password: string;

  constructor(obj?: any) {
    this.firstname = obj?.firstname;
    this.lastname = obj?.lastname;
    this.email = obj?.email;
    this.is_subscribed = obj?.is_subscribed;
    this.password = obj?.password;
  }
}
