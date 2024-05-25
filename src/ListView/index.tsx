import { Button } from 'primereact/button';
import { DATA, SUB_PARK_DATA, DataTypes } from '../constants';
import { getFieldData } from '../utils/getFieldData';
import { Card } from 'primereact/card';
import { DEFAULT_ZOOM_IN } from '../Map/Map';
import * as _ from 'lodash';

export const ListView = ({
  map,
  setSelectedMarker,
  scrollToRef,
  zoom,
}: any) => {
  return (
    <div style={{ textAlign: 'left', padding: 12, marginTop: -16 }}>
      <Card>
        <h2 className="park-header" style={{ fontWeight: 'bold' }}>
          Parks
        </h2>
        <ul className="listview">
          {DATA.park.data
            .sort((a: any, b: any) => a.name - b.name)
            .map((data: any) => {
              const { name, latitude, longitude } = data;
              let parkFeatures: any[] = [];
              for (const subpark of SUB_PARK_DATA) {
                const inPark = subpark.data.filter(
                  ({ park, properties }: any) =>
                    name && (properties?.park || park) === name,
                );
                if (inPark.length > 0) {
                  parkFeatures = [
                    ...parkFeatures,
                    ...inPark.map(
                      ({ type, properties, latitude, longitude }: any) => {
                        const lat = properties?.latitude ?? latitude;
                        const lng = properties?.longitude ?? longitude;
                        let label: string;
                        let cssType: string;
                        switch (type) {
                          case 'basketball':
                            label = 'Basketball Court';
                            cssType = 'sport';
                            break;
                          case 'tennis':
                            label = 'Tennis Court';
                            cssType = 'sport';
                            break;
                          case 'baseball':
                            label = 'Baseball Field';
                            cssType = 'sport';
                            break;
                          case 'pool':
                            label = 'Swimming Pool';
                            cssType = 'park';
                            break;
                          case 'soccer':
                            label = 'Soccer Field';
                            cssType = 'sport';
                            break;
                          case 'golf':
                            label = 'Golf Course';
                            cssType = 'sport';
                            break;
                          case 'dogpark':
                            label = 'Dog Park';
                            cssType = 'park';
                            break;
                          case 'center':
                            label = 'Community Center';
                            cssType = 'park';
                            break;
                          default:
                            label = properties?.type ?? type;
                            cssType = 'park';
                            break;
                        }
                        return (
                          <Button
                            key={`${type},${lat},${lng}`}
                            className={`${cssType}-link`}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              paddingLeft: '10%',
                            }}
                            text
                            size="small"
                            label={_.startCase(label)}
                            onClick={() => {
                              if (zoom < DEFAULT_ZOOM_IN) {
                                map.setZoom(DEFAULT_ZOOM_IN);
                              }
                              map.panTo({
                                lat,
                                lng,
                              });
                              setSelectedMarker({
                                ...data,
                                data: getFieldData(data, DataTypes.park),
                                type: 'park',
                                title: name ?? properties?.name,
                                icon: null,
                                lat,
                                lng,
                                category: type,
                              });
                              scrollToRef();
                            }}
                          ></Button>
                        );
                      },
                    ),
                  ];
                }
              }
              return (
                <li key={name}>
                  <Button
                    className={`${data.type}-link`}
                    style={{ width: '100%', textAlign: 'left' }}
                    text
                    label={name}
                    onClick={() => {
                      if (zoom < DEFAULT_ZOOM_IN) {
                        map.setZoom(DEFAULT_ZOOM_IN);
                      }
                      map.panTo({ lat: latitude, lng: longitude });
                      setSelectedMarker({
                        ...data,
                        data: getFieldData(data, DataTypes.park),
                        type: 'park',
                        title: data.name,
                        icon: null,
                        lat: data.latitude,
                        lng: data.longitude,
                        category: data.type,
                      });
                      scrollToRef();
                    }}
                  ></Button>
                  {parkFeatures}
                </li>
              );
            })}
        </ul>
      </Card>
    </div>
  );
};
