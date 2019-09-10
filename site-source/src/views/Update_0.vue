<template>
  <div>
    <h1>Assignment 0 - Animation Framework</h1>
    <h2>Results</h2>
    <AnimationFramework/>

    <h2>Summary</h2>
    <div style="text-align: left;">
      <div class="update-text">The framework itself is fairly simple, and will need some additional work to be extensible to more complex scenes and controls.
        A rudimentary system for restarting the animation has been implemented, and a basic object notation exists such that objects move at
        a constant rate for the duration of the animation. This isn't suitable for anything like keyframing or motion tweening, but the groundwork
        for updating each object at a given timestamp of the animation exists so it should be fairly simple to extend that functionality.
      </div>
    </div>
  </div>
</template>

<script>
import AnimationFramework from '../components/AnimationFramework';

export default {
  components: {
    AnimationFramework
  }
};
</script>

<style>
.update-text {
  max-width: 1000px;
  margin: auto;
}

@media only screen and (max-width: 950px) {
  .update-text {
    max-width: 100%;
  }
}
</style>
