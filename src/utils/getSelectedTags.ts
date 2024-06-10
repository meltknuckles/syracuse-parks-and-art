import { FaParking } from 'react-icons/fa';
import { GiKidSlide } from 'react-icons/gi';
import { MdAccessible, MdSportsBasketball } from 'react-icons/md';
import { Colors } from '../constants';

export const getSelectedTags = (selectedMarker: any) => {
  const selectedtags = [];
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
  return selectedtags;
};
