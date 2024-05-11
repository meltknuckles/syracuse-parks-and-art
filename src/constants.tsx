import parkdata from './json/parks.json';
import pooldata from './json/pools.json';
import centerdata from './json/community-centers.json';
import courtdata from './json/athletic-courts.json';
import artdata from './json/public-art.json';
import dogparkdata from './json/dog-parks.json';
import playgrounddata from './json/playgrounds.json';
import trailsAndLanes from './json/bike.json';

import parkIcon from './Map/icons/park.svg';
import poolIcon from './Map/icons/pool.svg';
import centerIcon from './Map/icons/center.svg';
import bbIcon from './Map/icons/basketball.svg';
import soccerIcon from './Map/icons/soccer.svg';
import tennisIcon from './Map/icons/tennis.svg';
import dogIcon from './Map/icons/dog.svg';
import artIcon from './Map/icons/mural.svg';
import sculptureIcon from './Map/icons/sculpture.svg';
import mosaicIcon from './Map/icons/mosaic.svg';
import shuffleboardIcon from './Map/icons/shuffleboard.svg';
import playgroundIcon from './Map/icons/playground.svg';
import bikeIcon from './Map/icons/biking.svg';

export const ICON_SIZE = 20;

export enum DataTypes {
  park = 'Parks',
  pool = 'Swimming',
  center = 'Community Centers',
  mural = 'Murals',
  dogpark = 'Dog Parks',
  basketball = 'Basketball',
  tennis = 'Tennis',
  sculpture = 'Sculptures',
  mosaic = 'Mosaic',
  art = 'Public Art',
  sports = 'Sports',
  shuffleboard = 'Shuffleboard',
  playground = 'Playgrounds',
  walking = 'Walking',
  soccer = 'Soccer',
  biking = 'Biking',
}

export enum Colors {
  red = '#FF595E',
  blue = '#1982C4',
  green = '#6da317',
}

export const DATA: Record<
  string,
  { type: string; data: any; icon: any; interest: DataTypes[]; color: string }
> = {
  park: {
    type: 'park',
    data: parkdata.map((d) => ({ ...d, type: 'park' })),
    icon: parkIcon,
    interest: [DataTypes.park],
    color: Colors.green,
  },
  pool: {
    type: 'pool',
    data: pooldata.features.map((d) => ({ ...d, type: 'pool' })),
    icon: poolIcon,
    interest: [DataTypes.pool],
    color: Colors.blue,
  },
  center: {
    type: 'center',
    data: centerdata.features.map((d) => ({ ...d, type: 'center' })),
    icon: centerIcon,
    interest: [DataTypes.center],
    color: Colors.green,
  },
  mural: {
    type: 'mural',
    data: artdata.features
      .filter(({ properties }: any) => properties.type.includes('Mural'))
      .map((d) => ({ ...d, type: 'mural' })),
    icon: artIcon,
    interest: [DataTypes.mural, DataTypes.art],
    color: Colors.red,
  },
  basketball: {
    type: 'basketball',
    data: courtdata.features
      .filter(({ properties }: any) =>
        properties.COURT_TYPE.includes('Basketball'),
      )
      .map((d) => ({ ...d, type: 'basketball' })),
    icon: bbIcon,
    interest: [DataTypes.basketball, DataTypes.sports],
    color: Colors.blue,
  },
  dogpark: {
    type: 'dogpark',
    data: dogparkdata.map((d) => ({ ...d, type: 'dogpark' })),
    icon: dogIcon,
    interest: [DataTypes.dogpark, DataTypes.park],
    color: Colors.green,
  },
  tennis: {
    type: 'tennis',
    data: courtdata.features
      .filter(({ properties }: any) => properties.COURT_TYPE.includes('Tennis'))
      .map((d) => ({ ...d, type: 'tennis' })),
    icon: tennisIcon,
    interest: [DataTypes.tennis, DataTypes.sports],
    color: Colors.blue,
  },
  sculpture: {
    type: 'sculpture',
    data: artdata.features
      .filter(
        ({ properties }: any) =>
          properties.type.includes('Sculpture') ||
          properties.type.includes('Monument'),
      )
      .map((d) => ({ ...d, type: 'sculpture' })),
    icon: sculptureIcon,
    interest: [DataTypes.sculpture, DataTypes.art],
    color: Colors.red,
  },
  mosaic: {
    type: 'mosaic',
    data: artdata.features
      .filter(({ properties }: any) => properties.type.includes('Mosaic'))
      .map((d) => ({ ...d, type: 'mosaic' })),
    icon: mosaicIcon,
    interest: [DataTypes.mosaic, DataTypes.art],
    color: Colors.red,
  },
  shuffleboard: {
    type: 'shuffleboard',
    data: courtdata.features
      .filter(({ properties }: any) =>
        properties.COURT_TYPE.includes('Shuffleboard'),
      )
      .map((d) => ({ ...d, type: 'shuffleboard' })),
    icon: shuffleboardIcon,
    interest: [DataTypes.shuffleboard, DataTypes.sports],
    color: Colors.blue,
  },
  playground: {
    type: 'playground',
    data: playgrounddata.map((d) => ({ ...d, type: 'playground' })),
    icon: playgroundIcon,
    interest: [DataTypes.playground, DataTypes.park],
    color: Colors.green,
  },
  biking: {
    type: 'biking',
    data: courtdata.features
      .filter(({ properties }: any) => properties.COURT_TYPE.includes('Cycle'))
      .map((d) => ({ ...d, type: 'biking' })),
    icon: bikeIcon,
    interest: [DataTypes.biking, DataTypes.sports],
    color: Colors.blue,
  },
  soccer: {
    type: 'soccer',
    data: courtdata.features
      .filter(({ properties }: any) => properties.COURT_TYPE.includes('Futsal'))
      .map((d) => ({ ...d, type: 'soccer' })),
    icon: soccerIcon,
    interest: [DataTypes.soccer, DataTypes.sports],
    color: Colors.blue,
  },
  walking: {
    type: 'walking',
    data: trailsAndLanes,
    icon: parkIcon, // TODO: walk icon
    interest: [DataTypes.walking],
    color: Colors.green,
  },
};

export const TREE_NODE_DATA = [
  {
    label: 'Parks and Recreation',
    key: 'parksandrec',
    icon: <img src={parkIcon} style={{ width: ICON_SIZE, marginRight: 6 }} />,
    color: Colors.green,
    children: [
      DATA.park,
      DATA.walking,
      DATA.dogpark,
      DATA.playground,
      DATA.center,
    ].map(({ type, data, icon, interest, color }) => ({
      key: type,
      label: interest[0],
      data,
      icon: <img src={icon} style={{ width: ICON_SIZE, marginRight: 6 }} />,
      color,
    })),
  },
  {
    label: 'Sports',
    key: 'sports',
    icon: <img src={bbIcon} style={{ width: ICON_SIZE, marginRight: 6 }} />,
    color: Colors.blue,
    children: [
      DATA.basketball,
      DATA.tennis,
      DATA.soccer,
      DATA.biking,
      DATA.shuffleboard,
      DATA.pool,
    ].map(({ type, data, icon, interest, color }) => ({
      key: type,
      label: interest[0],
      data,
      icon: <img src={icon} style={{ width: ICON_SIZE, marginRight: 6 }} />,
      color,
    })),
  },
  {
    label: 'Public Art',
    key: 'art',
    icon: <img src={artIcon} style={{ width: ICON_SIZE, marginRight: 6 }} />,
    color: Colors.red,
    children: [DATA.mural, DATA.sculpture, DATA.mosaic].map(
      ({ type, data, icon, interest, color }) => ({
        key: type,
        label: interest[0],
        data,
        icon: <img src={icon} style={{ width: ICON_SIZE, marginRight: 6 }} />,
        color,
      }),
    ),
  },
];
