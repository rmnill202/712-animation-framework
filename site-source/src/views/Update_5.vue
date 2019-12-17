<template>
  <div>
    <h1>Assignment 4 - Particle System</h1>
    <h2>Extra 1: Plane Collision</h2>
    <h3 style="color: red"><!--Right click to move, left to rotate.--> Refresh if lagging!</h3>
    <ParticleFramework :plane_collision='true'/>

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
