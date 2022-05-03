import img from "./components/a-img";
import secret from "./components/a-secret";
import flight from "./components/a-flight";

if (!window.$docsify) {
  window.$docsify = {};
}

if (!window.$docsify.vueComponents) {
  window.$docsify.vueComponents = {
    "a-img": img,
    "a-secret": secret,
    "a-flight": flight,
  };
}

export {};
