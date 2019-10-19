<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <AnimationFramework/> -->
    <div>Updates:</div>
    <!-- <a href="/update-0">Update 0: Framework</a> -->
    <div><router-link to="/update-0">Update 0: Framework</router-link></div>
    <div><router-link to="/update-1">Update 1: Keyframing</router-link></div>
    <div><router-link to="/update-2">Update 2: Billiards</router-link></div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {
  }
}
</script>
