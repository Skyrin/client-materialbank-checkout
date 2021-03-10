import algoliasearch from "algoliasearch";

export const algoliaClient = algoliasearch(
  process.env.ALGOLIA_ID || "D5QFQNMF1C",
  process.env.ALGOLIA_KEY || "2c2f5727fdeb1a428249dcb02dff6572"
);

export const algoliaProducts = algoliaClient.initIndex(
  "magento2_default_products"
);
