const template = `<img v-if="visible" :src="src" alt="" />`;
const assert = "assert";

export default {
  template,
  props: {
    id: {
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
      secretKey,
      visible: !(this.dir === assert && !secretKey),
    };
  },
  computed: {
    src: function () {
      if (this.dir === assert) {
        if (this.secretKey) {
          fetch("//lee6.com/img/assert/" + this.id + ".json")
            .then((res) => res.json())
            .then((data) => {
              // const Cryptor = new cryptorjs(this.secretKey);
              // const base64 = Cryptor.decode(data);
              // console.warn(base64);
            });
        }
      } else {
        return "//lee6.com/img/public/" + this.id + ".webp";
      }
    },
  },
};
