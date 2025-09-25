export const getFaviconFromUrl = (url) => {
  try {
    const domain = new URL(url).origin;
    return `${domain}/favicon.ico`;
  } catch (e) {
    return null;
  }
};
