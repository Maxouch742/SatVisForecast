import { DEG2PI, MAX_DISTANCE } from "./constants";

export function point_launched(coord_sta, angle){

    const point_easting = coord_sta[0] + Math.sin(angle * DEG2PI) * MAX_DISTANCE;
    const point_northing = coord_sta[1] + Math.cos(angle * DEG2PI) * MAX_DISTANCE;

    return [point_easting, point_northing];
}