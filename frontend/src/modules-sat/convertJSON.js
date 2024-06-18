/**
 * ---------------------------------------------------------------------
 *
 * This module is responsible for converting JSON into text messages
 * for use with the 'satellite-position.js'
 *
 * ---------------------------------------------------------------------
 */

import { day_of_year, day_fract_part } from './time.js'

/**
 * Creating String message for satellite-position.js
 *
 * @param {JSON} orbit
 * @returns
 */
export function convertJSON (orbit) {
  // Create message and first line
  let tle_message = '1'

  const satellite_number = orbit.NORAD_CAT_ID
  const classification = orbit.CLASSIFICATION_TYPE
  tle_message += ` ${satellite_number}${classification}`

  const int_des_1part = orbit.OBJECT_ID.split('-')[0].slice(-2)
  const int_des_2part = orbit.OBJECT_ID.split('-')[1].slice(0, 3)
  const int_des_3part = orbit.OBJECT_ID.split('-')[1].slice(3)
  tle_message += ` ${int_des_1part.padEnd(
    2
  )}${int_des_2part}${int_des_3part.padEnd(3, ' ')}`

  const epoch_year = new Date(orbit.EPOCH).getFullYear()
  const epoch_day = day_of_year(orbit.EPOCH) + day_fract_part(orbit.EPOCH)
  const epoch = (epoch_year - 2000) * 1000 + epoch_day
  tle_message += ` ${String(epoch).padStart(14, '0')}`

  const mm_dot = orbit.MEAN_MOTION_DOT
  let mm_dot_sign = '-'
  if (mm_dot >= 0.0) {
    mm_dot_sign = ' '
  }
  const numb = mm_dot * Math.sign(mm_dot)
  tle_message += ` ${mm_dot_sign}.${numb.toFixed(8).slice(-8)}`

  const mm_ddot = ' 00000+0'
  tle_message += ` ${mm_ddot}`

  const bstar = ' 00000+0'
  tle_message += ` ${bstar}`

  const ephemeris = orbit.EPHEMERIS_TYPE
  tle_message += ` ${ephemeris}`

  const element = orbit.ELEMENT_SET_NO
  tle_message += `  ${element}`

  const checksum = '3'
  tle_message += `${checksum}`

  // Second line
  tle_message += '\n'
  tle_message += `2 ${satellite_number}`

  const incli = orbit.INCLINATION
  const incli_int = Math.floor(incli)
  const incli_flo = (incli - incli_int).toFixed(4)
  tle_message += ` ${String(incli_int).padStart(3, ' ')}.${incli_flo.slice(-4)}`

  const ra = orbit.RA_OF_ASC_NODE
  const ra_int = Math.floor(ra)
  const ra_flo = (ra - ra_int).toFixed(4)
  tle_message += ` ${String(ra_int).padStart(3, ' ')}.${ra_flo.slice(-4)}`

  const ecc = orbit.ECCENTRICITY.toFixed(7)
  tle_message += ` ${String(ecc).slice(-7)}`

  const arg_perigee = orbit.ARG_OF_PERICENTER
  const arg_perigee_int = Math.floor(arg_perigee)
  const arg_perigee_flo = (arg_perigee - arg_perigee_int).toFixed(4)
  tle_message += ` ${String(arg_perigee_int).padStart(
    3,
    ' '
  )}.${arg_perigee_flo.slice(-4)}`

  const m_anomaly = orbit.MEAN_ANOMALY
  const m_anomaly_int = Math.floor(m_anomaly)
  const m_anomaly_flo = (m_anomaly - m_anomaly_int).toFixed(4)
  tle_message += ` ${String(m_anomaly_int).padStart(
    3,
    ' '
  )}.${m_anomaly_flo.slice(-4)}`

  const mm = orbit.MEAN_MOTION
  const mm_int = Math.floor(mm)
  const mm_flo = (mm - mm_int).toFixed(8)
  tle_message += ` ${String(mm_int).padStart(2, ' ')}.${mm_flo.slice(-8)}`

  const rev = orbit.REV_AT_EPOCH
  tle_message += `${String(rev).padStart(5, ' ')}`

  tle_message += `${checksum}`

  return tle_message
}
