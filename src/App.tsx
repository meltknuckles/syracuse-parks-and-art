import { useLocalStorage, useMediaQuery } from '@uidotdev/usehooks';
import * as _ from 'lodash';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Menubar } from 'primereact/menubar';
import { SelectButton } from 'primereact/selectbutton';
import { TreeSelect } from 'primereact/treeselect';
import { Ref, useEffect, useRef, useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import pointInPolygon from 'robust-point-in-polygon';
import { Footer } from './components/Footer';
import { ListView } from './components/ListView';
import MapContainer, {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_ZOOM_IN,
} from './components/Map';
import navIcon from './components/Map/icons/you.svg';
import { MapInfo } from './components/MapInfo';
import { RecenterButton } from './components/RecenterButton';
import { Colors, DATA, TRAIL_NAMES, TREE_NODE_DATA } from './constants';
import boundary from './data/boundary.json';
import { formatTitle } from './utils/formatTitle';
import { getFieldData } from './utils/getFieldData';
import './App.css';

export const ICON_SIZE = 60;
const boundaryPolygon = boundary.features[0].geometry.coordinates[0];

const App = () => {
  const [location, setLocation] = useLocalStorage<{
    latitude: any;
    longitude: any;
  } | null>('location', {
    latitude: null,
    longitude: null,
  });
  const [filter, setFilter] = useState('');
  const [zoom, setZoom] = useLocalStorage('zoom', DEFAULT_ZOOM);
  const [mapPosition, setMapPosition] = useLocalStorage('map', {
    lat: location?.latitude ?? DEFAULT_CENTER.latitude,
    lng: location?.longitude ?? DEFAULT_CENTER.longitude,
  });
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
  }>('interests', {
    park: { checked: true, partialChecked: false },
    parksandrec: {
      checked: false,
      partialChecked: true,
    },
  });
  const interestedIn = Object.keys(interests);
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)');
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      isOptimisticGeolocationEnabled: true,
    });
  useEffect(() => {
    if (
      coords?.latitude &&
      (!location?.latitude || location.latitude !== coords.latitude) &&
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
      setGoogleApiLoaded(false);

      if (map && !mapLoadedForFirstTime) {
        map.panTo({ lat: coords.latitude, lng: coords.longitude });
      }
    }
  }, [coords]);

  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [mapLoadedForFirstTime, setMapLoadedForFirstTime] = useState(false);
  const [mapType, setMapType] = useLocalStorage<string>('maptype', 'roadmap');

  const loadGeoData = ({ map: gmap, maps: gmaps }: any) => {
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
            title: formatTitle(selectable),
            icon,
            lat,
            lng,
            category,
          });
          setSelectedPath(null);
          setActiveIndex(0);
          gmap.panTo(_marker.getPosition());
          setMapPosition(_marker.getPosition());
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
        isGeolocationEnabled &&
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

      const validKeys = Object.keys(DATA).filter(
        (k) => !TREE_NODE_DATA.map(({ key }) => key).includes(k),
      );
      const keys = Object.keys(interests).filter((interest) =>
        validKeys.includes(interest),
      );
      for (const key of keys) {
        filterMarkers(DATA[key]);
      }

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
      } else if (TRAIL_NAMES.includes(feature.getProperty('name'))) {
        return {
          fillColor: interestedIn.includes('walking')
            ? Colors.lgreen
            : 'transparent',
          strokeColor: interestedIn.includes('walking')
            ? Colors.lgreen
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
      loadGeoData({ map, maps });
    }
  }, [interests, map, maps]);

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

  const scrollRef: Ref<any> = useRef();

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
            <span className="menu-title">
              {isSmallDevice ? 'SYR' : 'Syracuse'} Parks & Art
            </span>
          </div>
        }
        end={
          <div className="map-button-container">
            {isGeolocationEnabled && !isSmallDevice && location?.latitude && (
              <RecenterButton
                onClick={() => {
                  setLocation({ latitude: null, longitude: null });
                  setMapLoadedForFirstTime(false);
                  setSelectedMarker(null);
                  setActiveIndex(0);
                  getPosition();
                }}
              />
            )}
            {mapType && (
              <SelectButton
                allowEmpty={false}
                value={_.startCase(mapType)}
                onChange={(e) => {
                  setMapType(e.value.toLowerCase());
                  setGoogleApiLoaded(false);
                }}
                options={['Roadmap', 'Satellite']}
              />
            )}
          </div>
        }
      />
      <div className="grid" style={{ margin: 0 }}>
        <div
          className="info-container col-12 md:col-6 xl:col-5 flex-order-1 md:flex-order-0"
          ref={scrollRef}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Card className="interests-card">
              <label
                htmlFor="interests"
                style={{ fontWeight: 'bold', fontSize: '1.1em' }}
              >
                I'm Interested In...
              </label>
              {Object.keys(interests).length > 0 && (
                <Button
                  className="clear-interests-button"
                  label="Clear"
                  icon="pi pi-times"
                  size="small"
                  rounded
                  text
                  onClick={() => {
                    setGoogleApiLoaded(false);
                    setInterests({});
                  }}
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
          {!selectedMarker && !selectedPath && (
            <ListView
              {...{
                filter,
                interests,
                map,
                markers: prevMarkersRef?.current ?? [],
                scrollToRef: () => {
                  if (scrollRef.current) {
                    scrollRef.current.scroll({
                      top: -100,
                      behavior: 'smooth',
                    });
                  }
                },
                setActiveIndex,
                setFilter,
                setGoogleApiLoaded,
                setInterests,
                setMapPosition,
                setSelectedMarker,
                zoom,
              }}
            />
          )}
          {selectedMarker && (
            <MapInfo
              {...{
                selectedMarker,
                setSelectedPath,
                setSelectedMarker,
                setActiveIndex,
                item,
                activeIndex,
                photos,
              }}
            />
          )}
          {selectedPath && (
            <Card className="sidebar">
              <div className="grid">
                <div className="col">
                  <h2 style={{ textAlign: 'left' }}>{selectedPath.name}</h2>
                </div>
                <div className="col-fixed clear-btn-container">
                  <Button
                    className="clear-button"
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
          <Footer />
        </div>
        <div className="map-container col-12 md:col flex-order-0 md:flex-order-1">
          {isGeolocationEnabled && isSmallDevice && (
            <RecenterButton
              mobile={true}
              onClick={() => {
                setLocation({ latitude: null, longitude: null });
                setMapLoadedForFirstTime(false);
                setSelectedMarker(null);
                setActiveIndex(0);
                getPosition();
              }}
            />
          )}
          <MapContainer
            zoom={zoom}
            setZoom={setZoom}
            onGoogleApiLoaded={loadGeoData}
            interests={interests as any}
            mapType={mapType}
            mapPosition={mapPosition}
            setMapPosition={setMapPosition}
          />
        </div>
      </div>
      {isSmallDevice && <Footer mobile />}
    </div>
  );
};

export default App;
