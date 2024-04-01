// stores/skyPlotStore.js
import { defineStore } from 'pinia';
import Highcharts from 'highcharts';

// variable to get the same colors for each constellation
const colorsSats = {
    'GPS': '#1f77b4',  // bleu
    'GLONASS': '#ff7f0e',  // orange
    'BEIDOU': '#2ca02c',  // vert
    'GALILEO': '#d62728',  // rouge
    'IRNSS': '#9467bd',  // violet
    'QZSS': '#8c564b',  // brun
  };



export const useSkyPlotStore = defineStore('skyPlotStore', {
  state: () => ({
    chart: null, // Pour stocker l'instance du graphique
  }),
  actions: {
    initializeChart(containerId) {
      this.chart = Highcharts.chart(containerId, {
        chart: {
          polar: true,
          //type: 'scatter'
          marginTop: 100
        },
        title: {
          text: 'Skyplot'
        },
        pane: {
          startAngle: 0,
          endAngle: 360
        },
        xAxis: {
          tickInterval: 45,
          min: 0,
          max: 360,
          labels: {
            formatter: function () {
              return this.value + '°';
            }
          }
        },
        yAxis: {
          min: 0,
          max: 90,
          tickInterval: 15,
          reversed: true,
          title: {
            text: 'Elevation'
          },
          labels: {
            formatter: function () {
              return this.value + '°';
            }
          }
        },
        series: [ // fake legends for init
        { 
          name: 'Satellites',
          type: 'scatter',
          data: []
        },
        {
          name: 'Elevation mask', 
          type: 'line',
          data: [],
          color: 'red',
          lineWidth: 1,
          dashStyle: 'dash',
          marker: {
            enabled: false
          }
        },
        {
          name: 'Topography mask',
          type: 'area',
          data: [],
          color: 'gray',
          fillColor: 'rgba(128, 128, 128, 0.3)', // gray transparent
          lineWidth: 1,
          marker: {
            enabled: false
            }
        }],
        legend: {
          align: 'right',
          verticalAlign: 'center',
          layout: 'vertical',
        },
        tooltip: {
          enabled: true,
          followPointer: true,
        },
      });
    },

    removeAllSeries() {
        if (this.chart) {
            while (this.chart.series.length > 0) {
                this.chart.series[0].remove(true);
            }
        }
    },

    drawReliefOnSkyPlot(listAziElevOfRelief) {

      if (this.chart) {
        this.chart.addSeries({
          name: 'Topography mask',
          type: 'area',
          data: listAziElevOfRelief,
          color: 'gray',
          fillColor: 'rgba(128, 128, 128, 0.3)', // Gris transparent
          lineWidth: 1,
          marker: {
            enabled: false
          }
        });
      }
    },

    drawMaskElevetionOnSkyPlot(angle) {

      // Create data
      const data = []
      for (let i=0; i<360; i++){
        data.push([i, angle])
      }

      // Add data
      if (this.chart) {
        this.chart.addSeries({
          name: 'Elevation mask',
          type: 'line',
          data: data,
          color: 'red',
          lineWidth: 1,
          dashStyle: 'dash',
          marker: {
            enabled: false
          }
        });
      }
    },

    drawSatsOnSykPlot_traj(dataSatJSON, constellation_user) {
      const data_constellation = {}

      // Create object general with list for position's satellite
      dataSatJSON.forEach(element => {

        const data = element.data;
        data.forEach( sat => {

          const constellation = sat.constellation;

          if ( (constellation in data_constellation) === false){
            
            // Add constellation, satellite and position
            data_constellation[constellation] = {};
            data_constellation[constellation][sat.name] = [ [sat.azimut, sat.elevation] ];

          } else {

            const const_data = data_constellation[constellation];

            if ( (sat.name in const_data) === false){
              // add satellite and position
              const_data[sat.name] = [[sat.azimut, sat.elevation]];
            }
            else {
              // Add position
              const_data[sat.name].push( [sat.azimut, sat.elevation] );
            }
          }
        })
      })

      // Display trajectory satellite
      for (const constel in data_constellation){
        if (constel === constellation_user){
        
          for (const sat in data_constellation[constel]){

            // Add data inversed for plot curve trajectory
            let data = data_constellation[constel][sat];
            const data_inv = [];
            for (let i=data.length-1; i >= 0; i--){
              data_inv.push(data[i])
            }
            data = data.concat(data_inv);
            data_constellation[constel][sat] = data;

            if (this.chart) {
              this.chart.addSeries({
                name: sat,
                type: 'line',
                data: data_constellation[constel][sat],
                lineWidth: 1,
                marker: {
                  enabled: false
                }
              });
            }
          }
        }
      }
    },

    drawSatsOnSykPlot(dataSatJSON, constellation_user) {
        const seriesData = dataSatJSON.reduce((acc, sat) => {
            if (!acc[sat.constellation]) {
                acc[sat.constellation] = [];
            }
            acc[sat.constellation].push([sat.azimut, sat.elevation]);
            return acc;
        }, {});

        // Supposons que `this.chart` est votre instance Highcharts
        for (const constellation in seriesData) {
          if (constellation === constellation_user){
              if (this.chart) {
                this.chart.addSeries({
                  name: constellation,
                  type: 'scatter',
                  color: colorsSats[constellation],
                  data: seriesData[constellation],
                  marker: {
                    symbol: 'circle'
                  }
                });
              }
          }
        }
    },
  }
});
