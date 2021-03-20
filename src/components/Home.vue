<template>
  <div>
    <h1>Stories NFT</h1>
    <p>{{walletAddress}}</p>
    <p>{{storiesCount}} Stories</p>
  </div>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  methods: mapActions(['connectToBlockchain']),
  computed: mapGetters(['walletAddress', 'storiesBlockchain', 'storiesCount']),
  async mounted(){
    await this.connectToBlockchain();
    console.log(this.storiesBlockchain);
  }
}
</script>

<style>

</style>
