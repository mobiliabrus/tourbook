import { GeoJSON } from 'ol/format';

export const createRoute = (vectorSource: any, routeJSON: string) => {
  let route;
  if (typeof routeJSON === 'string') {
    try {
      route = JSON.parse(routeJSON);
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
