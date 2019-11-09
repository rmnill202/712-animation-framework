<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Updates</router-link> |
      <router-link to="/about">About</router-link>
      <div><router-link to="/update-0">Update 0: Framework</router-link> | <router-link to="/update-1">Update 1: Keyframing</router-link>
       | <router-link to="/update-2">Update 2: Billiards</router-link> | <router-link to="/update-3">Update 3: Mocap</router-link></div>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
