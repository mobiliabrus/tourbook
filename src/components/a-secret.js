import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const template = `<span v-if="!visible" v-on:click="decrypt" style="display: inline-block;
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
    fetch(`./confidential/${this.name}.md`)
      .then((res) => res.text())
      .then((rawContent) => {
        this.rawContent = rawContent;
        const bytes = AES.decrypt(rawContent, this.secretKey);
        const content = bytes.toString(Utf8);
        this.content = content;
      });
  },
  methods: {
    decrypt: function () {
      this.visible = true;
    },
  },
};
