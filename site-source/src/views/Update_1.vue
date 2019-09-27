<template>
  <div>
    <h1>Assignment 1 - Keyframing</h1>
    <h2>Results</h2>
    <DynamicFramework/>

    <h2>Summary</h2>
    <div style="text-align: left;">
      <div class="update-text"> A simple keyframed animation. I ended up handling the interpolation of translation/rotation in addition to actually
        setting up the keyframing for entities. While the classes/structures aren't fully fleshed out, I came up with a simple domain-ish model before
        getting started. I'd like to extract the work I've done out into its own well designed subsystem at some point, but I'm waiting until a later
        assignment so that I can get a better idea of how to structure things with different types of animation (physics, keyframing etc...)
      </div>
    </div>
    <div style="text-align: left;">
      <img src="../assets/model_1.svg" style="max-width: 600px; width: 100%; display: block; margin: auto">
    </div>
  </div>
</template>

<script>
import DynamicFramework from '../components/DynamicFramework';

export default {
  components: {
    DynamicFramework
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
