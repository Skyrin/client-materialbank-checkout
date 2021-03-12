export const MOBILE_WIDTH = 970;

var onMobile = window.screen.width <= MOBILE_WIDTH;

const handleResize = (evt: any) => {
  if (window.screen.width <= MOBILE_WIDTH) {
    onMobile = true;
  } else {
    onMobile = false;
  }
};

window.addEventListener("resize", handleResize);

export const isOnMobile = () => {
  return onMobile;
};
