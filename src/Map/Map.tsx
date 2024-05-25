import GoogleMap from 'google-map-react';
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-google-places-autocomplete';
import './Map.css';
// import { Button } from 'primereact/button';

const DEFAULT_ZOOM = 13;
const DEFAULT_CENTER = {
  latitude: 43.03698311154859,
  longitude: -76.14202734846212,
};

export const MapContainer = ({
  location,
  // setMapLocation,
  // isGeolocationAvailable,
  // getPosition,
  // selectedMarker,
  onGoogleApiLoaded,
  mapType,
  interests,
}: {
  location: any;
  setMapLocation: any;
  isGeolocationAvailable: boolean;
  getPosition: any;
  onGoogleApiLoaded: any;
  interests: any[];
  mapType: string;
}) => {
  // const [circleRadius, setCircleRadius] = useState(location.radius);
  // const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
  if (!apiKey || !location) {
    return null;
  }

  return (
    <div style={{ overflow: 'hidden', background: '#dfe5e7', marginTop: 2 }}>
      {/* <div className="grid">
        <div className="col lat-lng-rad">
          <div className="location-container">
            <div className="lat">
              <strong>latitude</strong>
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
              <strong>longitude</strong>
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
      {location?.latitude && location?.longitude && (
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
              lat: DEFAULT_CENTER.latitude,
              lng: DEFAULT_CENTER.longitude,
            }}
            zoom={DEFAULT_ZOOM}
            yesIWantToUseGoogleMapApiInternals
            layerTypes={
              Object.keys(interests).includes('biking')
                ? ['BicyclingLayer']
                : []
            }
            onGoogleApiLoaded={onGoogleApiLoaded}
            options={{ mapTypeId: mapType }}
          ></GoogleMap>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
