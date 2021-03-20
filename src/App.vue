<template>
  <h1>Stories NFT</h1>
  <p>{{walletAddress}}</p>
  <p>{{storiesCount}} Stories</p>
</template>

<script>
import Web3 from 'web3';
import StoriesNFT from './abis/StoriesNFT.json';

export default {
  name: 'App',
  components: {},
  data: () => ({
    walletAddress: '',
    storiesCount: 0
  }),
  async mounted(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}

    const web3 = window.web3;

    const address = await web3.eth.getAccounts();
    this.walletAddress = address[0];

		const networkId = await web3.eth.net.getId();
		const networkData = StoriesNFT.networks[networkId];

		if(networkData){
			const abi = StoriesNFT.abi;
			const address = StoriesNFT.networks[networkId].address;

			const blockchain = new web3.eth.Contract(abi, address);
      const storiesCount = await blockchain.methods.storiesCount().call();
      this.storiesCount = storiesCount;
		}else{
			window.alert('Contract is not deployed to detected network.')
		}
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
</style>
