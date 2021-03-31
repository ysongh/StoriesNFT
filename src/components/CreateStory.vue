<template>
  <div class="container">
    <div class="card m-auto">
      <h2 class="card-header text-center py-4">Create Story</h2>
      
      <form class="card-body px-5" @submit="addStory">
        <div class="form-group">
          <label class="font-weight-bold">Title</label>
          <input
            class="form-control"
            type="text"
            name="title"
            v-model="title">
        </div>

        <div class="form-group">
          <label class="font-weight-bold">Author Name</label>
          <input
            class="form-control"
            type="text"
            name="authorName"
            v-model="authorName">
        </div>

        <div class="form-group">
          <label class="font-weight-bold">Preview</label>
          <input
            class="form-control"
            type="text"
            name="preview"
            v-model="preview">
        </div>

        <div class="form-group">
          <label class="font-weight-bold">PDF of the Story</label>
          <div class="input-group">
            <div class="custom-file">
              <input type="file" class="custom-file-input" @change="getFile">
              <label class="custom-file-label">{{fileName}}</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="font-weight-bold">Price</label>
          <input
            class="form-control"
            type="text"
            name="price"
            v-model="price">
        </div>

        <div class="form-group">
          <label class="font-weight-bold">Wallet Address</label>
          <input
            class="form-control"
            type="text"
            name="address"
            v-model="address">
        </div>

        <input type="submit" value="Add" class="btn btn-primary primary-bg-color btn-block btn-lg">
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import fleekStorage from '@fleekhq/fleek-storage-js'

import { fleekAPIKey, fleekAPISecret } from '../config';

export default {
  name: 'CreateStory',
  data: () => ({
    title: "",
    authorName: "",
    preview: "",
    description: "",
    price: "",
    address: "",
    file: null,
    fileName: ''
  }),
  computed: mapGetters(['walletAddress', 'storiesBlockchain']),
  methods:{
    async addStory(e){
      e.preventDefault();

      const uploadedFile = await fleekStorage.upload({
          apiKey: fleekAPIKey,
          apiSecret: fleekAPISecret,
          key: this.file.name,
          data: this.file
      });

      this.description = uploadedFile.key;
      await this.storiesBlockchain.methods
        .createStory(this.title, this.authorName, this.preview, this.description, window.web3.utils.toWei(this.price.toString(), 'Ether'))
        .send({ from: this.address });

      this.$router.push('/');
    },
    getFile(event){
      const file = event.target.files[0];
      this.file = file;
      this.fileName = file.name;
    }
  },
  mounted(){
    this.address = this.walletAddress;
  }
}
</script>

<style scoped>
  .card{
    max-width: 500px !important;
    margin-top: 3rem !important;
  }
</style>