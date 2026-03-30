export const htmlMinify = (html) => {
  return html.replace(/\n/g, '');
};

export const debounce = (fn, interval = 0) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), interval);
  };
};

export const base64ToFile = (base64) => {
  const [mime, content] = base64.split(',');
  const binary = atob(content);
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  const fileData = new Blob([new Uint8Array(array)], { type: mime });
  return new File([fileData], `${new Date().getTime()}`, { type: mime });
};

export const getSecret = () => localStorage.getItem("lee6's-secret");
