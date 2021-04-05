export const expirationDateInputParser = (value: string) => {
  if (value.match(/\/$/)) {
    return value.substr(0, 1);
  }
  return value.replaceAll(/[^0-9]/g, "").substr(0, 4);
};

export const expirationDateInputFormatter = (value: string) => {
  if (value && value.length >= 2) {
    return value.substr(0, 2) + " / " + value.substr(2, 2);
  }
  return value;
};

export const cardNumberInputParser = (value: string) => {
  const digitsOnly = value.replaceAll(/[^0-9]/g, "");
  if (value.match(/-$/)) {
    return digitsOnly.substr(0, digitsOnly.length - 1);
  }
  return digitsOnly.substr(0, 16);
};

export const cardNumberInputFormatter = (value: string) => {
  if (/^-?\d+$/.test(value)) {
    const groups = value.match(/.{1,4}/g) || [];
    if (groups.length < 4 && value.length % 4 === 0 && value.length > 0) {
      return groups.join(" - ") + " - ";
    }
    return groups.join(" - ");
  } else return (value = "");
};

export const digitsOnlyInputParser = (value: string) => {
  return value.replaceAll(/[^0-9]/g, "");
};
