export const scrollToTop = () => {
  window.requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
};
