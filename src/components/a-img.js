import CryptoJS from "crypto-js";
import modal from "./a-modal";

const template = `<a-modal @popover="this.popover">
<template v-slot:popover>
  <img :src="visible && src" alt="" style="position:absolute;top:0;bottom:0;right:0;left:0;margin:auto;" />
</template>
<template v-slot:default>
  <img :src="visible && (src || srcMin)" alt="" />
  <div v-if="!visible || (!src && !srcMin)" style="width:100%;height:45vw;background:#ddd"></div>
</template>
</a-modal>`;

export default {
  template,
  props: {
    name: {
      type: String,
      required: true,
    },
    dir: {
      type: String,
      default: "public",
    },
  },
  data: function () {
    const secretKey = localStorage.getItem("lee6's-secret");
    return {
      src: undefined,
      srcMin: undefined,
      secretKey,
      visible: !(this.dir === "assert" && !secretKey),
    };
  },
  computed: {
    suffer: function () {
      const isMobile = window.innerWidth < 768;
      return isMobile ? "min" : "";
    },
  },
  mounted() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      this.load("min", "srcMin");
    } else {
      this.load();
    }
  },
  methods: {
    popover() {
      if (!this.src) {
        this.load();
      }
    },
    load(suffer = "", t = "src") {
      if (this.dir === "privacy") {
        if (this.secretKey) {
          const name = suffer ? [this.name.split(".")[0], suffer, "webp"].join(".") : this.name;
          fetch("https://lee6.com/img/privacy/" + name)
            .then((res) => res.text())
            .then((text) => {
              const bytes = CryptoJS.AES.decrypt(text, this.secretKey);
              const base64 = bytes.toString(CryptoJS.enc.Utf8);
              this[t] = base64.toString();
            })
            .catch((err) => {
              console.error(err);
            });
        }
      } else if (this.dir === "animation") {
        this[t] = "https://lee6.com/img/animation/" + [this.name, suffer, "gif"].filter((_) => _).join(".");
      } else {
        this[t] = "https://lee6.com/img/public/" + [this.name, suffer, "webp"].filter((_) => _).join(".");
      }
    },
  },
  components: {
    "a-modal": modal,
  },
};
