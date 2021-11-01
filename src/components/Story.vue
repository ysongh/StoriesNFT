<template>
  <div class="story container mt-4">
    <ConnectMessage v-if="!storiesBlockchain"></ConnectMessage>
    <div v-else class="card mb-3">
      <div class="card-body">
        <div class="d-flex">
          <h2 class="h2 m-0">{{data.title}}</h2>
          <p class="text-right mt-2">{{data.date}}</p>
        </div>
        <p class="text-muted">By {{data.authorName}}</p>

        <p class="text-muted">{{data.preview}}</p>

        <button v-if="!isPurchase" class="btn btn-primary primary-bg-color" @click="buyStory()">
          Buy for {{weiToETH}} ETH
        </button>
        <a v-else v-bind:href="'https://'+ data.description + '.ipfs.dweb.link'" target="_blank" rel="noopener noreferrer">
          Link to the Story
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ConnectMessage from '../components/common/ConnectMessage.vue';

export default {
  name: 'Story',
  components: {
    ConnectMessage
  },
  data: () => ({
    data: {},
    isPurchase: false
  }),
  computed: {
    ...mapGetters(['walletAddress', 'storiesList', 'storiesBlockchain']),
    weiToETH() {
      return window.web3.utils.fromWei(this.data.price, 'Ether');
    }
  },
  methods: {
    async buyStory(){
      try{
        await this.storiesBlockchain.methods
          .buyStory(this.$route.params.id)
          .send({ from: this.walletAddress, value: this.data.price });

        this.isPurchase = true;
      }
      catch(err){
        console.error(err);
      }
    }
  },
  async mounted(){
    this.data = await this.storiesBlockchain.methods.stories(this.$route.params.id).call();
  }
}
</script>

<style scoped>
  h2 {
    flex: 1 !important;
  }

  .story{
    min-height: 70vh;
  }
</style>