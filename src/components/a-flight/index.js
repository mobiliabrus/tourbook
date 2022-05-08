import dayjs from "dayjs";
import './index.css';

const template = `<div style="position:relative;margin:16px;">
<div style="position:absolute;left:50%;top:0;transform:translateX(-50%);z-index:999;"><span>{{ this.flight }}</span></div>
<div class="am-steps am-steps-horizontal am-steps-label-vertical">
<div class="am-steps-item am-steps-item-process am-steps-item-custom">
<div class="am-steps-item-tail"></div>
<div class="am-steps-item-icon">
<span class="am-steps-icon">
<i class="anticon">
<svg t="1651558792798" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1560" width="22" height="22"><path d="M152.362667 591.594667c2.218667-0.768 5.76 0.810667 8.106666 2.261333 24.661333 15.381333 49.130667 31.04 73.813334 46.357333 2.368 1.472 6.272 2.304 8.725333 1.429334 50.176-18.133333 100.266667-36.522667 150.357333-54.890667 0.853333-0.32 1.6-0.853333 3.050667-1.642667L203.648 285.866667c2.261333-0.981333 4.053333-1.877333 5.888-2.56 23.722667-8.746667 47.530667-17.28 71.146667-26.304 5.077333-1.92 8.32-1.024 12.416 2.24 101.781333 81.472 203.712 162.730667 305.450666 244.266666 5.226667 4.202667 9.258667 4.736 15.466667 2.432 80.96-29.930667 161.984-59.584 243.050667-89.173333 37.738667-13.781333 75.029333 8.554667 80.981333 48.298667 4.074667 27.157333-12.565333 54.101333-39.978667 64.192-63.786667 23.466667-127.637333 46.826667-191.445333 70.229333l-445.653333 163.413333c-32.064 11.776-56.533333 2.986667-76.992-24.704-18.666667-25.301333-39.36-49.088-59.178667-73.557333L85.333333 616.021333c23.04-8.469333 44.970667-16.704 67.029334-24.426666z" fill="#3D3D3D" p-id="1561"></path></svg>
</i>
</span></div><div class="am-steps-item-content">
<div class="am-steps-item-title">{{ this.departure }}</div><div class="am-steps-item-description">{{ this.departureTimeLocale }}</div>
</div></div>
<div class="am-steps-item am-steps-item-wait am-steps-item-custom">
<div class="am-steps-item-tail"></div><div class="am-steps-item-icon">
<span class="am-steps-icon">
<i class="anticon">
<svg t="1651558896240" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1699" width="22" height="22"><path d="M128 896h768v42.666667H128v-42.666667z m384-18.133333s-167.936-103.957333-179.413333-112c-33.557333-23.466667-59.690667-44.074667-77.013334-61.44A361.536 361.536 0 0 1 149.333333 448c0-200.298667 162.368-362.666667 362.666667-362.666667s362.666667 162.368 362.666667 362.666667c0 97.493333-38.656 188.885333-106.24 256.426667-17.322667 17.365333-43.456 37.973333-77.013334 61.44-11.477333 8.042667-179.413333 112-179.413333 112zM512 576a128 128 0 1 0 0-256 128 128 0 0 0 0 256z" fill="#3D3D3D" p-id="1700"></path></svg>
</i>
</span></div><div class="am-steps-item-content">
<div class="am-steps-item-title">{{ this.destination }}</div><div class="am-steps-item-description">{{ this.arriveTimeLocale }}</div></div></div></div></div>`;

export default {
  template,
  props: {
    flight: {
      type: String,
      required: true,
    },
    departure: {
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    arriveTime: {
      type: String,
      required: true,
    },
  },
  computed: {
    departureTimeLocale: function () {
      return dayjs(this.departureTime).format("D MMM, HH:mm");
    },
    arriveTimeLocale: function () {
      if (dayjs(this.departureTime).diff(this.arriveTime, 'day') === 0) {
        return dayjs(this.arriveTime).format("HH:mm");
      }
      return dayjs(this.arriveTime).format("D MMM, HH:mm");
    },
  },
};
