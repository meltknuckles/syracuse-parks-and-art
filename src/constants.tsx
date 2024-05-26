import * as _ from 'lodash';

import parks from './json/parks.json';
import pools from './json/pools.json';
import centers from './json/community-centers.json';
import courts from './json/athletic-courts.json';
import art from './json/public-art.json';
import dogparks from './json/dog-parks.json';
import water from './json/water.json';
import playgrounds from './json/playgrounds.json';
import trails from './json/bike.json';

import parkMarkerIcon from './Map/icons/park.svg';
import poolMarkerIcon from './Map/icons/pool.svg';
import centerMarkerIcon from './Map/icons/center.svg';
import basketballMarkerIcon from './Map/icons/basketball.svg';
import soccerMarkerIcon from './Map/icons/soccer.svg';
import tennisMarkerIcon from './Map/icons/tennis.svg';
import dogparkMarkerIcon from './Map/icons/dog.svg';
import muralMarkerIcon from './Map/icons/mural.svg';
import sculptureMarkerIcon from './Map/icons/sculpture.svg';
import mosaicMarkerIcon from './Map/icons/mosaic.svg';
import shuffleboardMarkerIcon from './Map/icons/shuffleboard.svg';
import playgroundMarkerIcon from './Map/icons/playground.svg';
import bikingMarkerIcon from './Map/icons/biking.svg';
import walkMarkerIcon from './Map/icons/walking.svg';
import skateboardMarkerIcon from './Map/icons/skateboard.svg';
import golfMarkerIcon from './Map/icons/golf.svg';
import baseballMarkerIcon from './Map/icons/baseball.svg';
import iceskateMarkerIcon from './Map/icons/iceskate.svg';
import waterMarkerIcon from './Map/icons/water.svg';

import parkIcon from './ListView/icons/park.svg';
import poolIcon from './ListView/icons/pool.svg';
import centerIcon from './ListView/icons/center.svg';
import basketballIcon from './ListView/icons/basketball.svg';
import soccerIcon from './ListView/icons/soccer.svg';
import tennisIcon from './ListView/icons/tennis.svg';
import dogparkIcon from './ListView/icons/dogpark.svg';
import artIcon from './ListView/icons/art.svg';
import muralIcon from './ListView/icons/mural.svg';
import sculptureIcon from './ListView/icons/sculpture.svg';
import mosaicIcon from './ListView/icons/mosaic.svg';
import shuffleboardIcon from './ListView/icons/shuffleboard.svg';
import playgroundIcon from './ListView/icons/playground.svg';
import walkIcon from './ListView/icons/walk.svg';
import bikingIcon from './ListView/icons/biking.svg';
import skateboardIcon from './ListView/icons/skateboard.svg';
import golfIcon from './ListView/icons/golf.svg';
import baseballIcon from './ListView/icons/baseball.svg';
import iceskateIcon from './ListView/icons/iceskate.svg';
import waterIcon from './ListView/icons/water.svg';

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
  water = 'Water Feature',
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
  {
    type: string;
    group: string;
    data: any;
    icon?: any;
    markerIcon: any;
    interest: DataTypes[];
    color: string;
  }
> = {
  park: {
    type: 'park',
    data: _.orderBy(
      parks.map((d) => ({ ...d, type: 'park' })),
      'name',
    ),
    icon: parkIcon,
    group: 'park',
    markerIcon: parkMarkerIcon,
    interest: [DataTypes.park],
    color: Colors.green,
  },
  pool: {
    type: 'pool',
    data: pools.features.map((d) => ({ ...d, type: 'pool' })),
    icon: poolIcon,
    group: 'park',
    markerIcon: poolMarkerIcon,
    interest: [DataTypes.pool],
    color: Colors.green,
  },
  center: {
    type: 'center',
    data: centers.features.map((d) => ({ ...d, type: 'center' })),
    icon: centerIcon,
    group: 'park',
    markerIcon: centerMarkerIcon,
    interest: [DataTypes.center],
    color: Colors.green,
  },
  art: {
    type: 'art',
    data: art.features,
    icon: artIcon,
    markerIcon: artIcon,
    group: 'art',
    interest: [DataTypes.art],
    color: Colors.red,
  },
  mural: {
    type: 'mural',
    data: art.features
      .filter(({ properties }: any) => properties.type.includes('Mural'))
      .map((d) => ({ ...d, type: 'mural' })),
    icon: muralIcon,
    markerIcon: muralMarkerIcon,
    group: 'art',
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
    group: 'sports',
    markerIcon: basketballMarkerIcon,
    interest: [DataTypes.basketball, DataTypes.sports],
    color: Colors.blue,
  },
  dogpark: {
    type: 'dogpark',
    data: dogparks.map((d) => ({ ...d, type: 'dogpark' })),
    icon: dogparkIcon,
    group: 'park',
    markerIcon: dogparkMarkerIcon,
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
    group: 'sports',
    markerIcon: tennisMarkerIcon,
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
    group: 'art',
    markerIcon: sculptureMarkerIcon,
    interest: [DataTypes.sculpture, DataTypes.art],
    color: Colors.red,
  },
  mosaic: {
    type: 'mosaic',
    data: art.features
      .filter(({ properties }: any) => properties.type?.includes('Mosaic'))
      .map((d) => ({ ...d, type: 'mosaic' })),
    icon: mosaicIcon,
    group: 'art',
    markerIcon: mosaicMarkerIcon,
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
    group: 'sports',
    markerIcon: shuffleboardMarkerIcon,
    interest: [DataTypes.shuffleboard, DataTypes.sports],
    color: Colors.blue,
  },
  playground: {
    type: 'playground',
    data: playgrounds.map((d) => ({ ...d, type: 'playground' })),
    icon: playgroundIcon,
    group: 'park',
    markerIcon: playgroundMarkerIcon,
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
    group: 'park',
    markerIcon: bikingMarkerIcon,
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
    group: 'sports',
    markerIcon: soccerMarkerIcon,
    interest: [DataTypes.soccer, DataTypes.sports],
    color: Colors.blue,
  },
  walking: {
    type: 'walking',
    data: trails,
    icon: walkIcon,
    group: 'parl',
    markerIcon: walkMarkerIcon,
    interest: [DataTypes.walking],
    color: Colors.green,
  },
  skateboard: {
    type: 'skateboard',
    data: courts.features
      .filter(({ properties }: any) => properties.type?.includes('Skate'))
      .map((d) => ({ ...d, type: 'skateboard' })),
    icon: skateboardIcon,
    group: 'sports',
    markerIcon: skateboardMarkerIcon,
    interest: [DataTypes.skateboard, DataTypes.sports],
    color: Colors.blue,
  },
  golf: {
    type: 'golf',
    data: courts.features
      .filter(({ properties }: any) => properties.type?.includes('Golf'))
      .map((d) => ({ ...d, type: 'golf' })),
    icon: golfIcon,
    group: 'sports',
    markerIcon: golfMarkerIcon,
    interest: [DataTypes.golf, DataTypes.sports],
    color: Colors.blue,
  },
  iceskate: {
    type: 'iceskate',
    data: courts.features
      .filter(({ properties }: any) => properties.type?.includes('Ice Rink'))
      .map((d) => ({ ...d, type: 'iceskate' })),
    icon: iceskateIcon,
    markerIcon: iceskateMarkerIcon,
    group: 'sports',
    interest: [DataTypes.iceskate, DataTypes.sports],
    color: Colors.blue,
  },
  baseball: {
    type: 'baseball',
    data: courts.features
      .filter(({ properties }: any) => properties.type?.includes('Baseball'))
      .map((d) => ({ ...d, type: 'baseball' })),
    icon: baseballIcon,
    group: 'sports',
    markerIcon: baseballMarkerIcon,
    interest: [DataTypes.baseball, DataTypes.sports],
    color: Colors.blue,
  },
  water: {
    type: 'water',
    data: water.map((d) => ({ ...d, type: 'water' })),
    icon: waterIcon,
    group: 'park',
    markerIcon: waterMarkerIcon,
    interest: [DataTypes.water, DataTypes.park],
    color: Colors.green,
  },
};

export const SUB_PARK_DATA_ORDER = [
  DATA.center,
  DATA.dogpark,
  DATA.playground,
  DATA.water,
  DATA.pool,
  DATA.basketball,
  DATA.tennis,
  DATA.golf,
  DATA.baseball,
  DATA.soccer,
  DATA.iceskate,
  DATA.skateboard,
  DATA.biking,
  DATA.shuffleboard,
  DATA.mural,
  DATA.mosaic,
  DATA.sculpture,
];

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
      DATA.water,
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
