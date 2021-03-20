import Web3 from 'web3';

import StoriesNFT from '../abis/StoriesNFT.json';

const state = {
    walletAddress: '',
    storiesBlockchain: null,
    storiesCount: 0
};

const getters = {
    walletAddress: state => state.walletAddress,
    storiesBlockchain: state => state.storiesBlockchain,
    storiesCount: state => state.storiesCount
};

const actions = {
    async connectToBlockchain({ commit }) {
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
        commit('setWalletAddress', address[0]);

        const networkId = await web3.eth.net.getId();
        const networkData = StoriesNFT.networks[networkId];

        if (networkData) {
            const abi = StoriesNFT.abi;
            const address = StoriesNFT.networks[networkId].address;

            const blockchain = new web3.eth.Contract(abi, address);
            commit('setStoriesBlockchain', blockchain);

            const storiesCount = await blockchain.methods.storiesCount().call();
            commit('setStoriesCount', storiesCount);
        } else {
            window.alert('Contract is not deployed to detected network.')
        }
    }
};

const mutations = {
    setWalletAddress: (state, walletAddress) => (state.walletAddress = walletAddress),
    setStoriesBlockchain: (state, storiesBlockchain) => (state.storiesBlockchain = storiesBlockchain),
    setStoriesCount: (state, storiesCount) => (state.storiesCount = storiesCount)
};

export default {
    state,
    getters,
    actions,
    mutations
}