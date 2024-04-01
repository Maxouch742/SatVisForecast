<template>
  <div class="aboutBox">
    <RouterLink to="/home">Go back to home</RouterLink>
    <h1 class="aboutTitle">About this project</h1>

    <p>This application prototype was created as part of the "MDT - GIO 2024" course. The aim of the web-app is to get
      the potential GNSS
      visibility according to local terrain.
    </p>

    <div class="para">
      <p>SatVisForecast was developped by a team of 3 people:</p>
      <li>Franck Schmidt</li>
      <li>Maxime Fourquaux</li>
      <li>Matteo Casto</li>
    </div>

    <p class="para">
      Here's the link to the GitHub project :
      <a href="https://github.com/Maxouch742/SatVisForecast" target="_blank">link</a>
    </p>
  </div>


</template>

<script>
export default {
  name: 'AboutItem'
}
</script>

<style scoped>
.aboutTitle {
  font-weight: bold;
  font-size: large;
  margin-top: 20px
}

.aboutBox {
  width: 400vw;
}

.para {
  margin-top: 10px;
}
</style>