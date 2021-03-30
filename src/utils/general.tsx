import { MAIN_SHOP_URL } from "constants/urls";

export const scrollToTop = () => {
  window.requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
};

export const parsePhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.startsWith("+1")) {
    return phoneNumber.substring(2, phoneNumber.length - 1);
  }
  return phoneNumber;
};

export const parseCurrency = (stringCurrency: string) => {
  switch (stringCurrency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "$";
  }
};

export const parsePrice = (stringPrice: string) => {
  let price = parseFloat(stringPrice);
  return price.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

export const getSamplePage = (sku: string) => {
  return `${MAIN_SHOP_URL}sample/${sku}`;
};
