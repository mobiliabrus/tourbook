import { fromLonLat, get as getProjection } from 'ol/proj';
import LineString from 'ol/geom/LineString';
import { Style, Stroke } from 'ol/style';
import { Feature } from 'ol';

const webMercatorProjection = getProjection('EPSG:3857')

function createArcCoordinates(start, end, heightFactor = 100000, numPoints = 100) {
  const [lon1, lat1] = start;
  const [lon2, lat2] = end;

  if (![lon1, lat1, lon2, lat2].every(Number.isFinite)) {
    console.error('Invalid numeric coordinates:', { lon1, lat1, lon2, lat2 })
    return []
  }

  const p1 = fromLonLat([lon1, lat1], webMercatorProjection)
  const p2 = fromLonLat([lon2, lat2], webMercatorProjection)

  const midX = (p1[0] + p2[0]) / 2
  const midY = (p1[1] + p2[1]) / 2

  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  const len = Math.sqrt(dx * dx + dy * dy)

  if (len === 0) return [p1]

  const nx = -dy / len
  const ny = dx / len

  const ctrlX = midX + nx * heightFactor
  const ctrlY = midY + ny * heightFactor

  const coords = []
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints

    const x =
      (1 - t) * (1 - t) * p1[0] +
      2 * (1 - t) * t * ctrlX +
      t * t * p2[0]

    const y =
      (1 - t) * (1 - t) * p1[1] +
      2 * (1 - t) * t * ctrlY +
      t * t * p2[1]

    coords.push([x, y])
  }

  return coords
}

export function createFlights(vectorSource, flights) {
  flights.forEach((data) => {
    const [start, end, times] = data;
    const startCoord = [Number(start[0]), Number(start[1])];
    const endCoord = [Number(end[0]), Number(end[1])];

    const arcCoords = createArcCoordinates(startCoord, endCoord, times * 50000);

    const lineString = new LineString(arcCoords);
    const feature = new Feature({ geometry: lineString });

    const opacity = Math.min(1.0, 0.3 + times * 0.1);

    feature.setStyle(
      new Style({
        stroke: new Stroke({
          color: `rgba(255, 165, 0, ${opacity})`,
          width: 3,
        }),
      })
    );

    vectorSource.addFeature(feature);
  });
}
