<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  flight: {
    type: String,
    required: false,
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
})

const departureTimeLocale = computed(() => {
  return dayjs(props.departureTime).format('D MMM, HH:mm')
})

const arriveTimeLocale = computed(() => {
  if (dayjs(props.departureTime).diff(props.arriveTime, 'day') === 0) {
    return dayjs(props.arriveTime).format('HH:mm')
  }
  return dayjs(props.arriveTime).format('D MMM, HH:mm')
})
</script>

<template>
  <div class="a-flight" aria-hidden="true">
    <div class="a-flight-no"><span>{{ flight }}</span></div>
    <div class="am-steps am-steps-horizontal am-steps-label-vertical">
      <div class="am-steps-item am-steps-item-process am-steps-item-custom">
        <div class="am-steps-item-tail"></div>
        <div class="am-steps-item-icon">
          <span class="am-steps-icon">
            <i class="anticon">
              <svg t="1651558792798" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
                <path d="M152.362667 591.594667c2.218667-0.768 5.76 0.810667 8.106666 2.261333 24.661333 15.381333 49.130667 31.04 73.813334 46.357333 2.368 1.472 6.272 2.304 8.725333 1.429334 50.176-18.133333 100.266667-36.522667 150.357333-54.890667 0.853333-0.32 1.6-0.853333 3.050667-1.642667L203.648 285.866667c2.261333-0.981333 4.053333-1.877333 5.888-2.56 23.722667-8.746667 47.530667-17.28 71.146667-26.304 5.077333-1.92 8.32-1.024 12.416 2.24 101.781333 81.472 203.712 162.730666 305.450666 244.266666 5.226667 4.202667 9.258667 4.736 15.466667 2.432 80.96-29.930667 161.984-59.584 243.050667-89.173333 37.738667-13.781333 75.029333 8.554667 80.981333 48.298667 4.074667 27.157333-12.565333 54.101333-39.978667 64.192-63.786667 23.466667-127.637333 46.826667-191.445333 70.229333l-445.653333 163.413333c-32.064 11.776-56.533333 2.986667-76.992-24.704-18.666667-25.301333-39.36-49.088-59.178667-73.557333L85.333333 616.021333c23.04-8.469333 44.970667-16.704 67.029334-24.426666z" fill="#3D3D3D"></path>
              </svg>
            </i>
          </span>
        </div>
        <div class="am-steps-item-content">
          <div class="am-steps-item-title">{{ departure }}</div>
          <div class="am-steps-item-description">{{ departureTimeLocale }}</div>
        </div>
      </div>
      <div class="am-steps-item am-steps-item-wait am-steps-item-custom">
        <div class="am-steps-item-tail"></div>
        <div class="am-steps-item-icon">
          <span class="am-steps-icon">
            <i class="anticon">
              <svg t="1651558896240" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
                <path d="M128 896h768v42.666667H128v-42.666667z m384-18.133333s-167.936-103.957333-179.413333-112c-33.557333-23.466667-59.690667-44.074667-77.013334-61.44A361.536 361.536 0 0 1 149.333333 448c0-200.298667 162.368-362.666667 362.666667-362.666667s362.666667 162.368 362.666667 362.666667c0 97.493333-38.656 188.885333-106.24 256.426667-17.322667 17.365333-43.456 37.973333-77.013334 61.44-11.477333 8.042667-179.413333 112-179.413333 112zM512 576a128 128 0 1 0 0-256 128 128 0 0 0 0 256z" fill="#3D3D3D"></path>
              </svg>
            </i>
          </span>
        </div>
        <div class="am-steps-item-content">
          <div class="am-steps-item-title">{{ destination }}</div>
          <div class="am-steps-item-description">{{ arriveTimeLocale }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.am-steps {
  font-size: 0;
  width: 100%;
  line-height: 1.5;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.am-steps,
.am-steps * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.am-steps-item {
  position: relative;
  display: inline-block;
  vertical-align: top;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow: hidden;
}
.am-steps-item:last-child {
  -webkit-box-flex: 0;
  -webkit-flex: none;
  -ms-flex: none;
  flex: none;
}
.am-steps-item:last-child .am-steps-item-tail,
.am-steps-item:last-child .am-steps-item-title:after {
  display: none;
}
.am-steps-item-icon,
.am-steps-item-content {
  display: inline-block;
  vertical-align: top;
}
.am-steps-item-icon {
  border: 1px solid #bbb;
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 22px;
  text-align: center;
  font-size: 14px;
  margin-right: 8px;
  -webkit-transition: background-color 0.3s, border-color 0.3s;
  transition: background-color 0.3s, border-color 0.3s;
}
.am-steps-item-icon > .am-steps-icon {
  line-height: 1;
  top: -1px;
  color: #108ee9;
  position: relative;
}
.am-steps-item-icon > .am-steps-icon .am-icon {
  font-size: 12px;
  position: relative;
  float: left;
}
.am-steps-item-tail {
  position: absolute;
  left: 0;
  width: 100%;
  top: 12px;
  padding: 0 10px;
}
.am-steps-item-tail:after {
  content: "";
  display: inline-block;
  background: #ddd;
  height: 1px;
  border-radius: 1px;
  width: 100%;
  -webkit-transition: background 0.3s;
  transition: background 0.3s;
  position: relative;
  left: -2px;
}
.am-steps-item-content {
  margin-top: 3px;
}
.am-steps-item-title {
  font-size: 16px;
  margin-bottom: 4px;
  color: #000;
  font-weight: bold;
  display: inline-block;
  padding-right: 10px;
  position: relative;
}
.am-steps-item-description {
  font-size: 15px;
  color: #bbb;
}
.am-steps-item-wait .am-steps-item-icon {
  border-color: #ccc;
  background-color: #fff;
}
.am-steps-item-wait .am-steps-item-icon > .am-steps-icon {
  color: #ccc;
}
.am-steps-item-wait .am-steps-item-icon > .am-steps-icon .am-steps-icon-dot {
  background: #ccc;
}
.am-steps-item-wait .am-steps-item-title {
  color: #000;
}
.am-steps-item-wait .am-steps-item-title:after {
  background-color: #ddd;
}
.am-steps-item-wait .am-steps-item-description {
  color: #000;
}
.am-steps-item-wait .am-steps-item-tail:after {
  background-color: #ddd;
}
.am-steps-item-process .am-steps-item-icon {
  border-color: #108ee9;
  background-color: #fff;
}
.am-steps-item-process .am-steps-item-icon > .am-steps-icon {
  color: #108ee9;
}
.am-steps-item-process .am-steps-item-icon > .am-steps-icon .am-steps-icon-dot {
  background: #108ee9;
}
.am-steps-item-process .am-steps-item-title {
  color: #000;
}
.am-steps-item-process .am-steps-item-title:after {
  background-color: #ddd;
}
.am-steps-item-process .am-steps-item-description {
  color: #000;
}
.am-steps-item-process .am-steps-item-tail:after {
  background-color: #ddd;
}
.am-steps-item-process .am-steps-item-icon {
  background: #108ee9;
}
.am-steps-item-process .am-steps-item-icon > .am-steps-icon {
  color: #fff;
}
.am-steps-item-finish .am-steps-item-icon {
  border-color: #108ee9;
  background-color: #fff;
}
.am-steps-item-finish .am-steps-item-icon > .am-steps-icon {
  color: #108ee9;
}
.am-steps-item-finish .am-steps-item-icon > .am-steps-icon .am-steps-icon-dot {
  background: #108ee9;
}
.am-steps-item-finish .am-steps-item-title {
  color: #000;
}
.am-steps-item-finish .am-steps-item-title:after {
  background-color: #108ee9;
}
.am-steps-item-finish .am-steps-item-description {
  color: #000;
}
.am-steps-item-finish .am-steps-item-tail:after {
  background-color: #108ee9;
}
.am-steps-item-error .am-steps-item-icon {
  border-color: #f4333c;
  background-color: #fff;
}
.am-steps-item-error .am-steps-item-icon > .am-steps-icon {
  color: #f4333c;
}
.am-steps-item-error .am-steps-item-icon > .am-steps-icon .am-steps-icon-dot {
  background: #f4333c;
}
.am-steps-item-error .am-steps-item-title {
  color: #f4333c;
}
.am-steps-item-error .am-steps-item-title:after {
  background-color: #ddd;
}
.am-steps-item-error .am-steps-item-description {
  color: #f4333c;
}
.am-steps-item-error .am-steps-item-tail:after {
  background-color: #ddd;
}
.am-steps-item.am-steps-next-error .am-steps-item-title:after {
  background: #f4333c;
}
.am-steps-item.error-tail .am-steps-item-tail:after {
  background-color: #f4333c;
}
.am-steps-horizontal:not(.am-steps-label-vertical) .am-steps-item {
  margin-right: 10px;
}
.am-steps-horizontal:not(.am-steps-label-vertical) .am-steps-item:last-child {
  margin-right: 0;
}
.am-steps-horizontal:not(.am-steps-label-vertical) .am-steps-item-tail {
  display: none;
}
.am-steps-horizontal:not(.am-steps-label-vertical) .am-steps-item-description {
  max-width: 100px;
}
.am-steps-item-custom .am-steps-item-icon {
  background: none;
  border: 0;
  width: auto;
  height: auto;
}
.am-steps-item-custom .am-steps-item-icon > .am-steps-icon {
  font-size: 22px;
  top: 1px;
  width: 22px;
  height: 22px;
}
.am-steps-item-custom.am-steps-item-process .am-steps-item-icon > .am-steps-icon {
  color: #108ee9;
}
.am-steps-small .am-steps-item-icon {
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 18px;
  font-size: 14px;
  margin-right: 8px;
}
.am-steps-small .am-steps-item-icon > .am-steps-icon {
  font-size: 12px;
  -webkit-transform: scale(0.75);
  -ms-transform: scale(0.75);
  transform: scale(0.75);
  top: -2px;
}
.am-steps-small .am-steps-item-content {
  margin-top: 0;
}
.am-steps-small .am-steps-item-title {
  font-size: 16px;
  margin-bottom: 3px;
  color: #000;
  font-weight: bold;
}
.am-steps-small .am-steps-item-description {
  font-size: 12px;
  color: #bbb;
}
.am-steps-small .am-steps-item-tail {
  top: 8px;
  padding: 0 8px;
}
.am-steps-small .am-steps-item-tail:after {
  height: 1px;
  border-radius: 1px;
  width: 100%;
  left: 0;
}
.am-steps-small .am-steps-item-custom .am-steps-item-icon {
  background: none;
}
.am-steps-small .am-steps-item-custom .am-steps-item-icon > .am-steps-icon {
  font-size: 18px;
  top: -2px;
  -webkit-transform: none;
  -ms-transform: none;
  transform: none;
}
.am-steps-vertical {
  display: block;
}
.am-steps-vertical .am-steps-item {
  display: block;
  overflow: visible;
}
.am-steps-vertical .am-steps-item-icon {
  float: left;
}
.am-steps-vertical .am-steps-item-icon-inner {
  margin-right: 16px;
}
.am-steps-vertical .am-steps-item-content {
  min-height: 48px;
  overflow: hidden;
  display: block;
}
.am-steps-vertical .am-steps-item-title {
  line-height: 26px;
}
.am-steps-vertical .am-steps-item-title:after {
  display: none;
}
.am-steps-vertical .am-steps-item-description {
  padding-bottom: 12px;
}
.am-steps-vertical .am-steps-item-tail {
  position: absolute;
  left: 13px;
  top: 0;
  height: 100%;
  width: 1px;
  padding: 30px 0 4px 0;
}
.am-steps-vertical .am-steps-item-tail:after {
  height: 100%;
  width: 1px;
}
.am-steps-vertical.am-steps-small .am-steps-item-tail {
  position: absolute;
  left: 9px;
  top: 0;
  padding: 22px 0 4px 0;
}
.am-steps-vertical.am-steps-small .am-steps-item-title {
  line-height: 18px;
}
.am-steps-label-vertical .am-steps-item {
  overflow: visible;
}
.am-steps-label-vertical .am-steps-item-tail {
  padding: 0 24px;
  margin-left: 48px;
}
.am-steps-label-vertical .am-steps-item-content {
  display: block;
  text-align: center;
  margin-top: 8px;
  width: 100px;
}
.am-steps-label-vertical .am-steps-item-icon {
  display: inline-block;
  margin-left: 36px;
}
.am-steps-label-vertical .am-steps-item-title {
  padding-right: 0;
}
.am-steps-label-vertical .am-steps-item-title:after {
  display: none;
}

.a-flight {
  position: relative;
  margin: 16px;
}

.a-flight .a-flight-no {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 1;
  padding: 0 8px;
  background-color: #fff;
}
</style>
