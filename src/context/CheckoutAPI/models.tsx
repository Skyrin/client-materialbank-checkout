export class CartAddressInput {
  city: string;
  company: string;
  country_code: string;
  firstname: string;
  lastname: string;
  postcode: string;
  region: string;
  telephone: string;
  street: string[];

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
    telephone: undefined,
    street: undefined,
  };

  constructor(obj?: any) {
    this.city = obj?.city || CartAddressInput.defaults.city;
    this.company = obj?.company || CartAddressInput.defaults.company;
    this.country_code =
      obj?.country_code || CartAddressInput.defaults.country_code;
    this.firstname =
      obj?.firstname || obj?.firstName || CartAddressInput.defaults.firstname;
    this.lastname =
      obj?.lastname || obj?.lastName || CartAddressInput.defaults.lastname;
    this.postcode =
      obj?.postcode || obj?.zipCode || CartAddressInput.defaults.postcode;
    this.region =
      obj?.region || obj?.region_id || CartAddressInput.defaults.region_id;
    this.telephone =
      obj?.telephone || obj?.phone || CartAddressInput.defaults.telephone;
    this.street = [obj?.address];
    if (obj?.aptNumber) {
      this.street.push(obj?.aptNumber);
    }
  }
}
