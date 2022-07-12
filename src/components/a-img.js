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
  mounted() {
    if (this.dir === "privacy") {
      if (this.secretKey) {
        fetch("//lee6.com/img/privacy/" + this.name)
          .then((res) => res.arrayBuffer())
          .then((arrayBuffer) => {
            const encodedBase64 = arrayBufferToBase64(arrayBuffer);
            const bytes = CryptoJS.AES.decrypt(encodedBase64, this.secretKey, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
            const base64 = bytes.toString(Utf8);
            this.src = base64;
          });
      }
    } else if (this.dir === "animation") {
      this.src = "//lee6.com/img/animation/" + this.name + ".gif";
    } else {
      this.src = "//lee6.com/img/public/" + this.name + ".webp";
    }
  },
};
