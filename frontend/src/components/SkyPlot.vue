<template>
    <div>
      <div id="skyplot-container"></div>
    </div>
  </template>
  
  <script>
  import Highcharts from 'highcharts';
  require('highcharts/modules/exporting')(Highcharts);
  require('highcharts/highcharts-more')(Highcharts);
  import { useSkyPlotStore } from '@/stores/skyplotStore';
  
  export default {
    name: 'SkyPlot',
    mounted() {

      // init and store the chart
      const skyPlotStore = useSkyPlotStore();
      skyPlotStore.initializeChart('skyplot-container');
    },
  


  }
  </script>
  