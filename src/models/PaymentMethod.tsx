export default class PaymentMethod {
  id: string;
  creditCard: any;
  isDefault: boolean = false;
  isOpen: boolean = false;

  constructor(obj?) {
    this.id = obj?.id;
    this.creditCard = obj?.creditCard;
    this.isDefault = obj?.isDefault;
  }
}
