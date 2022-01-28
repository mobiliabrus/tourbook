import aImg from "./components/a-img";
import aSecret from "./components/a-secret";

if (!window.$docsify) {
  window.$docsify = {};
}

if (!window.$docsify.vueComponents) {
  window.$docsify.vueComponents = {
    "a-img": aImg,
    "a-secret": aSecret,
  };
}

export {};
