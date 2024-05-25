import { Button } from 'primereact/button';
import { DATA, DataTypes } from '../constants';
import { getFieldData } from '../utils/getFieldData';
import { Card } from 'primereact/card';
import { DEFAULT_ZOOM_IN } from '../Map/Map';

export const ListView = ({
  map,
  setSelectedMarker,
  scrollToRef,
  zoom,
}: any) => {
  return (
    <div style={{ textAlign: 'left', padding: 12, marginTop: -16 }}>
      <Card>
        <h2>Parks</h2>
        <ul className="listview">
          {DATA.park.data
            .sort((a: any, b: any) => a.name - b.name)
            .map((data: any) => {
              const { name, latitude, longitude } = data;
              return (
                <li key={name}>
                  <Button
                    style={{ width: '100%', textAlign: 'left' }}
                    text
                    label={name}
                    onClick={() => {
                      if (zoom < DEFAULT_ZOOM_IN) {
                        map.setZoom(DEFAULT_ZOOM_IN);
                      }
                      map.panTo({ lat: latitude, lng: longitude });
                      setSelectedMarker({
                        ...data,
                        data: getFieldData(data, DataTypes.park),
                        type: 'park',
                        title: data.name,
                        icon: null,
                        lat: data.latitude,
                        lng: data.longitude,
                        category: data.type,
                      });
                      scrollToRef();
                    }}
                  ></Button>
                </li>
              );
            })}
        </ul>
      </Card>
    </div>
  );
};
