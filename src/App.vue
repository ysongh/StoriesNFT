<template>
  <div>
    <Navbar></Navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/layout/Navbar';

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
  * {
    margin: 0;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .primary-bg-color{ background-color: #2F2342 !important; }
  .secondary-bg-color{ background-color: #B42B3F !important; }
</style>
