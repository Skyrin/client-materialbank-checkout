export default class OrderItem {
  product_sku: string;
  product_name: string;

  constructor(obj?: any) {
    this.product_sku = obj?.product_sku;
    this.product_name = obj?.product_name;
  }
}
