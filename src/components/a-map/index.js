import Map from "./Map";

const template = `<v-map
:center="this._center"
:points="this._points"
:walking="this._walking"
:transit="this._transit"
:driving="this._driving"
:zoom="this.zoom"
:aerial="this.aerial"
></v-map>`;

export default {
  template,
  props: [
    "center",
    "points",
    "walking",
    "transit",
    "driving",
    "zoom",
    "aerial",
  ],
  computed: {
    _points: function () {
      return typeof this.points === 'string'
        ? this.points.split('|').map((point) => {
            const [lat, lng, address] = point.split(",");
            return { latitude: lat, longitude: lng, address };
          })
        : [];
    },
    _center: function () {
      const [latitude, longitude] = typeof this.center === "string" ? this.center.split(",") : [];
      return latitude && longitude
        ? { latitude, longitude }
        : // try using points as center
          this._points[0] && { latitude: this._points[0].latitude, longitude: this.points[0].longitude };
    },
    _walking: function () {
      return typeof this.walking === 'string'
        ? this.walking.split('|').map((point) => {
            const [lat, lng, address] = point.split(",");
            return { latitude: lat, longitude: lng, address };
          })
        : [];
    },
    _transit: function () {
      return typeof this.transit === 'string'
        ? this.transit.split('|').map((point) => {
            const [lat, lng, address] = point.split(",");
            return { latitude: lat, longitude: lng, address };
          })
        : [];
    },
    _driving: function () {
      return typeof this.driving === 'string'
        ? this.driving.split('|').map((point) => {
            const [lat, lng, address] = point.split(",");
            return { latitude: lat, longitude: lng, address };
          })
        : [];
    },
  },
  components: {
    "v-map": Map,
  },
};
