import aImg from "./components/a-img";

if (!window.$docsify) {
  window.$docsify = {};
}

if (!window.$docsify.vueComponents) {
  window.$docsify.vueComponents = {
    "a-img": aImg,
  };
}

export {};
