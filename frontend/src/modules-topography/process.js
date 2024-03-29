import { request_profile } from "./api";
import { elevation, elevation_max, point_launched } from "./compute";

export function process(coord_start, height_instrument){

    const tabpromise = [];

    // Iteration, on angles from 0 to 359
    for (let i=0; i<360; i++){

        const coord_end = point_launched(coord_start, i);
        const profile = request_profile(coord_start, coord_end);
        tabpromise.push(profile);
    }

    ok = Promise.all(tabpromise).then(results => {
        data = elevation(results);
        mask = elevation_max(data);
        return mask
    });
    console.log("OKOKOKOK", ok)
}