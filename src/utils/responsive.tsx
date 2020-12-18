export const MOBILE_WIDTH = 970;

var onMobile = window.innerWidth <= MOBILE_WIDTH;

const handleResize = (evt: any) => {
  if (window.innerWidth <= MOBILE_WIDTH) {
    onMobile = true;
  } else {
    onMobile = false;
  }
};

window.addEventListener("resize", handleResize);

export const isOnMobile = () => {
  return onMobile;
};
