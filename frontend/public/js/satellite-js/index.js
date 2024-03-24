import * as constants from './constants';

import { jday, invjday } from './ext';
import twoline2satrec from './io';
import { propagate, sgp4, gstime } from './propagation';

import dopplerFactor from './dopplerFactor';

import {
  degreesLat,
  degreesLong,
  geodeticToEcf,
  eciToGeodetic,
  eciToEcf,
  ecfToEci,
  ecfToLookAngles,
} from './transforms';

const gstimeFromJday = (...args) => {
  console.warn('gstimeFromJday is deprecated, use gstime instead.'); // eslint-disable-line no-console
  return gstime(...args);
};

const gstimeFromDate = (...args) => {
  console.warn('gstimeFromDate is deprecated, use gstime instead.'); // eslint-disable-line no-console
  return gstime(...args);
};

export {
  constants,

  // Propagation
  propagate,
  sgp4,
  twoline2satrec,

  gstime,
  gstimeFromJday,
  gstimeFromDate,
  jday,
  invjday,

  dopplerFactor,

  // Coordinate transforms
  degreesLat,
  degreesLong,
  geodeticToEcf,
  eciToGeodetic,
  eciToEcf,
  ecfToEci,
  ecfToLookAngles,
};
