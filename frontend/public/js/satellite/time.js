/**
 * ---------------------------------------------------------------------
 * 
 * This module is responsible for time calculation operations.
 * 
 * ---------------------------------------------------------------------
 */

/**
 * Compute the number of day in year
 * 
 * @param {String} date 
 * @returns 
 */
export function day_of_year(date){

    const date_obj = new Date(date);

    // Create day 1 of the year
    const date_start = new Date(date_obj.getFullYear(), 0, 0);
    
    const diff = date_obj - date_start;
    const day_one = 1000 * 60 * 60 * 24;
    const day_of_year = Math.floor(diff / day_one);

    return day_of_year
}

/**
 * Compute fractionnal part of a day
 * 
 * @param {String} date 
 * @returns 
 */
export function day_fract_part(date){

    const date_obj = new Date(date);
    const hours = date_obj.getHours();
    const minutes = date_obj.getMinutes();
    const secondes = date_obj.getSeconds();
    const millisecondes = date_obj.getMilliseconds();
    let day_fractionnal = (hours * 3600 + minutes * 60 + secondes + millisecondes / 1000) / 86400;

    day_fractionnal = parseFloat(day_fractionnal.toFixed(8));
    
    return day_fractionnal
}