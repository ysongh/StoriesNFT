<template>
  <div class="home container mt-4">
    <div class="d-flex justify-content-between align-items-center">
      <h1>List of Stories</h1>
      <router-link class="btn btn-primary secondary-bg-color" to="/create-story">Create Story</router-link>
    </div>
    
    <a v-bind:href="'https://kovan.etherscan.io/address/'+ walletAddress" target="_blank" rel="noopener noreferrer">Your wallet address: {{walletAddress}}</a>

    <div class="row mt-4">
      <div class="col-sm-12 col-lg-6" v-bind:key="story.storyId" v-for="story of storiesList">
        <div class="card mb-3">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <p class="m-0"><strong class="home__text">{{story.title}}</strong> by {{story.authorName}}</p>
              <p class="text-muted m-0">{{story.preview}}</p>
            </div>
            <router-link class="btn btn-primary primary-bg-color" :to="{ path: '/story/'+ story.storyId}">
              View
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
   
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  methods: mapActions(['connectToBlockchain']),
  computed: mapGetters(['walletAddress', 'storiesBlockchain', 'storiesCount', 'storiesList']),
  async mounted(){
    await this.connectToBlockchain();
  }
}
</script>

<style scoped>
  .home{
    min-height: 70vh;
  }

  .home__text {
    font-size: 1.4rem;
  }
</style>
