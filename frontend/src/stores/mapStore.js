// store/mapStore.js
import { defineStore } from 'pinia';
import { boundingExtent, buffer } from 'ol/extent';
import { View } from 'ol';

// handle things to do with the map ! 
export const useMapStore = defineStore('map', {
  state: () => ({
    map: null,
    addLineLayer: null, 
  }),
  actions: {

    // init the map
    setMap(mapInstance) {
      this.map = mapInstance;
    },

    // adding the methods (to get them accessible from everywhere)
    setAddLineLayerMethod(method) {
      this.addLineLayer = method;
    },
    setClearMapLayers(clearLayersFunction) {
      this.clearMapLayers = clearLayersFunction;
    },

    // set the invoking methods (to really DO the things)
    invokeAddLineLayer(coordinates) {
      if (this.addLineLayer) {
        this.addLineLayer(coordinates);
      } else {
        console.error('addLineLayer method is not set.');
      }
    },

    invokeClearMapLayers() {
      if (this.addLineLayer) {
        this.clearMapLayers();
      } else {
        console.error('clearMapLayers method is not set.');
      }
    },

    invokeZoomExtend(coordinates) {
      const extentProject = boundingExtent(coordinates);
      const bufferProject = buffer(extentProject, 75);
      this.map.setView(new View({
        extent: bufferProject
      }))
    },
  }
});