<template>
  <div>
    <h1>Stories NFT</h1>
    <p>{{walletAddress}}</p>
    <p>{{storiesCount}} Stories</p>
    <router-link class="btn btn-primary primary-bg-color" to="/create-story">Create Story</router-link>
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

    for(let i = 0; i < this.storiesCount; i++){
      const story = await this.storiesBlockchain.methods.stories(i + 1).call();
      console.log(story);
    }
  }
}
</script>

<style>

</style>
