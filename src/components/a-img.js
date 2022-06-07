import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

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
        fetch("//lee6.com/img/privacy/" + this.name + ".webp")
          .then((res) => res.arrayBuffer())
          .then((arrayBuffer) => {
            const encodedBase64 = arrayBufferToBase64(arrayBuffer);
            const bytes = AES.decrypt(encodedBase64, this.secretKey);
            const base64 = bytes.toString(Utf8);
            const url = `data:image/webp;base64,${base64}`;
            this.src = url;
          });
      }
    } else if (this.dir === "animation") {
      this.src = "//lee6.com/img/animation/" + this.name + ".webp";
    } else {
      this.src = "//lee6.com/img/public/" + this.name + ".webp";
    }
  },
};
