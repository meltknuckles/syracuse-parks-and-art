import React, { useState } from 'react';
import GoogleMap from 'google-map-react';
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-google-places-autocomplete';
import { Button } from 'primereact/button';
import parkdata from '../json/parks.json';
import pooldata from '../json/pools.json';
import centerdata from '../json/community-centers.json';
import courtdata from '../json/athletic-courts.json';
import artdata from '../json/public-art.json';
import dogparkdata from '../json/dog-parks.json';
import playgrounddata from '../json/playgrounds.json';
import boundary from '../json/boundary.json';
import creekwalk from '../json/creekwalk-trail.json';
import empirestatetrail from '../json/empire-state-trail.json';
import trailsAndLanes from '../json/bike.json';

import parkIcon from './icons/park.svg';
import navIcon from './icons/you1.svg';
import poolIcon from './icons/swim.svg';
import centerIcon from './icons/center.svg';
import bbIcon from './icons/bb2.svg';
import soccerIcon from './icons/soccer2.svg';
import tennisIcon from './icons/tennis2.svg';
import dogIcon from './icons/dog.svg';
import artIcon from './icons/mural.svg';
import sculptureIcon from './icons/sculpture.svg';
import mosaicIcon from './icons/mosaic.svg';
import shuffleboardIcon from './icons/shuffleboard.svg';
import playgroundIcon from './icons/playground.svg';
import bikeIcon from './icons/bike.svg';
import './Map.css';
// import { Button } from 'primereact/button';

const DEFAULT_ZOOM = 13;
const DEFAULT_CENTER = {
  latitude: 43.03698311154859,
  longitude: -76.14202734846212,
};
const ICON_SIZE = 60;

export const MapContainer = ({
  location,
  setMapLocation,
  isGeolocationAvailable,
  getPosition,
  selectedMarker,
  setSelectedMarker,
}: {
  location: any;
  setMapLocation: any;
  isGeolocationAvailable: boolean;
  getPosition: any;
  selectedMarker: any;
  setSelectedMarker: any;
}) => {
  const [googlaApiLoaded, setGoogleApiLoaded] = useState(false);
  const [showBikePaths, setShowBikePaths] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [mapType, setMapType] = useState<string>('roadmap');

  // const [circleRadius, setCircleRadius] = useState(location.radius);
  // const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
  if (!apiKey || !location) {
    return null;
  }

  return (
    <div style={{ overflow: 'hidden', background: '#dfe5e7' }}>
      {/* <div className="grid">
        <div className="col lat-lng-rad">
          <div className="location-container">
            <div className="lat">
              <strong>Latitude</strong>
              <InputNumber
                value={location.latitude}
                onValueChange={(e) =>
                  setMapLocation({ ...location, latitude: e.value })
                }
                minFractionDigits={6}
                maxFractionDigits={12}
              />
            </div>
            <div className="lng">
              <strong>Longitude</strong>
              <InputNumber
                value={location.longitude}
                onValueChange={(e) =>
                  setMapLocation({ ...location, longitude: e.value })
                }
                minFractionDigits={6}
                maxFractionDigits={12}
              />
            </div>
          </div>
        </div>
      </div> */}
      {/* (
      <div className="grid">
        <div className="col-12 sm:col">
          <GooglePlacesAutocomplete
            autocompletionRequest={{
              location: { lat: location.lat, lng: location.lng },
              radius: location.radius,
            }}
            selectProps={{
              value: selectedLocation,
              onChange: (value: any) =>
                geocodeByAddress(value.label)
                  .then((results) => getLatLng(results[0]))
                  .then(({ lat, lng }) => {
                    setSelectedLocation(value);
                    setMapLocation({
                      latitude: lat,
                      longitude: lng,
                    });
                  }),
              placeholder: 'Search for a Location',
            }}
          />
        </div>
      </div>
      ) */}
      {/* {isGeolocationAvailable && (
        <div className="col-12 sm:col-5 lg:col-4 xl:col-3">
          <Button
            style={{ width: '100%' }}
            className="green-button"
            rounded
            label="Re-center Map"
            icon="pi pi-map-marker"
            type="button"
            onClick={() => {
              getPosition();
              setMapLocation({ latitude: null, longitude: null });
            }}
          />
        </div>
      )} */}
      {location?.latitude && location?.longitude && (
        <div
          style={{
            display: 'flex',
            height: '100vh',
            width: '100%',
            position: 'relative',
          }}
        >
          <GoogleMap
            bootstrapURLKeys={{
              key: apiKey,
              libraries: ['places'],
            }}
            center={{
              lat: DEFAULT_CENTER.latitude,
              lng: DEFAULT_CENTER.longitude,
            }}
            zoom={DEFAULT_ZOOM}
            yesIWantToUseGoogleMapApiInternals
            layerTypes={
              [showBikePaths && 'BicyclingLayer'].filter(Boolean) as any
            }
            onGoogleApiLoaded={({ map, maps }) => {
              setGoogleApiLoaded(true);

              const addMarker = ({
                type,
                title,
                icon,
                lat,
                lng,
                selectable,
              }: {
                type: string;
                title: string;
                icon: any;
                lat: number;
                lng: number;
                selectable: any;
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
                    if (type === 'court') {
                      data = {
                        _labels: {
                          courtSize_quantity: 'Court Size (Quantity)',
                        },
                        courtType: selectable['COURT_TYPE'],
                        courtSize_quantity: selectable['COURT_SIZE___QUANTITY'],
                      };
                    } else if (type === 'art') {
                      data = {
                        _labels: {},
                        artType: selectable['Type'],
                        artistFirstName: selectable['Artist_First'],
                        artistLastName: selectable['Artist_Last_'],
                        additionalArtists: selectable['Additional_Artists'],
                        media: selectable['Media'],
                        yearCreated: selectable['Year_Created'],
                        yearErected: selectable['Year_Erected'],
                        neighborhood: selectable['Neighborhood'],
                        specificLocation: selectable['Specific_Location'],
                      };
                    } else if (type === 'center') {
                      data = {
                        _labels: {},
                        park: selectable['PARK'],
                      };
                    } else if (type === 'pool') {
                      data = {
                        _labels: {
                          hasRamp: 'Has Accessible Pool Ramp',
                          lengthwidth: 'Length x Width',
                        },
                        poolType: selectable['Type'],
                        hasRamp: selectable['Accessible_Pool_Ramp'],
                        lengthwidth: selectable['Length_x_Width'],
                        depth: selectable['Depth'],
                      };
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
                  };
                  setSelectedMarker(newSelectedMarker);
                  map.panTo(_marker.getPosition());
                });
              };
              if (showMarkers) {
                addMarker({
                  type: 'you',
                  title: 'You are Here',
                  icon: navIcon,
                  lat: location.latitude,
                  lng: location.longitude,
                  selectable: location,
                });

                for (const dogpark of dogparkdata) {
                  addMarker({
                    type: 'dogpark',
                    title: dogpark.name,
                    icon: dogIcon,
                    lat: dogpark.latitude,
                    lng: dogpark.longitude,
                    selectable: dogpark,
                  });
                }
                for (const playground of playgrounddata) {
                  addMarker({
                    type: 'playground',
                    title: playground.name,
                    icon: playgroundIcon,
                    lat: playground.latitude,
                    lng: playground.longitude,
                    selectable: playground,
                  });
                }

                for (const pool of pooldata.features) {
                  addMarker({
                    type: 'pool',
                    title: `${pool.properties.Park} Pool`,
                    icon: poolIcon,
                    lat: pool.properties.Latitude,
                    lng: pool.properties.Longitude,
                    selectable: pool.properties,
                  });
                }

                for (const center of centerdata.features) {
                  if (center.properties.PARK) {
                    addMarker({
                      type: 'center',
                      title: center.properties.PARK,
                      icon: centerIcon,
                      lat: center.geometry.coordinates[1],
                      lng: center.geometry.coordinates[0],
                      selectable: center.properties,
                    });
                  }
                }

                // for (const art of artdata.features) {
                //   let icon;
                //   if (
                //     art.properties.Type === 'Sculpture' ||
                //     art.properties.Type === 'Monument'
                //   ) {
                //     icon = sculptureIcon;
                //   } else if (art.properties.Type.includes('Mural')) {
                //     icon = artIcon;
                //   } else if (art.properties.Type === 'Mosaic') {
                //     icon = mosaicIcon;
                //   }
                //   new maps.Marker({
                //     position: {
                //       lat: art.properties.Latitude,
                //       lng: art.properties.Longitude,
                //     },
                //     map,
                //     title: art.properties.title,
                //     icon: {
                //       url: icon,
                //       scaledSize: new maps.Size(ICON_SIZE, ICON_SIZE),
                //     },
                //   });
                // }

                for (const court of courtdata.features) {
                  let icon;
                  if (
                    court.properties.COURT_TYPE.includes('Basketball') ||
                    court.properties.COURT_TYPE.includes('Hoop')
                  ) {
                    icon = bbIcon;
                  } else if (court.properties.COURT_TYPE.includes('Tennis')) {
                    icon = tennisIcon;
                  } else if (court.properties.COURT_TYPE === 'Futsal') {
                    icon = soccerIcon;
                  } else if (court.properties.COURT_TYPE === 'Shuffleboard') {
                    icon = shuffleboardIcon;
                  } else if (court.properties.COURT_TYPE.includes('Cycle')) {
                    icon = bikeIcon;
                  }

                  if (court.properties.LAT && court.properties.LONG) {
                    addMarker({
                      type: 'court',
                      title: `${court.properties.PARK} ${court.properties.COURT_TYPE} Court`,
                      icon,
                      lat: court.properties.LAT,
                      lng: court.properties.LONG,
                      selectable: court.properties,
                    });
                  }
                }

                for (const park of parkdata) {
                  addMarker({
                    type: 'park',
                    title: park.name,
                    icon: parkIcon,
                    lat: park.latitude,
                    lng: park.longitude,
                    selectable: park,
                  });
                }

                const bounds = new maps.LatLngBounds(
                  new maps.LatLng(42.97132928046586, -76.25925946941094),
                  new maps.LatLng(43.099950460544136, -76.02245601734865),
                );
                map.setOptions({
                  restriction: { latLngBounds: bounds, strictBounds: true },
                });
              }
              if (showBikePaths) {
                const bikeLayer = new google.maps.BicyclingLayer();
                bikeLayer.setMap(map);
              }

              map.data.addGeoJson(boundary);
              map.data.addGeoJson(trailsAndLanes);

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
                    fillColor: '#9E86C1',
                    strokeColor: '#9E86C1',
                    strokeWeight: 4,
                  };
                } else if (feature.getProperty('name') === 'Bike Lane') {
                  return {
                    fillColor: '#3d7742',
                    strokeColor: '#3d7742',
                    strokeWeight: 2,
                  };
                }
                return {
                  fillColor: '#faa',
                  strokeColor: '#faa',
                  strokeWeight: 8,
                };
              });
            }}
            options={{ mapTypeId: mapType }}
            // onChange={({ center, zoom }) => {}}
          ></GoogleMap>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
