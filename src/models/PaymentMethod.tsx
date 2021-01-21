import CreditCard from "models/CreditCard";

export default class PaymentMethod {
  id: string;
  creditCard: CreditCard;
  isDefault: boolean = false;
  isOpen: boolean = false;

  constructor(obj?) {
    this.id = obj?.id;
    this.creditCard = new CreditCard(obj?.creditCard);
    this.isDefault = obj?.isDefault;
  }
}
