import crypto from "./crypto.js";
import modal from "./a-modal";

const template = `<a-modal :scale="scale">
<template v-slot:action>
  <div @click="loadHD" v-if="!src" style="display:inline-block;color:#fff;height:32px;padding:4px 15px;font-size:14px;border-radius:2px;border:1px solid #fff;box-shadow:0 2px #00000004;">HD</div>
</template>
<template v-slot:popover>
  <img :src="visible && (src || srcMin)" alt="" style="position:absolute;top:0;bottom:0;right:0;left:0;margin:auto;" />
</template>
<template v-slot:default>
  <img :src="visible && (src || srcMin)" alt="" @load="onImageLoad" />
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
      scale: undefined,
      secretKey,
      visible: !(this.dir === "assert" && !secretKey),
    };
  },
  mounted() {
    this.load("min", "srcMin");
  },
  methods: {
    onImageLoad(e) {
      const img = e.target;
      this.scale = window.innerHeight / img.offsetHeight;
    },
    loadHD() {
      this.load("", 'src')
    },
    load(suffer = "", t = "src") {
      if (this.dir === "privacy") {
        if (this.secretKey) {
          const name = suffer ? [this.name.split(".")[0], suffer, "webp"].join(".") : this.name;
          fetch("https://lee6.com/img/privacy/" + name)
            .then((res) => res.text())
            .then((content) => {
              this[t] = crypto(content, this.secretKey, "decrypt");
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
