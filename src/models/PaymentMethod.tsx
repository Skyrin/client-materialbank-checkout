import CreditCard from "./CreditCard";

export default class PaymentMethod {
  id: string;
  creditCard: any;
  isDefault: boolean = false;
  isOpen?: boolean = false;

  constructor(obj?) {
    this.id = obj?.id;
    this.creditCard = new CreditCard(obj?.creditCard);
    this.isDefault = obj?.isDefault;
    this.isOpen = obj?.isOpen;
  }
}
