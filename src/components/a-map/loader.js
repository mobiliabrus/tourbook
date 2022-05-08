let loader;

export function loadBingApi(key) {
  if (window.Microsoft) {
    return Promise.resolve();
  }

  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const callbackName = "bingAPIReady";
      let url = `https://www.bing.com/api/maps/mapcontrol?callback=${callbackName}&setLang=en`;
      if (key) {
        url += `&key=${key}`;
      }
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.defer = true;
      script.src = url;
      window.bingAPIReady = () => {
        Microsoft = window.Microsoft;
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  return loader;
}
