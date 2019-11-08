<template>
  <div>
    <h1>Assignment 3 - Motion Capture</h1>
    <h2>Results</h2>
    <!-- <DynamicFramework/> -->
    <!-- <BilliardsFramework/> -->
    <MocapFramework/>

    <h2>Summary</h2>
    <div style="text-align: left;">
      <div class="update-text"> 
        TBD
      </div>
    </div>
  </div>
</template>

<script>
// import DynamicFramework from '../components/DynamicFramework';
// import BilliardsFramework from '../components/2_billiards/BilliardsFramework';
import MocapFramework from '../components/3_mocap/MocapFramework';

export default {
  components: {
    MocapFramework
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
