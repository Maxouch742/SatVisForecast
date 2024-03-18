/**
 * 
 * 
 * @param {String} date "18.03.2024 09:00"
 * @returns 
 */
export function date_parsed(date){

    const data1 = date.split(' ');
    const data2 = data1[0].split('.');
    const data3 = data1[1].split(':');

    const year = + data2[2];
    const month = + data2[1];
    const day = + data2[0];
    const hours = + data3[0];
    const minutes = + data3[1];

    return [year, month, day, hours, minutes]
}

export function days2mdhms(year, days){
    /* -----------------------------------------------------------------------------
    *
    *                           procedure days2mdhms
    *
    *  this procedure converts the day of the year, days, to the equivalent month
    *    day, hour, minute and second.
    *
    *  algorithm     : set up array for the number of days per month
    *                  find leap year - use 1900 because 2000 is a leap year
    *                  loop through a temp value while the value is < the days
    *                  perform int conversions to the correct day and month
    *                  convert remainder into h m s using type conversions
    *
    *  author        : david vallado                  719-573-2600    1 mar 2001
    *
    *  inputs          description                    range / units
    *    year        - year                           1900 .. 2100
    *    days        - julian day of the year         0.0  .. 366.0
    *
    *  outputs       :
    *    mon         - month                          1 .. 12
    *    day         - day                            1 .. 28,29,30,31
    *    hr          - hour                           0 .. 23
    *    min         - minute                         0 .. 59
    *    sec         - second                         0.0 .. 59.999
    *
    *  locals        :
    *    dayofyr     - day of year
    *    temp        - temporary extended values
    *    inttemp     - temporary int value
    *    i           - index
    *    lmonth[12]  - int array containing the number of days per month
    *
    *  coupling      :
    *    none.
    * --------------------------------------------------------------------------- */
    'use strict';
    var lmonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var dayofyr = Math.floor(days);
    //  ----------------- find month and day of month ----------------
    if ((year % 4) === 0){
       lmonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }

    var i = 1;
    var inttemp = 0;
    while ((dayofyr > (inttemp + lmonth[i-1])) && i < 12) {
        inttemp = inttemp + lmonth[i-1];
        i += 1;
    }
    var mon = i;
    var day = dayofyr - inttemp;

    //  ----------------- find hours minutes and seconds -------------
    var temp = (days - dayofyr) * 24.0;
    var hr   = Math.floor(temp);
    temp = (temp - hr) * 60.0;
    var minute  = Math.floor(temp);
    var sec  = (temp - minute) * 60.0;

    var mdhms_result = {
        mon : mon,
        day : day,
        hr : hr,
        minute : minute,
        sec : sec
    };

    return mdhms_result;
}

export function jday(year, mon, day, hr, minute, sec){
    'use strict';
    return (367.0 * year -
          Math.floor((7 * (year + Math.floor((mon + 9) / 12.0))) * 0.25) +
          Math.floor( 275 * mon / 9.0 ) +
          day + 1721013.5 +
          ((sec / 60.0 + minute) / 60.0 + hr) / 24.0  //  ut in days
          );
}

/**
 * Compute day of the year and fractional portion of the day
 * 
 */
export function computeDayYear(date){

    // Create object for January 1st 20XX
    const start = new Date(date.getFullYear(), 0, 0);

    // Compute difference
    const diff = date - start;

    // Transform for day of year
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Get the fractional portion of the day
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    const fractionalDay = (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400;
    
    return dayOfYear + fractionalDay
}

