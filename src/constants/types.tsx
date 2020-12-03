// TODO: Update this
// Fields are marked as optional so that we can work with partial objects
export type CartT = {
  id?: string;
};

export type CartItemT = {
  itemId?: string;
  name?: string;
  qty?: number;
  price?: number;
  productType?: string;
};
