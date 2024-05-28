import * as _ from 'lodash';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DEFAULT_ZOOM_IN } from '../Map/Map';
import { DATA, SUB_PARK_DATA_ORDER } from '../constants';
import { formatTitle } from '../utils/formatTitle';
import { getFieldData } from '../utils/getFieldData';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Card } from 'primereact/card';

export const ListView = ({
  filter,
  interests,
  map,
  scrollToRef,
  setActiveIndex,
  setFilter,
  setGoogleApiLoaded,
  setInterests,
  setMapPosition,
  setSelectedMarker,
  zoom,
}: any) => {
  const [selectedTab, setSelectedTab] = useLocalStorage('tab', 'park');
  const getCssType = ({ type, properties, name }: any): any => {
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
        label = properties.name ?? `${properties.type} Swimming Pool`;
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
      case 'playground':
        label = name ?? 'Playground';
        cssType = 'park';
        break;
      case 'mosaic':
      case 'mural':
      case 'sculpture':
        label = properties?.title ?? type ?? '';
        cssType = 'art';
        break;
      default:
        label = properties?.type ?? _.startCase(type);
        cssType = 'park';
        break;
    }
    return { cssType, label };
  };
  const parkdata = _.sortBy(
    [
      ...DATA.park.data,
      DATA.center.data.find(
        ({ properties: { name } }: any) =>
          name === 'Southwest Community Center',
      ),
    ],
    'name',
  ).map((data: any) => {
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
            .map((featureData: any) => {
              const {
                type,
                properties,
                latitude: plat,
                longitude: plong,
              } = featureData;
              const lat = properties?.latitude ?? plat;
              const lng = properties?.longitude ?? plong;
              const { cssType, label } = getCssType({
                type,
                properties,
              });
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
              if (selectedTab !== 'park' && data.cssType != selectedTab) {
                return false;
              }
              const parentPark =
                data?.properties?.park ?? data?.park ?? data.featureData.park;
              return (
                parentPark?.toLowerCase().includes(filter.toLowerCase()) ||
                data.featureData?.name
                  ?.toLowerCase()
                  .includes(filter.toLowerCase()) ||
                data.featureData?.properties?.name
                  ?.toLowerCase()
                  .includes(filter.toLowerCase()) ||
                data.label?.toLowerCase().includes(filter.toLowerCase())
              );
            }),
        ];
      }
    }
    return {
      key: name,
      name,
      data,
      latitude,
      longitude,
      parkFeatures,
    };
  });

  const render = ({
    name,
    data,
    latitude,
    longitude,
    parkFeatures,
    type,
    icon,
  }: any) => {
    return (
      <li key={name}>
        <Button
          className={`${type ?? data?.type ?? 'b'}-link`}
          style={{
            width: '100%',
            textAlign: 'left',
            fontSize: '1.2em',
          }}
          text
          label={name}
          icon={
            <img
              src={icon ?? DATA.park.icon}
              style={{ width: 18, marginRight: 6 }}
            />
          }
          onClick={() => {
            if (zoom < DEFAULT_ZOOM_IN) {
              map.setZoom(DEFAULT_ZOOM_IN);
            }
            map.panTo({ lat: latitude, lng: longitude });

            setMapPosition({ lat: latitude, lng: longitude });
            setSelectedMarker({
              ...data,
              data: getFieldData(data, data.type),
              type: data.type,
              title: formatTitle(data),
              icon: null,
              lat: data.latitude,
              lng: data.longitude,
              category: data.type,
            });
            setActiveIndex(0);
            if (!interests[data.type]?.checked) {
              const parent = DATA[data.type].group;
              setInterests({
                ...interests,
                [parent]: {
                  checked: interests[parent]?.checked ?? false,
                  partialChecked: interests[parent]?.partialChecked ?? true,
                },
                [data.type]: {
                  checked: true,
                  partialChecked: false,
                },
              });
              setGoogleApiLoaded(false);
            }
            scrollToRef();
          }}
        ></Button>
        {(parkFeatures || []).map(
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
                key={`${type},${lat},${lng},${label}`}
                className={`${cssType}-link`}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  paddingLeft: '10%',
                  fontSize: '1em',
                }}
                text
                icon={<img src={icon} style={{ width: 18, marginRight: 6 }} />}
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
                  setMapPosition({
                    lat,
                    lng,
                  });
                  setSelectedMarker({
                    ...featureData,
                    data: getFieldData(featureData, type),
                    type,
                    title: properties?.name ?? formatTitle(featureData),
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
  };

  const parkNames = [
    ...DATA.park.data.map(({ name }: { name: string }) => name),
    'Southwest Community Center',
  ];
  const listByType = ({
    type,
    data: d,
    mapFunction,
    linkType,
    header,
  }: {
    type?: string;
    linkType?: string;
    header?: string;
    data?: any[];
    mapFunction?: any;
  }) => {
    const data = d || (type ? DATA[type as string].data : []);
    const renderedData = _.sortBy(
      data
        .filter((data: any) => {
          return (
            (!data.park && !data.properties?.park) ||
            (data.properties?.park &&
              !parkNames.includes(data.properties.park)) ||
            (data.park && !parkNames.includes(data.park))
          );
        })
        .map((data: any) => {
          const { type: datatype, properties } = data;
          if (mapFunction) {
            return mapFunction(data);
          }
          let icon = DATA[data.type ?? type].icon;
          const { label } = getCssType({
            type: datatype,
            properties,
            name: data.properties?.name ?? data.name,
          });

          return {
            name: label,
            data,
            latitude: data.properties?.latitude ?? data.latitude,
            longitude: data.properties?.longitude ?? data.longitude,
            parkFeatures: [],
            type: linkType ?? 'park',
            icon,
          };
        })
        .filter(
          ({ name }: { name: string }) =>
            !filter || name.toLowerCase().includes(filter.toLowerCase()),
        ),
      'name',
    ).map(render);
    if (renderedData.length === 0) {
      return null;
    }
    return (
      <ul className="listview text-left">
        {header && <h2 className={`${linkType}-header`}>{header}s</h2>}
        {renderedData}
      </ul>
    );
  };
  const sculptureMapFunction = (data: any) => {
    const { properties } = data;
    let icon = DATA.art.icon;
    if (DATA[properties.type.toLowerCase()]) {
      icon = DATA[properties.type.toLowerCase()].icon;
    } else if (properties.type.includes('Monument')) {
      icon = DATA.sculpture.icon;
    }

    return {
      name: properties.title,
      data,
      latitude: properties.latitude,
      longitude: properties.longitude,
      parkFeatures: [],
      type: 'art',
      icon,
    };
  };

  return (
    <div style={{ marginTop: -12, padding: 4 }}>
      <div className="grid park-header-container">
        <div className="col text-left" style={{}}>
          <div
            className="grid flex"
            style={{
              width: '102%',
              justifyContent: 'space-between',
            }}
          >
            <div
              className="flex col-12 xl:col flex-order-1 xl:flex-order-0"
              style={{
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                padding: 0,
                margin: 0,
                marginBottom: -10,
              }}
            >
              <Button
                outlined={selectedTab !== 'park'}
                className={`park-tab-button listview-button ${selectedTab === 'park' ? 'selected' : ''}`}
                label="Parks"
                onClick={() => setSelectedTab('park')}
              ></Button>
              <Button
                outlined={selectedTab !== 'sport'}
                className={`sport-tab-button listview-button ${selectedTab === 'sport' ? 'selected' : ''}`}
                label="Sports"
                onClick={() => setSelectedTab('sport')}
              ></Button>
              <Button
                outlined={selectedTab !== 'art'}
                className={`art-tab-button listview-button ${selectedTab === 'art' ? 'selected' : ''}`}
                label="Art"
                onClick={() => setSelectedTab('art')}
              ></Button>
            </div>
            <div className="col-12 xl:col flex-order-0 xl:flex-order-1 filter-container">
              <div className="p-inputgroup">
                <InputText
                  className="filter-text"
                  size="small"
                  onChange={(e: any) => setFilter(e.target.value)}
                  value={filter}
                  placeholder="Filter"
                />
                <Button
                  className=""
                  icon="pi pi-times"
                  severity="secondary"
                  size="small"
                  style={{ padding: 8 }}
                  outlined
                  onClick={() => setFilter('')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Card className="listview-container">
        <ul className="listview">
          {parkdata
            .filter((data: any) => {
              if (selectedTab !== 'parks' && data.parkFeatures.length === 0) {
                return false;
              }
              return (
                data.name.toLowerCase().includes(filter.toLowerCase()) ||
                data.parkFeatures.length > 0
              );
            })
            .map(render)}
        </ul>
        {selectedTab === 'park' && (
          <div>
            {listByType({
              type: 'center',
              linkType: 'park',
              header: 'Community Center',
            })}
            {listByType({
              type: 'playground',
              linkType: 'park',
              header: 'Playground',
            })}
            {listByType({
              type: 'pool',
              linkType: 'park',
              header: 'Swimming Pool',
            })}
          </div>
        )}
        {selectedTab === 'sport' && (
          <div>
            {listByType({
              linkType: 'sport',
              data: [...DATA.basketball.data, ...DATA.tennis.data],
            })}
          </div>
        )}

        {selectedTab === 'art' && (
          <div>
            {listByType({
              type: 'mosaic',
              linkType: 'art',
              header: 'Mosaic',
            })}
            {listByType({
              type: 'mural',
              linkType: 'art',
              header: 'Mural',
            })}
            {listByType({
              type: 'sculpture',
              linkType: 'art',
              header: 'Sculptures & Monument',
              mapFunction: sculptureMapFunction,
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
