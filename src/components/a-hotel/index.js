import dayjs from "dayjs";

const template = `<div><div><b>{{this.name}}</b></div><div @click="this.switchDetail" style="margin-bottom:16px">
<i>{{this.from}}</i>
<i>{{this.to}}</i>
</div></div>`;

export default {
  template,
  data: function () {
    return {
      detail: false,
    };
  },
  props: ["name", "date", "nights"],
  computed: {
    from: function () {
      return dayjs(this.date).format("D MMM, YYYY");
    },
    to: function () {
      return this.detail ? ` - ${dayjs(this.date).add(this.nights, "d").format("D MMM, YYYY")}` : `, ${this.nights} night${this.nights > 1 ? "s" : ""}`;
    },
  },
  methods: {
    switchDetail: function () {
      this.detail = !this.detail;
    },
  },
};
