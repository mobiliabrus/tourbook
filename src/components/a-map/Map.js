import { loadBingApi } from "./loader";
import "./map.less";

const apiKey = process.env.NODE_ENV === "development" ? "AmaJse0LMtAHWktKP2ew2c_NNcKEDFem3a1MWEu8xN0_fNn-alxc7q1BlLEgcQtD" : "AvHBgtLyf4zbDhXESAuvFMSqIg1GgomX6DnDgw-CaXFeRmWVzvXPC55WveE4pJla";

const template = `<div class="map" ref="map"></div>`;

export default {
  template,
  data: function () {
    return {
      map: undefined,
    };
  },
  props: [
    'center',
    'points',
    'walking',
    'transit',
    'driving',
    'aerial',
    {
      name: "zoom",
      default: 14,
    },
  ],
  mounted() {
    loadBingApi(apiKey).then(() => {
      this.$initMap(this.$refs.map);
      this.$walking();
      this.$transit();
      this.$driving();
      this.$addPoint();
      this.$setCenter();
    });
  },
  methods: {
    $initMap: function (el) {
      const aerial = this.aerial;
      this.map = new Microsoft.Maps.Map(el, {
        ...(!aerial
          ? {}
          : {
              mapTypeId: Microsoft.Maps.MapTypeId.aerial,
            }),
        customMapStyle: {
          elements: {
            area: { fillColor: "#b6e591" },
            water: { fillColor: "#75cff0" },
            tollRoad: { fillColor: "#a964f4", strokeColor: "#a964f4" },
            arterialRoad: { fillColor: "#ffffff", strokeColor: "#d7dae7" },
            road: { fillColor: "#ffa35a", strokeColor: "#ff9c4f" },
            street: { fillColor: "#ffffff", strokeColor: "#ffffff" },
            transit: { fillColor: "#000000" },
          },
          settings: {
            landColor: "#efe9e1",
          },
        },
      });
    },
    $setCenter: function () {

      const { center: { latitude, longitude } = {}, zoom } = this;
      if (latitude && longitude) {
        this.map.setView({
          center: new Microsoft.Maps.Location(latitude, longitude),
          zoom,
        });
      } else {
        this.$setFitView();
      }
    },
    $setFitView: function () {
      const { points = [], walking = [], driving = [], transit = [] } = this;
      const locations = [
        ...points.map(({ latitude, longitude }) => new Microsoft.Maps.Location(latitude, longitude)),
        ...walking.map(({ latitude, longitude }) => new Microsoft.Maps.Location(latitude, longitude)),
        ...driving.map(({ latitude, longitude }) => new Microsoft.Maps.Location(latitude, longitude)),
        ...transit.map(({ latitude, longitude }) => new Microsoft.Maps.Location(latitude, longitude)),
      ];
      setTimeout(() => {
        this.map.setView({
          padding: 10,
          // eslint-disable-next-line new-cap
          bounds: new Microsoft.Maps.LocationRect.fromLocations(locations),
        });
      }, 1000);
    },
    $addPoint: function () {
      const { points = [] } = this;
      if (Array.isArray(points) && points.length) {
        points.forEach(({ latitude, longitude, address }) => {
          const pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latitude, longitude), {
            title: address,
          });
          const layer = new Microsoft.Maps.Layer();
          layer.add(pushpin);
          this.map.layers.insert(layer);
        });
      }
    },
    $walking: function () {
      const { walking = [] } = this;
      if (Array.isArray(walking) && walking.length) {
        this.$route(walking, "walking");
      }
    },
    $transit: function () {
      const { transit = [] } = this;
      if (Array.isArray(transit) && transit.length) {
        this.$route(transit, "transit");
      }
    },
    $driving: function () {
      const { driving = [] } = this;
      if (Array.isArray(driving) && driving.length) {
        this.$route(driving, "driving");
      }
    },
    $route: function (route, type = "walking") {
      if (Array.isArray(route) && route.length) {
        Microsoft.Maps.loadModule("Microsoft.Maps.Directions", () => {
          const directionsManager = new Microsoft.Maps.Directions.DirectionsManager(this.map);
          directionsManager.setRequestOptions({
            maxRoutes: 1,
            routeDraggable: false,
            routeMode: Microsoft.Maps.Directions.RouteMode[type],
          });
          route.forEach(({ address, latitude, longitude }) => {
            directionsManager.addWaypoint(
              new Microsoft.Maps.Directions.Waypoint({
                address,
                isViaPoint: !address,
                location: new Microsoft.Maps.Location(latitude, longitude),
              })
            );
          });
          directionsManager.setRenderOptions({
            itineraryContainer: document.getElementById("printoutPanel"),
          });
          directionsManager.calculateDirections();
        });
      }
    },
  },
};
