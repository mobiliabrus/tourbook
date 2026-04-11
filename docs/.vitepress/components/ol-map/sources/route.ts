import { GeoJSON } from 'ol/format';

export const createRoute = (vectorSource: any, routeJSON: any) => {
  let route = routeJSON;
  if (typeof route === 'string') {
    try {
      route = JSON.parse(route);
    } catch {
      //
    }
  }

  if (route) {
    const coordinates = route.geometry.coordinates;

    if (coordinates) {
      const geojsonFormat = new GeoJSON();
      const routeFeature = geojsonFormat.readFeature(
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
          properties: {
            name: 'Driving Route',
            distance: (route.distance / 1000).toFixed(2) + ' km',
            duration: (route.duration / 60).toFixed(1) + ' min',
          },
        },
        {
          featureProjection: 'EPSG:3857',
        }
      );

      vectorSource.addFeature(routeFeature);
    }
  }
};
