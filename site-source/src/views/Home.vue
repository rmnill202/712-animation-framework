<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <AnimationFramework/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import AnimationFramework from '../components/AnimationFramework';

export default {
  name: 'home',
  components: {
    HelloWorld,
    AnimationFramework
  }
}
</script>
