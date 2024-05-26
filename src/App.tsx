import { useLocalStorage } from '@uidotdev/usehooks';
import * as _ from 'lodash';
import { SortOrder } from 'primereact/api';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Galleria } from 'primereact/galleria';
import { Image as PrimereactImage } from 'primereact/image';
import { Menubar } from 'primereact/menubar';
import { SelectButton } from 'primereact/selectbutton';
import { Tag } from 'primereact/tag';
import { TreeSelect } from 'primereact/treeselect';
import { Ref, useEffect, useRef, useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import { FaParking } from 'react-icons/fa';
import { GiKidSlide } from 'react-icons/gi';
import { MdAccessible, MdSportsBasketball } from 'react-icons/md';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import pointInPolygon from 'robust-point-in-polygon';
import MapContainer, { DEFAULT_ZOOM, DEFAULT_ZOOM_IN } from './Map/Map';
import navIcon from './Map/icons/you.svg';
import { Colors, DATA, TREE_NODE_DATA } from './constants';
import boundary from './json/boundary.json';
import { getFieldData } from './utils/getFieldData';
import { useMediaQuery } from '@uidotdev/usehooks';
import './App.css';
import { ListView } from './ListView';
import { formatTitle } from './utils/formatTitle';

export const ICON_SIZE = 60;
const boundaryPolygon = boundary.features[0].geometry.coordinates[0];

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
  const [filter, setFilter] = useState('');
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const prevMarkersRef = useRef([]);
  const [selectedMarker, setSelectedMarker] = useState<any>();
  const [selectedPath, setSelectedPath] = useState<any>();
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();
  const [interests, setInterests] = useLocalStorage<{
    center?: { checked: boolean; partialChecked: boolean };
    dogpark?: { checked: boolean; partialChecked: boolean };
    park?: { checked: boolean; partialChecked: boolean };
    parksandrec?: { checked: boolean; partialChecked: boolean };
    playground?: { checked: boolean; partialChecked: boolean };
    walking?: { checked: boolean; partialChecked: boolean };
  }>('interests', {});
  const interestedIn = Object.keys(interests);
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)');
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      isOptimisticGeolocationEnabled: false,
    });
  useEffect(() => {
    if (
      coords?.latitude &&
      !location?.latitude &&
      pointInPolygon(boundaryPolygon as any, [
        coords.latitude,
        coords.longitude,
      ])
    ) {
      setLocation({
        ...location,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (map) {
        map.panTo({ lat: coords.latitude, lng: coords.longitude });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, location]);

  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [mapLoadedForFirstTime, setMapLoadedForFirstTime] = useState(false);
  const [mapType, setMapType] = useLocalStorage<string>('maptype', 'roadmap');

  const onGoogleApiLoaded = ({ map: gmap, maps: gmaps }: any) => {
    if (gmap && gmaps && !googleApiLoaded) {
      for (let m of prevMarkersRef.current) {
        const marker: any = m;
        marker.setMap(null);
      }
      prevMarkersRef.current = [];
      setMaps(gmaps);
      setMap(gmap);

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
        const _marker = new gmaps.Marker({
          position: { lat, lng },
          key: title,
          category,
          map: gmap,
          title,
          icon: {
            url: icon,
            scaledSize: new gmaps.Size(ICON_SIZE, ICON_SIZE),
          },
        });
        gmaps.event.addListener(_marker, 'click', () => {
          if (gmap.zoom < DEFAULT_ZOOM_IN) {
            gmap.setZoom(DEFAULT_ZOOM_IN);
          }
          let data;
          if (selectable) {
            data = getFieldData(selectable, type);
          }
          setSelectedMarker({
            ...selectable,
            data,
            type,
            title,
            icon,
            lat,
            lng,
            category,
          });
          setSelectedPath(null);
          setActiveIndex(0);
          gmap.panTo(_marker.getPosition());
        });
        (prevMarkersRef.current as any).push(_marker);
      };
      const filterMarkers = (data: any) => {
        for (let m of prevMarkersRef.current) {
          const marker: any = m;
          if (marker.category === data.type) {
            marker.setMap(null);
          }
        }
        if (
          interestedIn.includes(data.type) ||
          (selectedMarker?.title && selectedMarker.title === data?.name)
        ) {
          for (const _d in data.data) {
            const d = data.data[_d];
            const lat = d.properties?.latitude || d.latitude;
            const lng = d.properties?.longitude || d.longitude;
            const title = formatTitle(d);
            if (lat && lng) {
              addMarker({
                type: d.type,
                title,
                category: DATA[d.type as any].interest[0],
                icon: data.markerIcon,
                lat,
                lng,
                selectable: d,
              });
            }
          }
        }
      };

      if (
        isGeolocationAvailable &&
        location?.latitude &&
        location?.longitude &&
        pointInPolygon(boundaryPolygon as any, [
          location.latitude,
          location.longitude,
        ])
      ) {
        addMarker({
          type: 'you',
          title: 'You are Here',
          icon: navIcon,
          lat: location.latitude,
          lng: location.longitude,
          selectable: location,
          category: '',
        });
        if (!mapLoadedForFirstTime && location.latitude && location.longitude) {
          gmap.panTo({ lat: location.latitude, lng: location.longitude });
          setMapLoadedForFirstTime(true);
        }
      }
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
      filterMarkers(DATA.skateboard);
      filterMarkers(DATA.golf);
      filterMarkers(DATA.baseball);
      filterMarkers(DATA.iceskate);
      filterMarkers(DATA.park);

      const bounds = new gmaps.LatLngBounds(
        new gmaps.LatLng(42.97132928046586, -76.25925946941094),
        new gmaps.LatLng(43.099950460544136, -76.02245601734865),
      );
      gmap.setOptions({
        restriction: { latLngBounds: bounds, strictBounds: true },
      });
    }
    if (interestedIn.includes('biking')) {
      const bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(map);
    }

    gmap.data.addGeoJson(boundary);
    if (interestedIn.includes('walking') || interestedIn.includes('biking')) {
      gmap.data.addGeoJson(DATA.walking.data);
    }
    gmap.data.addListener('click', (event: any) => {
      if (
        !['boundary', 'Bike Lane'].includes(
          event.feature.getProperty('name') as string,
        )
      ) {
        setSelectedPath({
          name: event.feature.getProperty('name'),
          description: event.feature.getProperty('description'),
          url: event.feature.getProperty('url'),
        });
        setSelectedMarker(null);
        setActiveIndex(0);
      }
    });

    setGoogleApiLoaded(true);
    gmap.data.setStyle((feature: any) => {
      if (feature.getProperty('name') === 'boundary') {
        if (mapType === 'roadmap') {
          return {
            fillColor: 'transparent',
            strokeColor: '#788',
            strokeWeight: 2,
          };
        }
        return {
          fillColor: 'transparent',
          strokeColor: '#ffca3a',
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
            ? mapType === 'roadmap'
              ? Colors.lgreen
              : Colors.lgreen
            : 'transparent',
          strokeColor: interestedIn.includes('walking')
            ? mapType === 'roadmap'
              ? Colors.lgreen
              : Colors.lgreen
            : 'transparent',
          strokeWeight: 5,
        };
      } else if (feature.getProperty('name') === 'Bike Lane') {
        return {
          fillColor: interestedIn.includes('biking')
            ? mapType === 'roadmap'
              ? '#3d7742'
              : Colors.yellow
            : 'transparent',
          strokeColor: interestedIn.includes('biking')
            ? mapType === 'roadmap'
              ? '#3d7742'
              : Colors.yellow
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
  };
  useEffect(() => {
    if (map && maps && !googleApiLoaded) {
      onGoogleApiLoaded({ map, maps });
    }
  }, [interests, map, maps]);
  const galleriaRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  let photos = selectedMarker?.gallery?.count
    ? Array(selectedMarker?.gallery.count ?? 0)
        .fill('')
        .map(
          (_g, idx) =>
            `/parks/${selectedMarker?.gallery.folder ?? _.kebabCase(selectedMarker.title)}/${_.padStart((idx + 1).toString(), 2, '0')}.jpg`,
        )
    : [];
  if (photos.length === 0 && selectedMarker?.gallery?.parent?.length > 0) {
    const parentPark = selectedMarker?.properties?.park ?? selectedMarker?.park;
    const park = DATA.park.data?.find(({ name }: any) => name === parentPark);
    const folderName = park?.gallery.folder ?? _.kebabCase(park.name);
    photos = selectedMarker.gallery.parent.map(
      (i: number) =>
        `/parks/${folderName}/${_.padStart(i.toString(), 2, '0')}.jpg`,
    );
  }
  const item = photos[activeIndex];
  const [width, setWidth] = useState(0);
  const ref: any = useRef(null);
  useEffect(() => {
    if (ref.current?.offsetWidth) {
      setWidth(ref.current.offsetWidth);
    }
  }, [ref, item, activeIndex, photos]);
  const imgRef = useRef();

  const scrollRef: Ref<any> = useRef();
  const scrollToRef = () => {
    if (scrollRef.current) {
      scrollRef.current.scroll({
        top: -100,
        behavior: 'smooth',
      });
    }
  };

  const kvPairData = selectedMarker?.data
    ? {
        ...selectedMarker.data,
        hours: selectedMarker.data.hours,
      }
    : { _labels: {} };
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
            key={kvPairData[key]}
            link
            label={kvPairData[key]}
            style={{ background: 'transparent', border: 'none', padding: 4 }}
            onClick={() => {
              const selectable = DATA.park.data.find(
                ({ name }: { name: string }) => name === kvPairData[key],
              );
              const parentPark =
                selectedMarker?.properties?.park ?? selectedMarker?.park;
              const park = DATA.park.data?.find(
                ({ name }: any) => name === parentPark,
              );

              if (selectable) {
                setSelectedPath(null);
                setSelectedMarker({
                  ...selectable,
                  data: getFieldData(park, 'park'),
                  type: 'park',
                  title: selectable.name,
                  icon: null,
                  lat: selectable.latitude,
                  lng: selectable.longitude,
                  category: selectable.type,
                });
                setActiveIndex(0);
              }
            }}
          />
        ) : (
          kvPairData[key]
        ),
    }));

  const selectedAddress =
    selectedMarker?.properties?.address ||
    selectedMarker?.address ||
    (selectedMarker?.properties?.park &&
      DATA.park.data.find(
        ({ name }: { name: string }) =>
          name === selectedMarker?.properties?.park,
      )?.address);
  const selectedtags = [];

  if (selectedMarker) {
    if (
      selectedMarker.accessibility ||
      selectedMarker.features?.find((f: string) => f === 'Accessible')
    ) {
      selectedtags.push({
        label: 'Accessible',
        icon: MdAccessible,
        color: Colors.blue,
      });
    }
    if (selectedMarker.features?.find((f: string) => f.includes('Parking'))) {
      selectedtags.push({
        label: 'Parking',
        icon: FaParking,
        color: Colors.purple,
      });
    }
    if (
      selectedMarker.features?.find(
        (f: string) => !!['Playground', 'Swing'].find((i) => f.includes(i)),
      )
    ) {
      selectedtags.push({
        label: 'Playground',
        icon: GiKidSlide,
        color: Colors.green,
      });
    }
    if (
      selectedMarker.features?.find(
        (f: string) => !!['Court', 'Field', 'Pool'].find((i) => f.includes(i)),
      )
    ) {
      selectedtags.push({
        label: 'Sports',
        icon: MdSportsBasketball,
        color: Colors.red,
      });
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
              {isSmallDevice ? 'SYR' : 'Syracuse'} Parks & Art
            </span>
          </div>
        }
        end={
          <div className="map-button-container">
            {isGeolocationEnabled && !isSmallDevice && (
              <Button
                label="Re-center Map"
                rounded
                icon={<FaLocationCrosshairs style={{ marginRight: 6 }} />}
                severity="secondary"
                style={{ marginRight: 12, padding: '2px 16px' }}
                onClick={() => {
                  setLocation({ latitude: null, longitude: null });
                  setMapLoadedForFirstTime(false);
                  getPosition();
                }}
              ></Button>
            )}
            {mapType && (
              <SelectButton
                allowEmpty={false}
                value={_.startCase(mapType)}
                onChange={(e) => setMapType(e.value.toLowerCase())}
                options={['Roadmap', 'Satellite']}
              />
            )}
          </div>
        }
      />
      <div className="grid" style={{ margin: 0 }}>
        <div
          className="info-container col-12 md:col-5 flex-order-1 md:flex-order-0"
          ref={scrollRef}
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
                style={{ fontWeight: 'bold', fontSize: '1.1em' }}
              >
                I'm Interested In...
              </label>
              {Object.keys(interests).length > 0 && (
                <Button
                  className="clear-button"
                  label="Clear"
                  icon="pi pi-times"
                  size="small"
                  rounded
                  text
                  onClick={() => {
                    setGoogleApiLoaded(false);
                    setInterests({});
                  }}
                  style={{ float: 'right', marginTop: -8, marginBottom: 8 }}
                ></Button>
              )}
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
                onChange={(e: any) => {
                  setGoogleApiLoaded(false);
                  setInterests(e.value || []);
                }}
                options={TREE_NODE_DATA}
                metaKeySelection={false}
                selectionMode="checkbox"
                display="chip"
                className="w-full"
              />
            </Card>
          </div>
          {!selectedMarker && !selectedPath && map && (
            <ListView
              zoom={zoom}
              filter={filter}
              setFilter={setFilter}
              scrollToRef={scrollToRef}
              map={map}
              setSelectedMarker={setSelectedMarker}
              markers={prevMarkersRef?.current ?? []}
            />
          )}
          {selectedMarker && (
            <Card style={{ padding: 0, textAlign: 'left' }}>
              <div className="grid">
                <div className="col">
                  <h2>{selectedMarker.title}</h2>
                </div>
                <div className="col-fixed">
                  <Button
                    icon="pi pi-times"
                    text
                    size="small"
                    rounded
                    onClick={() => setSelectedMarker(null)}
                  />
                </div>
              </div>
              {selectedtags.length > 0 && (
                <div className="tag-container">
                  {selectedtags.map((tag) => (
                    <Tag
                      key={tag.label}
                      style={{
                        backgroundColor: tag.color,
                        marginLeft: 6,
                        borderRadius: 16,
                        padding: '4px 10px',
                      }}
                      icon={<tag.icon style={{ marginRight: 6 }} />}
                    >
                      {tag.label}
                    </Tag>
                  ))}
                </div>
              )}
              {photos.length > 0 && (
                <div
                  className="grid img-container"
                  style={{ margin: 0, position: 'relative' }}
                >
                  <div
                    className="col-fixed"
                    style={{
                      width: 45,
                      height: '100%',
                      position: 'absolute',
                      left: 6,
                      zIndex: 999,
                    }}
                  >
                    {activeIndex > 0 && (
                      <Button
                        type="button"
                        className="img-button"
                        icon="pi pi-chevron-left"
                        onClick={() => setActiveIndex(activeIndex - 1)}
                      ></Button>
                    )}
                  </div>
                  <div className="col">
                    <Button
                      type="button"
                      ref={ref}
                      className="img-container"
                      onClick={() => {
                        (imgRef.current as any)?.show();
                        (galleriaRef.current as any)?.stopSlideShow();
                      }}
                      style={{
                        height: `${Math.floor(width * (2 / 3))}px`,
                        backgroundImage: `url("${item}")`,
                      }}
                    >
                      {photos.length > 1 && (
                        <Badge
                          className="img-count"
                          value={`${activeIndex + 1}/${photos.length}`}
                        ></Badge>
                      )}
                    </Button>
                  </div>
                  <div
                    className="col-fixed"
                    style={{
                      width: 45,
                      height: '100%',
                      position: 'absolute',
                      right: 14,
                      zIndex: 999,
                    }}
                  >
                    {photos.length > 1 && activeIndex < photos.length - 1 && (
                      <Button
                        type="button"
                        className="img-button"
                        icon="pi pi-chevron-right"
                        onClick={() => setActiveIndex(activeIndex + 1)}
                      ></Button>
                    )}
                  </div>
                  <PrimereactImage
                    ref={imgRef as any}
                    src={item}
                    alt="Image"
                    style={{ display: 'none' }}
                    preview
                  />
                  <Galleria
                    ref={galleriaRef as any}
                    value={photos}
                    circular
                    style={{ display: 'none' }}
                    showItemNavigators={false}
                    activeIndex={activeIndex}
                    showThumbnails={false}
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
              {kvPairs && Object.keys(kvPairs).length > 0 && (
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
                        value = (
                          <ul style={{ margin: 0 }}>
                            {value.map((v) => (
                              <li key={v}>{v}</li>
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
              )}
            </Card>
          )}
          {selectedPath && (
            <Card>
              <div className="grid">
                <div className="col">
                  <h2 style={{ textAlign: 'left' }}>{selectedPath.name}</h2>
                </div>
                <div className="col-fixed">
                  <Button
                    icon="pi pi-times"
                    text
                    size="small"
                    rounded
                    onClick={() => setSelectedPath(null)}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
        <div
          className="map-container col-12 md:col flex-order-0 md:flex-order-1"
          style={{ padding: 0, position: 'relative' }}
        >
          {isGeolocationEnabled && isSmallDevice && (
            <Button
              className="recenter-button"
              rounded
              icon={<FaLocationCrosshairs />}
              severity="secondary"
              onClick={() => {
                setLocation({ latitude: null, longitude: null });
                setMapLoadedForFirstTime(false);
                getPosition();
              }}
            ></Button>
          )}
          <MapContainer
            setZoom={setZoom}
            location={coords}
            setMapLocation={setLocation}
            isGeolocationAvailable={isGeolocationAvailable}
            getPosition={getPosition}
            onGoogleApiLoaded={onGoogleApiLoaded}
            interests={interests as any}
            mapType={mapType}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
