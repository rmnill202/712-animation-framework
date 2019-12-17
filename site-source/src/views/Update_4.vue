<template>
  <div>
    <h1>Assignment 4 - Particle System</h1>
    <h2>Results</h2>
    <h3 style="color: red"><!--Right click to move, left to rotate.--> Refresh if lagging!</h3>
    <ParticleFramework/>

    <h2>Summary</h2>
    <div style="text-align: left;">
      <div class="update-text"> 
        Originally, I attempted to add/remove meshes to and from the scene upon spawning and despawning. This
        kills the performance, so instead I set positions to NaN and maintain a pool of meshes! 
      </div>
    </div>

  </div>
</template>

<script>
// import DynamicFramework from '../components/DynamicFramework';
// import BilliardsFramework from '../components/2_billiards/BilliardsFramework';
import ParticleFramework from '../components/4_particles/ParticleFramework';

export default {
  components: {
    ParticleFramework
  }
};
</script>

<style>
.update-text {
  max-width: 1000px;
  margin: 10px auto;
}

@media only screen and (max-width: 950px) {
  .update-text {
    max-width: 100%;
  }
}
</style>
