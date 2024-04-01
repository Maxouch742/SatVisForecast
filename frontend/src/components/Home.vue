<template>
  <div id="app">
    <div class="cell cell-header">
      <TitleHeader />
      <RouterLink to="/about">About</RouterLink>
    </div>
    <div class="cell cell-skyplot">
      <SkyPlot />
    </div>
    <div class="cell cell-form">
      <FormInput />
    </div>
    <div class="cell cell-map">
      <MapContainer />
    </div>
  </div>
</template>

<script>
import TitleHeader from './TitleHeader.vue';
import MapContainer from './MapContainer.vue'
import SkyPlot from './SkyPlot.vue';
import FormInput from './FormInput.vue';

export default {
  name: 'App',
  components: {
    TitleHeader,
    MapContainer,
    SkyPlot,
    FormInput
  },
}
</script>

<style>
html,
body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100%;
  display: grid;
  grid-template-columns: 30vw 70vw;
  /* 3/4 à gauche, 1/4 à droite */
  grid-template-rows: 20vh 70vh;
  /* Les rangées s'adaptent au contenu */
  grid-gap: 0.5vw;
  padding: 0.5vw;
  box-sizing: border-box;
}

.cell {
  border-radius: 4px;
  background-color: white;
}

.center {
  margin: auto
}

.cell-header {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;
}

.cell-map {
  grid-column: 1;
  grid-row: 2;
  height: auto;
}

.cell-skyplot {

  grid-column: 2;
  grid-row: 2;
  max-width: 67vw;
}

.cell-form {
  grid-column: 2;
  grid-row: 1;
  max-width: 67vw;
  padding-right: 6px
}
</style>