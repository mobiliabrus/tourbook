import CryptoJS from "crypto-js";

const template = `<img v-if="visible" :src="src" alt="" />`;

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const length = bytes.byteLength;
  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

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
      return isMobile ? ".min" : "";
    },
  },
  mounted() {
    if (this.dir === "privacy") {
      if (this.secretKey) {
        fetch("https://lee6.com/img/privacy/" + this.name)
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
      this.src = "https://lee6.com/img/animation/" + this.name + ".gif";
    } else {
      this.src = "https://lee6.com/img/public/" + this.name + this.suffer + ".webp";
    }
  },
};
