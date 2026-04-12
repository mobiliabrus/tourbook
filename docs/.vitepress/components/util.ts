export const htmlMinify = (html: string): string => {
  return html.replace(/\n/g, '');
};

export const debounce = <T extends (...args: any[]) => any>(fn: T, interval: number = 0): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), interval);
  };
};

export const base64ToFile = (base64: string): File => {
  const [mime, content] = base64.split(',');
  const binary = atob(content);
  let array: number[] = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  const fileData = new Blob([new Uint8Array(array)], { type: mime });
  return new File([fileData], `${new Date().getTime()}`, { type: mime });
};

export const getSecret = () => localStorage.getItem("lee6's-secret");
