import parks from './json/parks.json';
import pools from './json/pools.json';
import centers from './json/community-centers.json';
import courts from './json/athletic-courts.json';
import art from './json/public-art.json';
import dogparks from './json/dog-parks.json';
import playgrounds from './json/playgrounds.json';
import trails from './json/bike.json';

import parkIcon from './Map/icons/park.svg';
import poolIcon from './Map/icons/pool.svg';
import centerIcon from './Map/icons/center.svg';
import basketballIcon from './Map/icons/basketball.svg';
import soccerIcon from './Map/icons/soccer.svg';
import tennisIcon from './Map/icons/tennis.svg';
import dogparkIcon from './Map/icons/dog.svg';
import artIcon from './Map/icons/mural.svg';
import sculptureIcon from './Map/icons/sculpture.svg';
import mosaicIcon from './Map/icons/mosaic.svg';
import shuffleboardIcon from './Map/icons/shuffleboard.svg';
import playgroundIcon from './Map/icons/playground.svg';
import bikingIcon from './Map/icons/biking.svg';
import walkIcon from './Map/icons/walking.svg';
import skateboardIcon from './Map/icons/skateboard.svg';
import golfIcon from './Map/icons/golf.svg';
import baseballIcon from './Map/icons/baseball.svg';
import iceskateIcon from './Map/icons/iceskate.svg';

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
  walking = 'Trails',
  soccer = 'Soccer',
  biking = 'Biking',
  skateboard = 'Skateboarding',
  iceskate = 'Ice Skating',
  golf = 'Golf',
  baseball = 'Baseball',
}

export enum Colors {
  red = '#FF595E',
  yellow = '#FFCA3A',
  blue = '#1982C4',
  lgreen = '#8ac926',
  green = '#6da317',
  purple = '#6A4C93',
}

export const DATA: Record<
  string,
  { type: string; data: any; icon: any; interest: DataTypes[]; color: string }
> = {
  park: {
    type: 'park',
    data: parks.map((d) => ({ ...d, type: 'park' })),
    icon: parkIcon,
    interest: [DataTypes.park],
    color: Colors.green,
  },
  pool: {
    type: 'pool',
    data: pools.features.map((d) => ({ ...d, type: 'pool' })),
    icon: poolIcon,
    interest: [DataTypes.pool],
    color: Colors.green,
  },
  center: {
    type: 'center',
    data: centers.features.map((d) => ({ ...d, type: 'center' })),
    icon: centerIcon,
    interest: [DataTypes.center],
    color: Colors.green,
  },
  art: {
    type: 'art',
    data: art.features,
    icon: artIcon,
    interest: [DataTypes.art],
    color: Colors.red,
  },
  mural: {
    type: 'mural',
    data: art.features
      .filter(({ properties }: any) => properties.type.includes('Mural'))
      .map((d) => ({ ...d, type: 'mural' })),
    icon: artIcon,
    interest: [DataTypes.mural, DataTypes.art],
    color: Colors.red,
  },
  basketball: {
    type: 'basketball',
    data: courts.features
      .filter(({ properties }: any) =>
        properties.COURT_TYPE?.includes('Basketball'),
      )
      .map((d) => ({ ...d, type: 'basketball' })),
    icon: basketballIcon,
    interest: [DataTypes.basketball, DataTypes.sports],
    color: Colors.blue,
  },
  dogpark: {
    type: 'dogpark',
    data: dogparks.map((d) => ({ ...d, type: 'dogpark' })),
    icon: dogparkIcon,
    interest: [DataTypes.dogpark, DataTypes.park],
    color: Colors.green,
  },
  tennis: {
    type: 'tennis',
    data: courts.features
      .filter(({ properties }: any) =>
        properties.COURT_TYPE?.includes('Tennis'),
      )
      .map((d) => ({ ...d, type: 'tennis' })),
    icon: tennisIcon,
    interest: [DataTypes.tennis, DataTypes.sports],
    color: Colors.blue,
  },
  sculpture: {
    type: 'sculpture',
    data: art.features
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
    data: art.features
      .filter(({ properties }: any) => properties.type?.includes('Mosaic'))
      .map((d) => ({ ...d, type: 'mosaic' })),
    icon: mosaicIcon,
    interest: [DataTypes.mosaic, DataTypes.art],
    color: Colors.red,
  },
  shuffleboard: {
    type: 'shuffleboard',
    data: courts.features
      .filter(({ properties }: any) =>
        properties.COURT_TYPE?.includes('Shuffleboard'),
      )
      .map((d) => ({ ...d, type: 'shuffleboard' })),
    icon: shuffleboardIcon,
    interest: [DataTypes.shuffleboard, DataTypes.sports],
    color: Colors.blue,
  },
  playground: {
    type: 'playground',
    data: playgrounds.map((d) => ({ ...d, type: 'playground' })),
    icon: playgroundIcon,
    interest: [DataTypes.playground, DataTypes.park],
    color: Colors.green,
  },
  biking: {
    type: 'biking',
    data: courts.features
      .filter(
        ({ properties }: any) =>
          properties.COURT_TYPE?.includes('Cycle') ||
          properties.type?.includes('BMX'),
      )
      .map((d) => ({ ...d, type: 'biking' })),
    icon: bikingIcon,
    interest: [DataTypes.biking, DataTypes.sports],
    color: Colors.green,
  },
  soccer: {
    type: 'soccer',
    data: courts.features
      .filter(({ properties }: any) =>
        properties.COURT_TYPE?.includes('Soccer'),
      )
      .map((d) => ({ ...d, type: 'soccer' })),
    icon: soccerIcon,
    interest: [DataTypes.soccer, DataTypes.sports],
    color: Colors.blue,
  },
  walking: {
    type: 'walking',
    data: trails,
    icon: walkIcon,
    interest: [DataTypes.walking],
    color: Colors.green,
  },
  skateboard: {
    type: 'skateboard',
    data: courts.features
      .filter(({ properties }: any) => properties.type?.includes('Skate'))
      .map((d) => ({ ...d, type: 'skateboard' })),
    icon: skateboardIcon,
    interest: [DataTypes.skateboard, DataTypes.sports],
    color: Colors.blue,
  },
  golf: {
    type: 'golf',
    data: courts.features
      .filter(({ properties }: any) => properties.type?.includes('Golf'))
      .map((d) => ({ ...d, type: 'golf' })),
    icon: golfIcon,
    interest: [DataTypes.golf, DataTypes.sports],
    color: Colors.blue,
  },
  iceskate: {
    type: 'iceskate',
    data: courts.features
      .filter(({ properties }: any) => properties.type?.includes('Ice Rink'))
      .map((d) => ({ ...d, type: 'iceskate' })),
    icon: iceskateIcon,
    interest: [DataTypes.iceskate, DataTypes.sports],
    color: Colors.blue,
  },
  baseball: {
    type: 'baseball',
    data: courts.features
      .filter(({ properties }: any) => properties.type?.includes('Baseball'))
      .map((d) => ({ ...d, type: 'baseball' })),
    icon: baseballIcon,
    interest: [DataTypes.baseball, DataTypes.sports],
    color: Colors.blue,
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
      DATA.biking,
      DATA.pool,
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
    icon: (
      <img src={basketballIcon} style={{ width: ICON_SIZE, marginRight: 6 }} />
    ),
    color: Colors.blue,
    children: [
      DATA.basketball,
      DATA.tennis,
      DATA.soccer,
      DATA.shuffleboard,
      DATA.golf,
      DATA.baseball,
      DATA.skateboard,
      DATA.iceskate,
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
