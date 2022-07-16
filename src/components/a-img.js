import CryptoJS from "crypto-js";

const template = `<div>
<img :src="visible && src" alt="" />
<div v-if="!visible || !src" style="width:100%;height:45vw;background:#ddd"></div>
</div>`;

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
    if (this.dir === "privacy") {
      if (this.secretKey) {
        const name = this.suffer ? [this.name.split(".")[0], this.suffer, "webp"].join(".") : this.name;
        fetch("https://lee6.com/img/privacy/" + name)
          .then((res) => res.text())
          .then((text) => {
            const bytes = CryptoJS.AES.decrypt(text, this.secretKey);
            const base64 = bytes.toString(CryptoJS.enc.Utf8);
            this.src = base64.toString();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } else if (this.dir === "animation") {
      this.src = "https://lee6.com/img/animation/" + [this.name, this.suffer, "gif"].join(".");
    } else {
      this.src = "https://lee6.com/img/public/" + [this.name, this.suffer, "webp"].join(".");
    }
  },
};
