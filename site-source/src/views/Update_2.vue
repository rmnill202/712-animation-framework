<template>
  <div>
    <h1>Assignment 2 - Billiards</h1>
    <h2>Results</h2>
    <!-- <DynamicFramework/> -->
    <BilliardsFramework/>

    <h2>Summary</h2>
    <div style="text-align: left;">
      <div class="update-text"> 
        This checkpoint was a little tricky to get started with how heavy on the equations it is. However, after getting a sphere
        bouncing around in a static rectangle, things sped up in implementation. Its not quite deterministic, but it looks right!
      </div>
    </div>
  </div>
</template>

<script>
// import DynamicFramework from '../components/DynamicFramework';
import BilliardsFramework from '../components/2_billiards/BilliardsFramework';

export default {
  components: {
    BilliardsFramework
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
