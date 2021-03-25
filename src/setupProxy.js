const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/magento",
    createProxyMiddleware({
      target: "https://dev.design.shop",
      changeOrigin: true,
      pathRewrite: { "^/magento": "" },
    })
  );
  app.use(
    "/collections-api",
    createProxyMiddleware({
      target: "https://dev-collections.design.shop",
      changeOrigin: true,
      pathRewrite: { "^/collections-api": "" },
    })
  );
};
