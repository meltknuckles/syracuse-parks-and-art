import { Button } from 'primereact/button';
import { DATA, SUB_PARK_DATA } from '../constants';
import { getFieldData } from '../utils/getFieldData';
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
    <div style={{ marginTop: -12, padding: 4 }}>
      <div className="grid park-header-container">
        <div className="col text-left">
          <h2 className="park-header">Parks</h2>
        </div>
        <div className="col p-inputgroup">
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
      </div>
      <div className="listview-container">
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
                      .map((featureData: any, idx: number) => {
                        const {
                          type,
                          properties,
                          latitude: plat,
                          longitude: plong,
                        } = featureData;
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
                          featureData: featureData,
                          properties,
                          label,
                          icon: DATA[type].icon,
                        };
                      })
                      .filter((data: any) => {
                        return (
                          data.properties?.park
                            ?.toLowerCase()
                            .includes(filter.toLowerCase()) ||
                          data.featureData?.name
                            ?.toLowerCase()
                            .includes(filter.toLowerCase()) ||
                          data.featureData?.properties?.name
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
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      fontSize: '1.2em',
                    }}
                    text
                    label={name}
                    icon={
                      <img
                        src={DATA.park.icon}
                        style={{ width: 18, marginRight: 6 }}
                      />
                    }
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
                      featureData,
                      properties,
                      label,
                      icon,
                    }: any) => {
                      return (
                        <Button
                          key={`${type},${lat},${lng}`}
                          className={`${cssType}-link`}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            paddingLeft: '10%',
                            fontSize: '1em',
                          }}
                          text
                          icon={
                            <img
                              src={icon}
                              style={{ width: 18, marginRight: 6 }}
                            />
                          }
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
                              ...featureData,
                              data: getFieldData(featureData, type),
                              type,
                              title:
                                properties?.name ?? formatTitle(featureData),
                              icon,
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
      </div>
    </div>
  );
};
