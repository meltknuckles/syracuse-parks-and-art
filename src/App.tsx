import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useGeolocated } from 'react-geolocated';
import MapContainer from './Map/Map';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as _ from 'lodash';
import { Galleria } from 'primereact/galleria';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Tag } from 'primereact/tag';
import navIcon from './Map/icons/you1.svg';
import boundary from './json/boundary.json';
import { DATA, DataTypes, TREE_NODE_DATA } from './constants';
import { TreeSelect } from 'primereact/treeselect';
import { SortOrder } from 'primereact/api';

export const ICON_SIZE = 60;

const generateMapsLink = (address: string, directions = false) => {
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = directions
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
    : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  return googleMapsUrl;
};

const App = () => {
  const [location, setLocation] = useState<{
    latitude: any;
    longitude: any;
  } | null>({
    latitude: null,
    longitude: null,
  });

  const prevMarkersRef = useRef([]);
  const [selectedMarker, setSelectedMarker] = useState<any>();
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();
  const [interests, setInterests] = useState<string[]>([]);
  const { coords, isGeolocationAvailable, getPosition } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    isOptimisticGeolocationEnabled: false,
  });
  useEffect(() => {
    if (coords && !location?.latitude) {
      setLocation({
        ...location,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  const [googlaApiLoaded, setGoogleApiLoaded] = useState(false);
  const [showBikePaths, setShowBikePaths] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [mapType, setMapType] = useState<string>('roadmap');
  const clearMarkers = (markers: any[]) => {
    for (let m of markers) {
      m.setMap(null);
    }
  };

  const onGoogleApiLoaded = ({ map, maps }: any) => {
    if (map && maps) {
      clearMarkers(prevMarkersRef.current);
      setGoogleApiLoaded(true);
      setMaps(maps);
      setMap(map);

      const addMarker = ({
        type,
        title,
        icon,
        lat,
        lng,
        selectable,
        category,
      }: {
        type: string;
        title: string;
        icon: any;
        lat: number;
        lng: number;
        selectable: any;
        category: string;
      }) => {
        const _marker = new maps.Marker({
          position: { lat, lng },
          map,
          title,
          icon: {
            url: icon,
            scaledSize: new maps.Size(ICON_SIZE, ICON_SIZE),
          },
        });
        maps.event.addListener(_marker, 'click', () => {
          // map.setZoom(15);
          let data;
          if (selectable) {
            if (['basketball', 'tennis', 'soccer', 'biking'].includes(type)) {
              data = {
                _labels: {
                  courtSize_quantity: 'Court Size (Quantity)',
                },
                park: selectable.properties['Park'],
                courtType: selectable.properties['COURT_TYPE'],
                courtSize_quantity:
                  selectable.properties['COURT_SIZE___QUANTITY'],
                accessibilityInfo: selectable['accessibility'],
              };
            } else if (['mural', 'mosaic', 'sculpture'].includes(type)) {
              data = {
                _labels: {},
                artType: selectable.properties['type'],
                artist:
                  `${selectable.properties['Artist_First'] || ''} ${selectable.properties['Artist_Last_'] || ''}`.trim(),
                additionalArtists: selectable.properties['Additional_Artists'],
                media: selectable.properties['Media'],
                yearCreated: selectable.properties['Year_Created'],
                yearErected: selectable.properties['Year_Erected'],
                neighborhood: selectable.properties['Neighborhood'],
                specificLocation: selectable.properties['Specific_Location'],
                accessibilityInfo: selectable['accessibility'],
              };
            } else if (type === 'center') {
              data = {
                _labels: {},
                park: selectable['Park'],
                accessibilityInfo: selectable['accessibility'],
              };
            } else if (type === 'playground') {
              data = {
                _labels: {},
                park: selectable['Park'],
                accessibilityInfo: selectable['accessibility'],
              };
            } else if (type === 'pool') {
              data = {
                _labels: {
                  hasRamp: 'Accessible Pool Ramp',
                  lengthwidth: 'Length x Width',
                },
                park: selectable.properties['Park'],
                poolType: selectable.properties['type'],
                hasRamp: selectable.properties['Accessible_Pool_Ramp'],
                lengthwidth: selectable.properties['Length_x_Width'],
                depth: selectable.properties['Depth'],
                accessibilityInfo: selectable['accessibility'],
              };
            } else if (type === 'park') {
              data = {
                _labels: {},
                features: selectable['features'],
                accessibilityInfo: selectable['accessibility'],
              };
            } else {
              data = { _labels: {} };
            }
          }
          const newSelectedMarker = {
            ...selectable,
            data,
            type,
            title,
            icon,
            lat,
            lng,
            category,
          };
          setSelectedMarker(newSelectedMarker);
          map.panTo(_marker.getPosition());
        });
        (prevMarkersRef.current as any).push(_marker);
      };
      const interestedIn = Object.keys(interests);
      const filterMarkers = (data: any) => {
        if (interestedIn.includes(data.type)) {
          for (const _d in data.data) {
            const d = data.data[_d];
            const lat = d.properties?.latitude || d.latitude;
            const lng = d.properties?.longitude || d.longitude;
            let title = d.title || d.name || d.properties?.name;
            if (d.type === 'pool') {
              title = `${d.properties?.Park || ''} Pool`.trim();
            }
            if (!title && d.properties?.COURT_TYPE) {
              title =
                `${d.properties?.Park || ''} ${d.properties.COURT_TYPE} Court`.trim();
            }
            if (lat && lng) {
              addMarker({
                type: d.type,
                title,
                category: DATA[d.type as any].interest[0],
                icon: data.icon,
                lat,
                lng,
                selectable: d,
              });
            }
          }
        }
      };
      if (showMarkers) {
        // if (
        //   isGeolocationAvailable &&
        //   location?.latitude &&
        //   location?.longitude
        // ) {
        //   addMarker({
        //     type: 'you',
        //     title: 'You are Here',
        //     icon: navIcon,
        //     lat: location.latitude,
        //     lng: location.longitude,
        //     selectable: location,
        //   });
        // }
        filterMarkers(DATA.dogpark);
        filterMarkers(DATA.playground);
        filterMarkers(DATA.pool);
        filterMarkers(DATA.center);
        filterMarkers(DATA.mural);
        filterMarkers(DATA.mosaic);
        filterMarkers(DATA.sculpture);
        filterMarkers(DATA.basketball);
        filterMarkers(DATA.tennis);
        filterMarkers(DATA.soccer);
        filterMarkers(DATA.biking);
        filterMarkers(DATA.shuffleboard);
        filterMarkers(DATA.park);

        const bounds = new maps.LatLngBounds(
          new maps.LatLng(42.97132928046586, -76.25925946941094),
          new maps.LatLng(43.099950460544136, -76.02245601734865),
        );
        map.setOptions({
          restriction: { latLngBounds: bounds, strictBounds: true },
        });
      }
      if (interestedIn.includes('biking')) {
        const bikeLayer = new google.maps.BicyclingLayer();
        bikeLayer.setMap(map);
      }

      map.data.addGeoJson(boundary);
      if (interestedIn.includes('walking') || interestedIn.includes('biking')) {
        map.data.addGeoJson(DATA.walking.data);
      }

      map.data.setStyle((feature: any) => {
        if (feature.getProperty('name') === 'boundary') {
          return {
            fillColor: '#cdd',
            strokeColor: '#788',
            strokeWeight: 2,
          };
        } else if (
          [
            'Onondaga Creekwalk',
            'Empire State Trail',
            'Ley Creek Trail',
            'Coldbrook Creek Trail',
          ].includes(feature.getProperty('name'))
        ) {
          return {
            fillColor: interestedIn.includes('walking')
              ? '#9E86C1'
              : 'transparent',
            strokeColor: interestedIn.includes('walking')
              ? '#9E86C1'
              : 'transparent',
            strokeWeight: 4,
          };
        } else if (feature.getProperty('name') === 'Bike Lane') {
          return {
            fillColor: interestedIn.includes('biking')
              ? '#3d7742'
              : 'transparent',
            strokeColor: interestedIn.includes('biking')
              ? '#3d7742'
              : 'transparent',
            strokeWeight: 2,
          };
        }
        return {
          fillColor: '#faa',
          strokeColor: '#faa',
          strokeWeight: 8,
        };
      });
    }
  };
  useEffect(() => {
    if (map && maps) {
      onGoogleApiLoaded({ map, maps });
    }
  }, [interests, map, maps]);

  const kvPairData = selectedMarker?.data
    ? {
        ...selectedMarker.data,
        hours: selectedMarker.data.hours ?? 'Daily from Dawn to Dusk',
      }
    : { _labels: {}, hours: 'Daily from Dawn to Dusk' };
  const kvPairs = Object.keys(kvPairData)
    .filter(
      (l) =>
        l !== '_labels' &&
        !!kvPairData[l] &&
        (!Array.isArray(kvPairData[l]) || kvPairData[l].length > 0),
    )
    .map((key) => ({
      key: Object.keys(kvPairData._labels).includes(key)
        ? kvPairData._labels[key]
        : _.startCase(key),
      value:
        key.toLowerCase() === 'park' &&
        DATA.park.data.find(
          ({ name }: { name: string }) => name === kvPairData[key],
        ) ? (
          <Button
            link
            label={kvPairData[key]}
            style={{ background: 'transparent', border: 'none', padding: 4 }}
            onClick={() => {
              const selectable = DATA.park.data.find(
                ({ name }: { name: string }) => name === kvPairData[key],
              );

              if (selectable) {
                setSelectedMarker({
                  ...selectable,
                  data: null, // TODO:
                  type: 'park',
                  title: selectable.name,
                  icon: null,
                  lat: selectable.latitude,
                  lng: selectable.longitude,
                });
              }
            }}
          />
        ) : (
          kvPairData[key]
        ),
    }));

  const itemTemplate = (item: any) => {
    return (
      <img src={item} alt={selectedMarker.title} style={{ width: '100%' }} />
    );
  };
  const thumbnailTemplate = (item: any) => {
    return <img src={item} alt={selectedMarker.title} style={{ height: 70 }} />;
  };
  const selectedAddress =
    selectedMarker?.properties?.address ||
    selectedMarker?.address ||
    (selectedMarker?.properties?.Park &&
      DATA.park.data.find(
        ({ name }: { name: string }) =>
          name === selectedMarker?.properties?.Park,
      )?.address);
  const selectedtags = [];
  if (selectedMarker) {
    if (
      selectedMarker.accessibility ||
      selectedMarker.features?.find((f: string) => f === 'Accessible')
    ) {
      selectedtags.push('Accessible');
    }
    if (selectedMarker.features?.find((f: string) => f.includes('Parking'))) {
      selectedtags.push('Parking');
    }
    if (
      selectedMarker.features?.find(
        (f: string) => !!['Playground', 'Swing'].find((i) => f.includes(i)),
      )
    ) {
      selectedtags.push('Playground');
    }
    if (
      selectedMarker.features?.find(
        (f: string) => !!['Court', 'Field', 'Pool'].find((i) => f.includes(i)),
      )
    ) {
      selectedtags.push('Sports');
    }
  }

  return (
    <div>
      <Menubar
        model={[]}
        style={{ height: 60 }}
        start={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              alt="logo"
              src="/logo.png"
              style={{ height: 40 }}
              className="mr-2"
            />
            <span style={{ fontSize: '1.1em', paddingLeft: 4 }}>
              Syracuse Touch Grass
            </span>
          </div>
        }
      />
      <div className="grid" style={{ margin: 0 }}>
        <div
          className="col-5"
          style={{
            height: 'calc(100vh - 60px)',
            overflow: 'auto',
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Card
              style={{
                padding: 0,
                textAlign: 'left',
                background: '#feefc3',
                border: `1px outset rgb(254, 239, 195)`,
                marginBottom: 16,
              }}
            >
              <label
                htmlFor="interests"
                style={{ fontWeight: 'bold', fontSize: '1.2em' }}
              >
                I'm Interested In...
              </label>
              <TreeSelect
                id="interests"
                nodeTemplate={({ label, color }: any) => {
                  return (
                    <div
                      style={{
                        color,
                        fontSize: '1.3em',
                      }}
                    >
                      {label}
                    </div>
                  );
                }}
                filter
                value={interests as any}
                onChange={(e: any) => setInterests(e.value || [])}
                options={TREE_NODE_DATA}
                // optionLabel="label"
                metaKeySelection={false}
                selectionMode="checkbox"
                display="chip"
                className="w-full"
              />
            </Card>
          </div>
          {selectedMarker && (
            <Card style={{ padding: 0, textAlign: 'left' }}>
              <h2 style={{ marginTop: 0 }}>{selectedMarker.title}</h2>
              <div
                style={{ textAlign: 'right', marginTop: -50, marginBottom: 12 }}
              >
                {selectedtags.map((tag) => (
                  <Tag severity="info" style={{ marginRight: 4 }}>
                    {tag}
                  </Tag>
                ))}
              </div>
              {selectedMarker?.gallery && (
                <div>
                  <Galleria
                    circular
                    value={Array(selectedMarker?.gallery.count)
                      .fill('')
                      .map(
                        (_g, idx) =>
                          `/parks/${selectedMarker?.gallery.folder ?? _.kebabCase(selectedMarker.title)}/${_.padStart((idx + 1).toString(), 2, '0')}.jpg`,
                      )}
                    numVisible={4}
                    showThumbnails={selectedMarker?.gallery.count > 1}
                    style={{ width: '100%' }}
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                  />
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                {selectedAddress && (
                  <Card
                    header={
                      <div
                        style={{
                          padding: 8,
                          paddingLeft: 16,
                          paddingBottom: 0,
                          opacity: 0.8,
                          textAlign: 'left',
                        }}
                      >
                        Address
                      </div>
                    }
                    style={{
                      background: '#eff4f4',
                      marginBottom: 16,
                      textAlign: 'right',
                    }}
                  >
                    <a
                      href={generateMapsLink(selectedAddress)}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '1.1em' }}
                    >
                      {selectedAddress}
                      <i
                        className="pi pi-external-link"
                        style={{ marginLeft: 12 }}
                      />
                    </a>
                  </Card>
                )}
                {selectedMarker.description && (
                  <p
                    style={{ textAlign: 'left' }}
                    dangerouslySetInnerHTML={{
                      __html: selectedMarker.description,
                    }}
                  ></p>
                )}
              </div>
              {kvPairs && (
                <div>
                  <DataTable
                    stripedRows
                    value={kvPairs}
                    sortField="key"
                    sortOrder={SortOrder.ASC}
                    className="info-table"
                    size="small"
                  >
                    <Column field="key" header=""></Column>
                    <Column
                      field="value"
                      header=""
                      body={(info) => {
                        let value = info.value;
                        const regexp = new RegExp(
                          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
                        );
                        if (Array.isArray(value)) {
                          console.log('value', value);
                          value = (
                            <ul style={{ margin: 0 }}>
                              {value.map((v) => (
                                <li>{v}</li>
                              ))}
                            </ul>
                          );
                        } else if (regexp.test(value)) {
                          value = (
                            <a href={value} target="_blank" rel="noreferrer">
                              <i className="pi pi-external-link" />
                            </a>
                          );
                        }
                        return <div>{value}</div>;
                      }}
                    ></Column>
                  </DataTable>
                </div>
              )}
            </Card>
          )}
        </div>
        <div className="col" style={{ padding: 0 }}>
          <MapContainer
            location={coords}
            setMapLocation={setLocation}
            isGeolocationAvailable={isGeolocationAvailable}
            getPosition={getPosition}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            onGoogleApiLoaded={onGoogleApiLoaded}
            interests={interests}
            mapType={mapType}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
