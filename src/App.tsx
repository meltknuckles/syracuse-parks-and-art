import { useEffect, useState } from 'react';
import './App.css';
import { useGeolocated } from 'react-geolocated';
import MapContainer from './Map/Map';

function App() {
  const [location, setLocation] = useState<{
    latitude: any;
    longitude: any;
  } | null>({
    latitude: null,
    longitude: null,
  });

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
  return (
    <div className="grid">
      <div className="col-4"></div>
      <div className="col" style={{ padding: 0 }}>
        <MapContainer
          location={coords}
          setMapLocation={setLocation}
          isGeolocationAvailable={isGeolocationAvailable}
          getPosition={getPosition}
        />
      </div>
    </div>
  );
}

export default App;
