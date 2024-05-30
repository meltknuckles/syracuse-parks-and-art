import GoogleMap from 'google-map-react';
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-google-places-autocomplete';
import './Map.css';
// import { Button } from 'primereact/button';

export const DEFAULT_ZOOM = 13;
export const DEFAULT_ZOOM_IN = 17;
export const DEFAULT_CENTER = {
  latitude: 43.03698311154859,
  longitude: -76.14202734846212,
};

export const MapContainer = ({
  onGoogleApiLoaded,
  mapType,
  interests,
  setZoom,
  zoom,
  mapPosition,
  setMapPosition,
}: {
  onGoogleApiLoaded: any;
  setZoom: any;
  interests: any[];
  mapType: string;
  zoom: number;
  mapPosition: any;
  setMapPosition: any;
}) => {
  const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
  if (!apiKey) {
    return null;
  }

  return (
    <div style={{ overflow: 'hidden', background: '#dfe5e7', marginTop: 2 }}>
      <div
        className="map-container"
        style={{
          display: 'flex',
          overflow: 'hidden',
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
            lat: mapPosition.lat ?? DEFAULT_CENTER.latitude,
            lng: mapPosition.lng ?? DEFAULT_CENTER.longitude,
          }}
          defaultZoom={DEFAULT_ZOOM}
          zoom={zoom}
          yesIWantToUseGoogleMapApiInternals
          layerTypes={
            Object.keys(interests).includes('biking') ? ['BicyclingLayer'] : []
          }
          onGoogleApiLoaded={onGoogleApiLoaded}
          options={{ mapTypeId: mapType }}
          onZoomAnimationEnd={(z) => setZoom(z)}
          onDragEnd={({ center }) =>
            setMapPosition({ lat: center.lat(), lng: center.lng() })
          }
        ></GoogleMap>
      </div>
    </div>
  );
};

export default MapContainer;
