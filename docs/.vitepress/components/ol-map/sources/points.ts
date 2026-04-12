import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Style from 'ol/style/Style';
import { fromLonLat } from 'ol/proj';
import { textBaseStyle } from '../style';

interface IIconConfig {
  url: string;
  size: [number, number];
}

export const createPoints = (vectorSource: any, pointsData: any[], iconConfig?: IIconConfig) => {
  pointsData.forEach(([lng, lat, label]) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
      label: label || '-',
    });

    if (iconConfig) {
      const style = new Style({
        image: new Icon({
          src: iconConfig.url,
          size: iconConfig.size,
          scale: iconConfig.size ? undefined : 1,
        }),
        text: new Text({
          text: new Feature({
            geometry: new Point(fromLonLat([lng, lat])),
            label: label || '-',
          }).get('label'),
          ...textBaseStyle,
          offsetY: 22,
        }),
      });
      feature.setStyle(style);
    }

    vectorSource.addFeature(feature);
  });
};
