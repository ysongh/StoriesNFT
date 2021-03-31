<template>
  <div class="tokens container mt-4">
    <h1 class="mb-4">List of NFT</h1>

    <div class="row">
      <div class="col-sm-6 col-md-3 col-lg-2" v-bind:key="token.tokenId" v-for="token of this.data">
        <div class="card mb-3">
          <div class="card-body">
            <a v-bind:href="'https://storageapi.fleek.co/ysongh-team-bucket/'+ token.tokenURI" target="_blank" rel="noopener noreferrer">Token #{{token.tokenId}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Tokens',
  data: () => ({
    data: []
  }),
  computed: {
    ...mapGetters(['walletAddress', 'storiesBlockchain'])
  },
  async mounted(){
    const totalSupply = await this.storiesBlockchain.methods.totalSupply().call();
    
    for(let i = 1; i <= totalSupply; i++){
      const tokenOwner = await this.storiesBlockchain.methods.ownerOf(i).call();
      
      if(tokenOwner === this.walletAddress){
        let tokenURI = await this.storiesBlockchain.methods.tokenURI(i).call();
        this.data.push({
          tokenId: i,
          tokenURI: tokenURI
        });
      }
    }

    console.log(this.data);
  }
}
</script>

<style scoped>
  h2 {
    flex: 1 !important;
  }

  .tokens {
    min-height: 70vh;
  }
</style>