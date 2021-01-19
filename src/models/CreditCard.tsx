export default class CreditCard {
  number: string;
  name: string;
  expiration: string;
  cvv: string;

  constructor(obj?: any) {
    this.number = obj?.number;
    this.name = obj?.name;
    this.expiration = obj?.expiration;
    this.cvv = obj?.cvv;
  }
}
