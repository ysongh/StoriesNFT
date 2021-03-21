<template>
  <div class="container mt-4">
    <div class="card mb-3">
      <div class="card-body">
        <div class="d-flex">
          <h2 class="h2 m-0">{{data.title}}</h2>
          <p class="text-right mt-2">{{data.date}}</p>
        </div>
        <p class="text-muted">By {{data.authorName}}</p>

        <p class="text-muted">By {{data.preview}}</p>

        <button class="btn btn-primary primary-bg-color">
          Buy for {{weiToETH}} ETH
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Story',
  data: () => ({
    data: {},
  }),
  computed: {
    ...mapGetters(['storiesList', 'storiesBlockchain']),
    weiToETH() {
      return window.web3.utils.fromWei(this.data.price, 'Ether');
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
</style>