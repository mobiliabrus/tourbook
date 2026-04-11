import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import CircleStyle from 'ol/style/Circle';

export const textBaseStyle = {
  font: '12px Arial',
  fill: new Fill({ color: '#000' }),
  stroke: new Stroke({ color: '#fff', width: 2 }),
  offsetY: -15,
  backgroundFill: new Fill({ color: 'rgba(255, 255, 255, 0.7)' }),
  padding: [2, 4, 2, 4],
};

export function style(feature: any) {
  const geometry = feature.getGeometry();
  const label = feature.get('label'); // Assume point features have 'label' property

  const styles = [];

  // 1. Add corresponding base styles according to geometry type
  if (geometry.getType() === 'LineString') {
    // Route style
    styles.push(
      new Style({
        stroke: new Stroke({
          color: '#4285F4',
          width: 5,
          lineDash: [6, 4],
        }),
      })
    );
  } else if (geometry.getType() === 'Point' && label) {
    // Point style (with label)
    styles.push(
      new Style({
        text: new Text({
          text: label,
          ...textBaseStyle,
        }),
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: '#4285F4' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
      })
    );
  }

  return styles; // Return style array
}
