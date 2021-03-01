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
    "/collections",
    createProxyMiddleware({
      target: "https://mb-collections.f3labs.com",
      changeOrigin: true,
      pathRewrite: { "^/collections": "" },
    })
  );
};
