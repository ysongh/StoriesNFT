<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <li class="navbar-brand" data-toggle="collapse" data-target=".navbar-collapse.show">
                <router-link class="nav-link padding-0" to="/">
                    <img class="logo" src="../../assets/logo.png" alt="logo" />
                </router-link>
            </li>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <router-link class="nav-link" to="/tokens">Tokens</router-link>
                    </li>
                    <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <router-link class="nav-link" to="/create-story">Create Story</router-link>
                    </li>
                    <!-- <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <router-link class="nav-link" to="/profile">Profile</router-link>
                    </li> -->
                    <li v-if="walletAddress" class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <button class="btn btn-primary secondary-bg-color">{{walletAddress.substring(0,8) + "..." + walletAddress.substring(34,42)}}</button>
                    </li>
                    <li v-else class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <button class="btn btn-primary secondary-bg-color" @click="connectToWallet">Connect to Wallet</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Navbar',
    methods: {
        ...mapActions(['connectToBlockchain']),
        async connectToWallet(){
            await this.connectToBlockchain();
        }
    },
    computed: mapGetters(['walletAddress'])
}
</script>

<style>
    .logo {
        width: 150px;
    }

    .padding-0 {
        padding: 0 !important;
    }
</style>