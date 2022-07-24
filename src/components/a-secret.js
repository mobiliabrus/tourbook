import CryptoJS from "crypto-js";

const template = `<span v-if="!visible" @click="decrypt" style="display: inline;
background-color: #333;
color: transparent;
padding: 0 8px;
user-select: none;
height: 18px;
line-height: 18px;
word-break: break-all;
letter-spacing: -5.5px;">{{ this.rawContent }}</span>
<span v-else>{{ this.content }}</span>`;

export default {
  template,
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      visible: false,
      rawContent: undefined,
      content: undefined,
      secretKey: localStorage.getItem("lee6's-secret"),
    };
  },
  mounted() {
    if (this.secretKey) {
      fetch(`./confidential/${this.name}.md`)
        .then((res) => res.text())
        .then((rawContent) => {
          const keylength = 16;
          const keyorigin = this.secretKey.split("");
          const key16 = keyorigin.length < 16 ? [...keyorigin, ...Array.from(new Array(keylength - keyorigin.length)).map(() => "0")].join("") : key16;
          const keyutf = CryptoJS.enc.Utf8.parse(key16);
          const iv = { iv: CryptoJS.enc.Base64.parse(key16) };

          this.rawContent = rawContent;
          const raw = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(rawContent) }, keyutf, iv);
          const content = CryptoJS.enc.Utf8.stringify(raw);
          this.content = content;
        });
    }
  },
  methods: {
    decrypt: function () {
      if (this.secretKey) {
        this.visible = true;
      }
    },
  },
};
