import { Button } from 'primereact/button';
import { FaLocationCrosshairs } from 'react-icons/fa6';

export const RecenterButton = (
  { mobile, onClick }: { mobile?: boolean; onClick: any } = {
    mobile: false,
    onClick: null,
  },
) => {
  if (mobile) {
    return (
      <Button
        className="recenter-button"
        rounded
        icon={<FaLocationCrosshairs />}
        onClick={onClick}
        severity="secondary"
      ></Button>
    );
  }
  return (
    <Button
      label="Re-center Map"
      rounded
      icon={<FaLocationCrosshairs style={{ marginRight: 6 }} />}
      severity="secondary"
      style={{ marginRight: 12, padding: '2px 16px' }}
    ></Button>
  );
};
