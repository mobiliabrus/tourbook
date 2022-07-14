import img from "./components/a-img";
import secret from "./components/a-secret";
import flight from "./components/a-flight";
import map from "./components/a-map";
import hotel from "./components/a-hotel";

if (!window.$docsify) {
  window.$docsify = {};
}

if (!window.$docsify.vueComponents) {
  window.$docsify.vueComponents = {
    "a-img": img,
    "a-secret": secret,
    "a-flight": flight,
    "a-map": map,
    "a-hotel": hotel,
  };
}

if (!Array.isArray(window.$docsify.plugins)) {
  window.$docsify.plugins = [];
}

window.$docsify.plugins.push(function (hook, vm) {
  hook.beforeEach(function (raw) {
    const reg = /`{3}<([^`]+)>\n([^`]+)`{3}/g;
    return raw.replace(reg, function (_, c, p) {
      let slot = "";
      let props = "";
      p.split(/\n/).forEach((q) => {
        const [prop, value] = q.trim().split(":");
        if (prop) {
          if (typeof value === "undefined") {
            slot = prop;
          } else {
            props += ` ${prop}="${value}"`;
          }
        }
      });
      return `<${c}${props}>${slot}</${c}>`;
    });
  });
});

export {};
