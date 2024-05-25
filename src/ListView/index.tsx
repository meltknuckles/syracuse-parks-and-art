import { Button } from 'primereact/button';
import { DATA, SUB_PARK_DATA } from '../constants';
import { getFieldData } from '../utils/getFieldData';
import { Card } from 'primereact/card';
import { DEFAULT_ZOOM_IN } from '../Map/Map';
import * as _ from 'lodash';
import { formatTitle } from '../utils/formatTitle';
import { InputText } from 'primereact/inputtext';

export const ListView = ({
  map,
  setSelectedMarker,
  scrollToRef,
  zoom,
  filter,
  setFilter,
}: any) => {
  return (
    <div style={{ textAlign: 'left', padding: 12, marginTop: -16 }}>
      <Card>
        <div className="p-inputgroup" style={{ width: '50%', float: 'right' }}>
          <InputText
            size="small"
            onChange={(e: any) => setFilter(e.target.value)}
            value={filter}
            placeholder="Filter"
          />
          <Button
            icon="pi pi-times"
            severity="secondary"
            size="small"
            style={{ padding: 8 }}
            outlined
            onClick={() => setFilter('')}
          />
        </div>
        <h2 className="park-header" style={{ fontWeight: 'bold' }}>
          Parks
        </h2>
        <ul className="listview">
          {DATA.park.data
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
                    ...inPark
                      .map((parkdata: any, idx: number) => {
                        const {
                          type,
                          properties,
                          latitude: plat,
                          longitude: plong,
                        } = parkdata;
                        const lat = properties?.latitude ?? plat;
                        const lng = properties?.longitude ?? plong;
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
                          case 'skating':
                            label = 'Skate Park';
                            cssType = 'sport';
                            break;
                          default:
                            label = properties?.type ?? type;
                            cssType = 'park';
                            break;
                        }
                        label = _.startCase(label);

                        if (inPark.length > 1) {
                          label += ` #${idx + 1}`;
                        }
                        return {
                          type,
                          lat,
                          lng,
                          cssType,
                          parkdata,
                          properties,
                          label,
                        };
                      })
                      .filter((data: any) => {
                        return (
                          data.properties?.park
                            ?.toLowerCase()
                            .includes(filter.toLowerCase()) ||
                          data.parkdata?.name
                            ?.toLowerCase()
                            .includes(filter.toLowerCase()) ||
                          data.parkdata?.properties?.name
                            ?.toLowerCase()
                            .includes(filter.toLowerCase()) ||
                          data.label
                            ?.toLowerCase()
                            .includes(filter.toLowerCase())
                        );
                      })
                      .sort((a: any, b: any) => a.label - b.label),
                  ];
                }
              }
              return {
                name,
                data,
                latitude,
                longitude,
                parkFeatures,
              };
            })
            .filter((data: any) => {
              return (
                data.name.toLowerCase().includes(filter.toLowerCase()) ||
                data.parkFeatures.length > 0
              );
            })
            .map(({ name, data, latitude, longitude, parkFeatures }: any) => {
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
                        data: getFieldData(data, 'park'),
                        type: 'park',
                        title: formatTitle(data),
                        icon: null,
                        lat: data.latitude,
                        lng: data.longitude,
                        category: data.type,
                      });
                      scrollToRef();
                    }}
                  ></Button>
                  {parkFeatures.map(
                    ({
                      type,
                      lat,
                      lng,
                      cssType,
                      parkdata,
                      properties,
                      label,
                    }: any) => {
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
                          label={label}
                          onClick={() => {
                            if (zoom < DEFAULT_ZOOM_IN) {
                              map.setZoom(DEFAULT_ZOOM_IN);
                            }
                            map.panTo({
                              lat,
                              lng,
                            });
                            setSelectedMarker({
                              ...parkdata,
                              data: getFieldData(parkdata, type),
                              type,
                              title: properties?.name ?? formatTitle(parkdata),
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
                  )}
                </li>
              );
            })}
        </ul>
      </Card>
    </div>
  );
};
