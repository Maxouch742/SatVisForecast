/**
 * ---------------------------------------------------------------------
 * 
 * This module exports string constants used throughout the application.
 * It helps to minimize the risk of type by preventing string repetition.
 * 
 * ---------------------------------------------------------------------
 */

const mu = 398600.5;            //  in km3 / s2

export const GEODESY_API = "http://geodesy.geo.admin.ch/reframe";
export const GEOADMIN_API = "https://api3.geo.admin.ch/rest/services";
export const CELESTRAK_API = "https://celestrak.org/NORAD/elements";
export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST'
  };

export const DEG2RAD = Math.PI / 180.0;
export const MINUTES_PER_DAY = 1440.0;
export const EARTH_RADIUS_KM = 6378.137;
export const XKE = 60.0 / Math.sqrt(EARTH_RADIUS_KM*EARTH_RADIUS_KM*EARTH_RADIUS_KM/mu);
export const TUMIN = 1.0 / XKE;
export const XPDOTP = 1440.0 / (2.0 * Math.PI);  //  229.1831180523293;
export const J2 = 0.00108262998905;
export const J3 = -0.00000253215306;
export const J4 = -0.00000161098761;
export const J3OJ2 = J3 / J2;
export const OPSMODE = 'i';