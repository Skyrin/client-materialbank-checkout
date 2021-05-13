import algoliasearch from "algoliasearch";

export const algoliaClient = algoliasearch(
  process.env.ALGOLIA_ID || "D5QFQNMF1C",
  process.env.ALGOLIA_KEY || "2c2f5727fdeb1a428249dcb02dff6572"
);

export const algoliaProducts = algoliaClient.initIndex(
  process.env.ALGOLIA_INDEX_PRODUCTS || "dev-ds_default_products"
);

export const algoliaHotspots = algoliaClient.initIndex(
  process.env.ALGOLIA_INDEX_HOTSPOTS || "dev-ds_default_hotspots"
);
