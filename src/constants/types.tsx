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
};

export type CartItemT = {
  id?: string;
  prices?: {
    price?: PriceT;
    row_total?: PriceT;
    row_total_including_tax?: PriceT;
  };
  product?: ProductT;
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

export type ShippingAddressT = AddressT & {};

export type RegionT = {
  code?: string;
  label?: string;
  region_id?: number;
};
