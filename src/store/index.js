import Vuex from 'vuex';
import Vue from 'vue';
import storiesBlockchain from './storiesBlockchain';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    storiesBlockchain
  }
});