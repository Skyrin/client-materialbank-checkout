export type OrderX = {
  address: AddressX[];
  createdAt: string;
  currency: string;
  id: string;
  masterOrderId: string;
  number: string;
  payment: PaymentX;
  products: ProductX[];
  shipment: ShipmentX;
  shipping: string;
  state: string;
  status: string;
  storeId: string;
  subtotal: string;
  tax: string;
  total: string;
  type: string;
};

export type PaymentX = {
  cardType: string;
  expires: string;
  last4: string;
  method: string;
  token: string;
  type: string;
};

export type AddressX = {
  city: string;
  company: string;
  country: string;
  firstname: string;
  id: string;
  lastname: string;
  phone: string;
  postalCode: string;
  state: string;
  street1: string;
  street2: string;
  type: string;
};

export type ShipmentX = {
  description: string;
  service: string;
  tracking: string;
};

export type ProductX = {
  category: string;
  color: string;
  commodityDescription: string;
  configurable_color: string;
  countryOfManufacture: string;
  discount: string;
  id: string;
  imageUrl: string;
  isInStock: boolean;
  isMarketing: boolean;
  isOnSale: boolean;
  isProp65: boolean;
  manufacturer: string;
  manufacturerSku: string;
  mbid: string;
  mediaGallery: string[];
  name: string;
  originalPrice: string;
  price: string;
  qtyInvoiced: string;
  qtyOrdered: string;
  qtyStock: string;
  size: boolean;
  sku: string;
  subcategory: string;
  subtotal: string;
  tax: string;
  thumbnailUrl: string;
  total: string;
  unitCost: number;
  unitOfMeasure: string;
};
