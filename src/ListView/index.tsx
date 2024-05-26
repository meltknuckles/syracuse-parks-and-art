import { Button } from 'primereact/button';
import { DATA, SUB_PARK_DATA_ORDER } from '../constants';
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
  setInterests,
  interests,
  setGoogleApiLoaded,
  setActiveIndex,
}: any) => {
  return (
    <div style={{ marginTop: -12, padding: 4 }}>
      <div className="grid park-header-container">
        <div className="col text-left">
          <h2 className="park-header">Parks</h2>
        </div>
        <div className="col p-inputgroup">
          <InputText
            className="filter-text"
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
              for (const subpark of SUB_PARK_DATA_ORDER) {
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
                            label = `Basketball Court - ${properties.COURT_SIZE___QUANTITY}`;
                            cssType = 'sport';
                            break;
                          case 'tennis':
                            label = `Tennis Court - ${properties.COURT_SIZE___QUANTITY}`;
                            cssType = 'sport';
                            break;
                          case 'baseball':
                            label = 'Baseball Field';
                            cssType = 'sport';
                            break;
                          case 'water':
                            label = 'Water Feature';
                            cssType = 'park';
                            break;
                          case 'pool':
                            label = `${properties.type} Swimming Pool`;
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
                            label = properties?.name ?? 'Community Center';
                            cssType = 'park';
                            break;
                          case 'biking':
                            label = properties.COURT_TYPE ?? properties.type;
                            cssType = 'park';
                            break;
                          case 'iceskate':
                            label = 'Ice Skating Rink';
                            cssType = 'sport';
                            break;
                          case 'skateboard':
                            label = properties?.name ?? 'Skate Park';
                            cssType = 'sport';
                            break;
                          case 'mosaic':
                          case 'mural':
                          case 'sculpture':
                            label = (properties?.title ?? type ?? '').replace(
                              / *\([^)]*\) */g,
                              '',
                            );
                            cssType = 'art';
                            break;
                          default:
                            label = properties?.type ?? _.startCase(type);
                            cssType = 'park';
                            break;
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
                        const parentPark =
                          data?.properties?.park ??
                          data?.park ??
                          data.featureData.park;
                        return (
                          parentPark
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
                      }),
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
                      setActiveIndex(0);
                      if (!interests.park?.checked) {
                        setInterests({
                          ...interests,
                          park: { checked: true, partialChecked: false },
                          parksandrec: {
                            checked: interests.parksandrec?.checked ?? false,
                            partialChecked:
                              interests.parksandrec?.partialChecked ?? true,
                          },
                        });
                        setGoogleApiLoaded(false);
                      }
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
                            setActiveIndex(0);

                            if (!interests[type]?.checked) {
                              const parent = DATA[type].group;
                              setInterests({
                                ...interests,
                                [parent]: {
                                  checked: interests[parent]?.checked ?? false,
                                  partialChecked:
                                    interests[parent]?.partialChecked ?? true,
                                },
                                [type]: {
                                  checked: true,
                                  partialChecked: false,
                                },
                              });
                              setGoogleApiLoaded(false);
                            }
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
