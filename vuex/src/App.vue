<template>
  <div id="app">
    <nav>
      <router-link to="/home">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
    <button @click="$store.commit('add', 1)">commit</button>
    <button @click="$store.dispatch('add', 1)">dispatch</button>
    <!-- <div>{{ $store.getters.age }}</div>
      <button @click="$store.commit('a/add', 1)">a/commit</button> -->
    <div>{{ $store.state.a.age }}</div>
    <div>{{ $store.state.age }}</div>
  </div>
</template>

<script>
export default {
  created() {
    // console.log(this.$route)
    console.log(this.$store);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
