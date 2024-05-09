import { useEffect, useState } from 'react';
import './App.css';
import { useGeolocated } from 'react-geolocated';
import MapContainer from './Map/Map';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as _ from 'lodash';
import { Galleria } from 'primereact/galleria';

const generateMapsLink = (address: string, directions = false) => {
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = directions
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
    : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  return googleMapsUrl;
};

function App() {
  const [location, setLocation] = useState<{
    latitude: any;
    longitude: any;
  } | null>({
    latitude: null,
    longitude: null,
  });

  const [selectedMarker, setSelectedMarker] = useState<any>();
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
  const kvPairs = selectedMarker?.data
    ? Object.keys(selectedMarker.data)
        .filter((l) => l !== '_labels')
        .map((key) => ({
          key: Object.keys(selectedMarker.data._labels).includes(key)
            ? selectedMarker.data._labels[key]
            : _.startCase(key),
          value: selectedMarker.data[key],
        }))
    : [];

  const itemTemplate = (item: any) => {
    return (
      <img src={item} alt={selectedMarker.title} style={{ width: '100%' }} />
    );
  };
  const thumbnailTemplate = (item: any) => {
    return <img src={item} alt={selectedMarker.title} style={{ height: 70 }} />;
  };

  return (
    <div className="grid">
      <div className="col-4" style={{ padding: 32, paddingTop: 0 }}>
        {selectedMarker && (
          <div>
            <h2>{selectedMarker.title}</h2>
            {selectedMarker?.gallery && (
              <div>
                <Galleria
                  value={Array(selectedMarker?.gallery.count)
                    .fill('')
                    .map(
                      (_g, idx) =>
                        `/parks/${selectedMarker?.gallery.folder}/${_.padStart((idx + 1).toString(), 2, '0')}.jpg`,
                    )}
                  numVisible={4}
                  style={{ width: '100%' }}
                  item={itemTemplate}
                  thumbnail={thumbnailTemplate}
                />
              </div>
            )}
            <div style={{ paddingTop: 16 }}>
              {selectedMarker.address && (
                <a
                  href={generateMapsLink(selectedMarker.address)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedMarker.address}
                </a>
              )}
              {selectedMarker.description && (
                <p style={{ textAlign: 'left' }}>
                  {selectedMarker.description}
                </p>
              )}
            </div>
            {selectedMarker.data && (
              <div>
                <DataTable stripedRows value={kvPairs} className="info-table">
                  <Column field="key" header=""></Column>
                  <Column field="value" header=""></Column>
                </DataTable>
              </div>
            )}
          </div>
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
        />
      </div>
    </div>
  );
}

export default App;
