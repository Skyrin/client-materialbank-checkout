export default class Address {
  id: string;
  nickname: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipcode: string;
  default: boolean = false;

  constructor(obj?: any) {
    this.id = obj?.id;
    this.nickname = obj?.nickname;
    this.firstName = obj?.firstName;
    this.lastName = obj?.lastName;
    this.addressLine1 = obj?.addressLine1;
    this.addressLine2 = obj?.addressLine2;
    this.city = obj?.city;
    this.state = obj?.state;
    this.zipcode = obj?.zipcode;
    this.default = obj?.default;
  }
}
