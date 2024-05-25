import React from 'react';
import { Marker } from 'google-map-react';

const MemoizedMarker = React.memo(
  ({ lat, lng, title, icon, onClick }: any) => {
    return (
      <Marker lat={lat} lng={lng} text={title} icon={icon} onClick={onClick} />
    );
  },
  (prevProps, nextProps) => {
    // Add comparison logic here if needed. By default, it will shallow compare the props.
    return (
      prevProps.lat === nextProps.lat &&
      prevProps.lng === nextProps.lng &&
      prevProps.title === nextProps.title &&
      prevProps.icon === nextProps.icon
    );
  },
);

export default MemoizedMarker;
