// TODO: Update this
// Fields are marked as optional so that we can work with partial objects

export type CartT = {
  id?: string;
  items?: CartItemT[];
  prices?: {
    discounts?: DiscountT[];
    grand_total?: PriceT;
    subtotal_including_tax?: PriceT;
    subtotal_excluding_tax?: PriceT;
  };
  billing_address?: BilingAddressT;
  shipping_addresses?: ShippingAddressT[]; // Why multiple? ¯\_(ツ)_/¯
  email?: string;
  available_payment_methods?: PaymentMethodT;
  selected_payment_method?: SelectedPaymentMethodT;
  applied_coupons?: CouponT;
  estimated_shipping_cost?: number; // WARNING: This is a local field. It might not be present in all circumstances.
};

export type DiscountT = {
  amount?: PriceT;
  label?: string;
};

export type OrderT = {
  number?: string;
  increment_id?: number;
  order_date?: string;
  status?: string;
  billing_address?: OrderAddressT;
  shipping_address?: OrderAddressT;
  paymentMethods?: { type: string; name: string }[];
  payment?: any; // I'm not yet sure what could be here, so just leave it as any
  total?: {
    grand_total?: PriceT;
    subtotal?: PriceT;
    total_shipping?: PriceT;
    total_tax: PriceT;
  };
  items?: OrderItemT[];
};

export type OrderItemT = {
  product_sku: string;
  product_name: string;
  id: string;
  product_type: string;
  product_sale_price: PriceT;
  entered_options: OrderItemOptionT[];
  quantity_invoiced: number;
  quantity_ordered: number;
  status: string;
  selected_options: OrderItemOptionT[];
};

export type OrderItemOptionT = {
  label: string;
  value: string;
};

export type CartItemT = {
  id?: string;
  uid?: string;
  prices?: {
    price?: PriceT;
    row_total?: PriceT;
    row_total_including_tax?: PriceT;
  };
  product?: ProductT;
  quantity?: number;
  color?: string;
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
  id?: number;
  city?: string;
  company?: string;
  firstname?: string;
  lastname?: string;
  postcode?: string;
  street?: string[]; // Probably [address_line_1, address_line_2]. in our case, we should probably just do [address]. TODO: clarify this
  telephone?: string;
  region?: RegionT;
  default_billing?: boolean;
  default_shipping?: boolean;
};

export type OrderAddressT = {
  city?: string;
  company?: string;
  firstname?: string;
  lastname?: string;
  postcode?: string;
  region?: string;
  street?: string[];
  telephone?: string;
  country_code: string;
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
  region_code?: string;
};

export type PaymentMethodT = {
  code?: string;
  title?: string;
};

export type SelectedPaymentMethodT = PaymentMethodT & {
  purchase_order_number?: string;
  amount?: PriceT;
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

export type CustomerT = {
  firstname?: string;
  lastname?: string;
  email?: string;
  addresses?: AddressT[];
  default_shipping?: string;
  is_subscribed?: boolean;
  mobile?: string;
};

export type PaletteItemT = {
  id?: number;
  sku?: string;
  image?: string;
  metadata?: {
    imageSharedUrl?: string;
    imageUrl?: string;
  };
};

export type PaletteT = {
  id?: number;
  customerId?: number;
  name?: string;
  isShared?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  items?: PaletteItemT[];
  collaborators?: CollectionCollaboratorT[];
};

export type MaterialT = {
  sku?: string;
};

export type RoomT = {
  id?: number;
  // TODO: Figure out if there's going to be more fields here. Currently, this is all the API returns
};

export type CollectionUploadT = {
  id?: number;
  name?: string;
  fileName?: string;
  fileType?: string;
  blurhash?: string;
  url?: string;
  updatedBy?: string;
  createdOn?: string;
  updatedOn?: string;
};

export type CollectionHotspotT = {
  id: number;
  name: string;
  type: string;
};

export type HotspotT = {
  id?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  type?: "room" | "palette";
  color?: [];
  priceSign?: string;
  tags?: [];
  createdOn?: string;
  updatedOn?: string;
  markers?: MarkerT[];
};

export type MarkerT = {
  id?: number;
  hotspotId?: number;
  xCoord?: number;
  yCoord?: number;
  sku?: string;
  createdOn?: string;
  updatedOn?: string;
  related?: [];
};

export type CollectionItemT = {
  id?: number;
  collectionId?: number;
  position?: number;
  name?: string;
  objectId?: string;
  objectType?: string;
  json?: string;
  palette?: PaletteT;
  material?: MaterialT;
  room?: RoomT;
  upload?: CollectionUploadT;
  hotspot?: CollectionHotspotT;
  updatedBy?: number;
  createdOn?: string;
  updatedOn?: string;
};

export type CollectionCollaboratorT = {
  userId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
  access?: "read" | "write";
};

export type CollaboratorT = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  imagePath?: string;
  isAuthenticated?: boolean;
  isSharedWith?: boolean;
  access?: "read" | "write";
};

export type CollectionT = {
  id?: number;
  userId?: number;
  name?: string;
  isPublic?: boolean;
  createdOn?: string;
  updatedOn?: string;
  items?: CollectionItemT[];
  collaborators?: CollectionCollaboratorT[];
};

export type AlgoliaProductT = {
  sku?: string;
  name?: string;
  description?: string;
  color?: string;
  manufacturer?: string;
  price_sign?: string;
  image_url?: string;
  thumbnail_url?: string;
  price?: {
    USD?: {
      default?: number;
    };
  };
};

export type CachedProductT = {
  loading: boolean;
  data?: AlgoliaProductT;
};

export type StoredPaymentMethodT = {
  method?: string;
  fingerprint?: string;
  name?: string;
  type?: string;
  last4: string;
  expires?: string;
  cardType?: string;
  token?: string;
};
