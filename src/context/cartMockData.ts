export const CART_MOCK_DATA = {
  id: "testId",
  prices: {
    subtotal_including_tax: {
      value: 400,
    },
  },
  items: [
    {
      id: "1",
      product: {
        name: "Test Product 1",
        image: {
          url:
            "http://18.221.132.151/pub/static/version1605751353/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg",
        },
      },
      prices: {
        row_total_including_tax: {
          value: 100,
        },
      },
      quantity: 1,
    },
    {
      id: "2",
      product: {
        name: "Test Product 2",
        image: {
          url:
            "http://18.221.132.151/pub/static/version1605751353/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg",
        },
      },
      prices: {
        row_total_including_tax: {
          value: 200,
        },
      },
      quantity: 2,
    },
    {
      id: "3",
      product: {
        name: "Test Product 3",
        image: {
          url:
            "http://18.221.132.151/pub/static/version1605751353/frontend/Magento/luma/en_US/Magento_Catalog/images/product/placeholder/image.jpg",
        },
      },
      prices: {
        row_total_including_tax: {
          value: 100,
        },
      },
      quantity: 1,
    },
  ],
};