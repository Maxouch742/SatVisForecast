<template>
  <div ref="map-root" style="width: 100%; height: 100%"></div>
</template>
<script>

  // Let everyone in !
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import TileWMS from 'ol/source/TileWMS';
  import Overlay from 'ol/Overlay';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import LineString from 'ol/geom/LineString';
  import Feature from 'ol/Feature';
  import { Style, Stroke } from 'ol/style';
  import proj4 from 'proj4';
  import { register } from 'ol/proj/proj4';
  import { get } from 'ol/proj';
  import { useCoordinatesStore } from '@/stores/coordinatesStore';
  import { useMapStore } from '@/stores/mapStore.js';

  // define CH projection (for MN95)
  proj4.defs("EPSG:2056", "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs");
  register(proj4);

  // define WMTS of swiss national map from swisstopo
  const nationalMap = new TileLayer({
    source: new TileWMS({
      url: 'https://wms.geo.admin.ch/',
      projection: 'EPSG:2056',
      params: {
        layers: "ch.swisstopo.pixelkarte-farbe"
      },
      attributions: ["&copy; <a href=\"https://www.geo.admin.ch/fr/home.html\">WMTS national map / geo.admin.ch</a>"]
    }),
    properties: {
      isBaseLayer: true  // not to delete it
    }
  });

  export default {
    name: 'MapContainer',
    props: {
      reliefList: Object
    },
    data() {
      return {
        locationOverlay: null, // Store the location overlay
        map: null
      };
    },


    mounted() {

      // init map
      this.map = new Map({
        target: this.$refs['map-root'],
        layers: [nationalMap],
        view: new View({
          center: [2660000, 1190000], // Default center of map
          zoom: 9, 
          projection: get('EPSG:2056') 
        }),
      });


      // Handle map click event
      this.map.on('singleclick', (evt) => {

        // get coordinates of click (MN95)
        const coordinates = evt.coordinate;

        // update coordinates from store (round to 0.1m)
        const coordinatesStore = useCoordinatesStore();
        coordinatesStore.updateCoordinates(Math.round(coordinates[0] * 10) / 10, Math.round(coordinates[1] * 10) / 10);

        // Remove the existing overlay if it exists
        if (this.locationOverlay) {
          this.map.removeOverlay(this.locationOverlay);
        }

        // URL of the SVG icon
        const iconUrl = require("../assets/antenna.png")

        // Create a marker element
        const element = document.createElement('img');
        element.src = iconUrl;
        element.style.width = '50px'; // Set as needed
        element.style.height = '50px'; // Set as needed

        // Create and add the new overlay
        this.locationOverlay = new Overlay({
          element: element,
          position: coordinates,
          positioning: 'bottom-center',
          offset: [0, 7] // Adjust the offset to point the right tip-mouse-spot
        });
        this.map.addOverlay(this.locationOverlay);
      });


      // init global storage of map (to interact from other containers)
      const mapStore = useMapStore();
      mapStore.setMap(this.map);
      mapStore.setAddLineLayerMethod(this.addLineLayer);
      mapStore.setClearMapLayers(this.clearMapLayers);



    }, // end mounted

    
    methods: {

      addLineLayer(coordinates) {
        // Add a simple line layer to the map (here, for the local topography mask)
        const lineLayer = new VectorLayer({
          source: new VectorSource({
            features: [
              new Feature({
                geometry: new LineString(coordinates)
              })
            ]
          }),
          style: new Style({
            stroke: new Stroke({
              color: '#3F3F3F', // grey !
              width: 5 // put on some width
            })
          })
        });
        this.map.addLayer(lineLayer);
      },

      clearMapLayers() {
        // Parse all layers and delete them from the map except the base layer
        const layersToRemove = this.map.getLayers().getArray()
                                      .filter(layer => !layer.get('isBaseLayer')); // not the national map
        // deleting
        layersToRemove.forEach(layer => {
          this.map.removeLayer(layer);
        });
      }

    }, // end methods



  } // end export default


</script>

