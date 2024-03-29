// store/coordinatesStore.js
import { defineStore } from 'pinia';

// handle global event of click on the map 
export const useCoordinatesStore = defineStore('coordinates', {
  state: () => ({
    easting: 2600000.0,
    northing: 1200000.0
  }),
  actions: {
    // triggered when map is clicked
    updateCoordinates(easting, northing) { 
      this.easting = easting;
      this.northing = northing;
    }
  }
});