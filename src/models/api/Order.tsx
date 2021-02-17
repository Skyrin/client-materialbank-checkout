import OrderItem from "models/api/OrderItem";

export default class Order {
  id: string;
  order_date: string;
  order_number: string;
  items: OrderItem[];

  constructor(obj?: any) {
    this.id = obj?.id;
    this.order_date = obj?.order_date;
    this.order_number = obj?.order_number;
    this.items = obj?.items.map((item) => new OrderItem(item));
  }
}
