// TODO: Update this
// Fields are marked as optional so that we can work with partial objects
export type CartT = {
  id?: string;
  items?: CartItemT[];
  prices?: {
    grand_total?: PriceT;
    subtotal_including_tax?: PriceT;
  };
  billing_address?: BilingAddressT;
  shipping_addresses?: ShippingAddressT[]; // Why multiple? ¯\_(ツ)_/¯
  email?: string;
  available_payment_methods?: PaymentMethodT;
  selected_payment_method?: SelectedPaymentMethodT;
  applied_coupons?: CouponT;
};

export type CartItemT = {
  id?: string;
  prices?: {
    price?: PriceT;
    row_total?: PriceT;
    row_total_including_tax?: PriceT;
  };
  product?: ProductT;
  quantity?: number;
};

export type PriceT = {
  currency?: string;
  value?: number;
};

export type ProductT = {
  id?: string;
  sku?: string;
  name?: string;
  image?: {
    url?: string;
  };
};

export type AddressT = {
  city?: string;
  company?: string;
  firstname?: string;
  lastname?: string;
  postcode?: string;
  street?: string[]; // Probably [address_line_1, address_line_2]. in our case, we should probably just do [address]. TODO: clarify this
  telephone?: string;
  region?: RegionT;
};

export type BilingAddressT = AddressT;

export type ShippingAddressT = AddressT & {
  available_shipping_methods?: ShippingMethodT[];
  selected_shipping_method?: ShippingMethodT;
};

export type RegionT = {
  code?: string;
  label?: string;
  region_id?: number;
};

export type PaymentMethodT = {
  code?: string;
  title?: string;
};

export type SelectedPaymentMethodT = PaymentMethodT & {
  purchase_order_number?: string;
};

export type ShippingMethodT = {
  amount?: PriceT;
  available?: boolean;
  carrier_code?: string;
  carrier_title?: string;
  price_incl_tax?: PriceT;
  method_code?: string;
  method_title?: string;
};

export type CouponT = {
  code?: string;
};
