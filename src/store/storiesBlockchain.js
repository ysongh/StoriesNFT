import Web3 from 'web3';

import StoriesNFT from '../abis/StoriesNFT.json';

const state = {
    walletAddress: '',
    storiesBlockchain: null,
    storiesCount: 0,
    storiesList: [],
    file: null,
    filename: ''
};

const getters = {
    walletAddress: state => state.walletAddress,
    storiesBlockchain: state => state.storiesBlockchain,
    storiesCount: state => state.storiesCount,
    storiesList: state => state.storiesList,
    file: state => state.file,
    filename: state => state.filename
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

            let tempStories = []
            for(let i = 0; i < storiesCount; i++){
                const story = await blockchain.methods.stories(i + 1).call();
                tempStories.push(story);
            }
            commit('setStoriesList', tempStories);
        } else {
            window.alert('Contract is not deployed to detected network.')
        }
    },
    setCurrentFile({ commit }, file){
        commit('setFile', file);
    },
    setCurrentFilename({ commit }, filename){
        commit('setFilename', filename);
    },
};

const mutations = {
    setWalletAddress: (state, walletAddress) => (state.walletAddress = walletAddress),
    setStoriesBlockchain: (state, storiesBlockchain) => (state.storiesBlockchain = storiesBlockchain),
    setStoriesCount: (state, storiesCount) => (state.storiesCount = storiesCount),
    setStoriesList: (state, storiesList) => (state.storiesList = storiesList),
    setFile: (state, file) => (state.file = file),
    setFilename: (state, filename) => (state.filename = filename)
};

export default {
    state,
    getters,
    actions,
    mutations
}