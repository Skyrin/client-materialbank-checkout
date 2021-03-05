import { algoliaProducts } from "algolia";
import { CachedProductT } from "constants/types";
import { get } from "lodash-es";

// Try to batch sku requests over 100ms so that we don't make individual requests for them
const BATCHING_DURATION = 100;

export class ProductsCache {
  productsFetchedCallback: Function;
  products: Map<string, CachedProductT>;

  // Will hold the skus for the products
  batchedSkus: string[] = [];

  isBatching = false;

  constructor(productsFetchedCallback: Function) {
    this.products = new Map<string, CachedProductT>();
    this.productsFetchedCallback = productsFetchedCallback;
  }

  // This function will always return sync, even if products have to be fetched
  getProduct = (sku: string) => {
    if (this.products.has(sku)) {
      return this.products.get(sku);
    }
    // Add the product to the cache as loading, and queue the algolia request to fetch it
    this.products.set(sku, {
      loading: true,
    });
    this.enqueueSku(sku);

    // Return the product (loading for now)
    return this.products.get(sku);
  };

  private enqueueSku(sku: stirng) {
    // If we're not currently batching skus, start batching for BATCHING_DURATION ms.
    this.batchedSkus.push(sku);
    if (!this.isBatching) {
      this.isBatching = true;
      window.setTimeout(() => {
        this.fetchProducts();
      }, BATCHING_DURATION);
    }
  }

  private async fetchProducts() {
    if (!this.batchedSkus || !this.batchedSkus.length) {
      console.log("No products to request");
    }

    const skuFilter = this.batchedSkus.map((sku) => `sku:${sku}`);
    console.log("FETCHING ALGOLIA PRODUCTS", skuFilter);
    const options = {
      facetFilters: [skuFilter, "type_id:simple"],
      hitsPerPage: this.batchedSkus.length,
    };
    console.log("ALGOLIA OPTIONS", options);
    const resp = await algoliaProducts.search("", options);
    console.log("RECEIVED ALGOLIA RESPONSE", resp);
    const products = get(resp, "hits", []);
    console.log("RECEIVED ALGOLIA PRODUCTS", products);
    products.forEach((product) => {
      this.products.set(product.sku, {
        loading: false,
        data: product,
      });
    });
    this.isBatching = false;
    this.productsFetchedCallback();
  }
}
