import VueZoomer from "vue-zoomer";

const template = `<div style="line-height:initial">
  <div v-if="visible" style="position:fixed;top:0;left:0;height:100vh;width:100vw;background:rgba(0,0,0,0.8);z-index:2147483647;">
    <div @click="this.close" style="position:absolute;right:8px;top:10px;z-index:2147483646">
      <svg fill="#fff" t="1658039132650" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2251" width="25" height="25">
        <path d="M556.8 512L832 236.8c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0L512 467.2l-275.2-277.333333c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l275.2 277.333333-277.333333 275.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333L512 556.8 787.2 832c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8L556.8 512z" p-id="2252"></path>
      </svg>
    </div>
    <div style="position:absolute;left:0;bottom:0;width:100%;padding:8px 10px;z-index:2147483646">
      <slot name="action"></slot>
    </div>
    <v-zoomer ref="zoomer" style="width:100%;height:100%;">
      <slot name="popover"></slot>
    </v-zommer>
  </div>
  <div @click="this.pop"><slot name="default"></slot></div>
</div>`;

export default {
  template,
  data: function () {
    return {
      visible: false,
    };
  },
  props: {
    scale: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    zoomIn: function (s) {
      this.$refs.zoomer.zoomIn(s);
    },
    pop: function () {
      this.visible = true;
      this.$emit("popover");
      this.$nextTick(function () {
        this.zoomIn(this.scale);
      });
    },
    close: function () {
      this.visible = false;
    },
  },
  components: {
    "v-zoomer": VueZoomer.Zoomer,
  },
};
