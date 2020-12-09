import * as yup from "yup";

export const extractErrors = (e: yup.ValidationError) => {
  const errors: any = {};
  e.inner.forEach((innerError: yup.ValidationError) => {
    const path = (innerError.path || "").toString();
    if (path) {
      errors[path] = innerError.errors[0];
    }
  });
  return errors;
};
