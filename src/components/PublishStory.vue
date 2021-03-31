<template>
  <div class="modal" id="publishStoryModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Publish Story</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="isPublish" class="alert alert-success" role="alert">
            Your Story has been publish!
          </div>

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
              <p>{{this.filename}}</p>
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

            <input v-if="!loading" type="submit" value="Add" class="btn btn-primary primary-bg-color btn-block btn-lg">
            
            <center v-else>
              <div class="spinner-grow text-dark" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </center>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import fleekStorage from '@fleekhq/fleek-storage-js'

import { fleekAPIKey, fleekAPISecret } from '../config';

export default {
  name: 'PublishStory',
  data: () => ({
    title: "",
    authorName: "",
    preview: "",
    description: "",
    price: "",
    address: "",
    isPublish: false,
    loading: false
  }),
  computed: mapGetters(['walletAddress', 'storiesBlockchain', 'file', 'filename']),
  methods:{
    async addStory(e){
      this.loading = true;
      e.preventDefault();

      const uploadedFile = await fleekStorage.upload({
          apiKey: fleekAPIKey,
          apiSecret: fleekAPISecret,
          key: this.filename,
          data: this.file
      });

      this.description = uploadedFile.key;
      await this.storiesBlockchain.methods
        .createStory(this.title, this.authorName, this.preview, this.description, window.web3.utils.toWei(this.price.toString(), 'Ether'))
        .send({ from: this.address });

      this.isPublish = true;
      this.loading = false;
    }
  },
  mounted(){
    this.address = this.walletAddress;
  }
}
</script>

<style scoped>
</style>