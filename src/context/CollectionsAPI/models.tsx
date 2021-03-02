export type CollectionSortInput = {
  default?: "asc" | "desc";
  name?: "asc" | "desc";
  shared?: "asc" | "desc";
  updated?: "asc" | "desc";
};

export type CollectionsQueryInput = {
  limit: number;
  offset: number;
  slug?: string;
  collectionId?: number;
  searchName?: string;
  sort: CollectionSortInput;
};
