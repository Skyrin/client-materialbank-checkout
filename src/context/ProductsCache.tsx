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

  fetchCallbacks: Function[] = [];

  constructor(productsFetchedCallback: Function) {
    this.products = new Map<string, CachedProductT>();
    this.productsFetchedCallback = productsFetchedCallback;
  }

  // This function will always return sync, even if products have to be fetched
  getProduct = (sku: string) => {
    if (this.products.has(sku)) {
      return this.products.get(sku);
    }
    console.log(
      "[PRODUCT CACHE] ENTERED GET PRODUCT WITH:",
      sku,
      ", WAS NOT IN CACHE"
    );
    this.enqueueSku(sku);

    // Return the product (loading for now)
    return this.products.get(sku);
  };

  // This function will only return when the products have been fetched
  getProductsAsync = async (skus: string[]) => {
    console.log("[PRODUCT CACHE] ENTERED GET ASYNC WITH:", skus);
    const missingSkus = skus.filter(
      (sku) => !this.products.has(sku) || !this.products.get(sku).data
    );
    if (!missingSkus.length) {
      return skus.map((sku) => this.products.get(sku));
    }
    const productsFetchedPromise = new Promise((resolve, reject) => {
      this.enqueueSkus(missingSkus, resolve);
    });
    await productsFetchedPromise;

    return skus.map((sku) => this.products.get(sku));
  };

  enqueueSkus = (skus: string[], callback?: Function) => {
    // If we're not currently batching skus, start batching for BATCHING_DURATION ms.
    const newSkus = skus.filter(
      (sku) => !this.batchedSkus.includes(sku) && !this.products.has(sku)
    );
    this.batchedSkus.push(...newSkus);
    if (callback) {
      this.fetchCallbacks.push(callback);
    }
    // Add objects to cache so we know they are supposed to be loading
    newSkus.forEach((sku) => {
      this.products.set(sku, {
        loading: true,
      });
    });
    if (!this.isBatching) {
      this.isBatching = true;
      console.log("[PRODUCT CACHE] STARTED BATCHING PROCESS");
      window.setTimeout(() => {
        this.fetchProducts();
      }, BATCHING_DURATION);
    }
  };

  enqueueSku = (sku: string, callback?: Function) => {
    this.enqueueSkus([sku], callback);
  };

  fetchProducts = async () => {
    if (!this.batchedSkus || !this.batchedSkus.length) {
      console.log("No products to request");
    }

    const skuFilter = this.batchedSkus.map((sku) => `sku:${sku}`);
    console.log("[PRODUCT CACHE] FETCHING ALGOLIA PRODUCTS", skuFilter);
    const options = {
      facetFilters: [skuFilter, "type_id:simple"],
      hitsPerPage: this.batchedSkus.length,
    };
    console.log("[PRODUCT CACHE] ALGOLIA OPTIONS", options);
    const resp = await algoliaProducts.search("", options);
    console.log("[PRODUCT CACHE] RECEIVED ALGOLIA RESPONSE", resp);
    const products = get(resp, "hits", []);
    console.log("[PRODUCT CACHE] RECEIVED ALGOLIA PRODUCTS", products);
    products.forEach((product) => {
      this.products.set(product.sku, {
        loading: false,
        data: product,
      });
    });
    console.log("[PRODUCT CACHE] CALLING FETCH CALLBACKS");
    this.fetchCallbacks.forEach((callback) => callback());
    this.fetchCallbacks = [];
    this.productsFetchedCallback();
    this.isBatching = false;
    this.batchedSkus = [];
  };
}
