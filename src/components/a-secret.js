import CryptoJS from "crypto-js";

const template = `<span v-if="!visible" @click="decrypt" style="display: inline-block;
background-color: #333;
color: transparent;
padding: 0 8px;
user-select: none;
font-size: 0;
width: 100%;
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
          this.rawContent = rawContent;
          const bytes = CryptoJS.AES.decrypt(rawContent, this.secretKey);
          const content = bytes.toString(CryptoJS.enc.Utf8);
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
