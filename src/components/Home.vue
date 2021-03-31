<template>
  <div class="home container mt-4">
    <div class="d-flex justify-content-between align-items-center">
      <h1>List of Stories</h1>
      <router-link class="btn btn-primary secondary-bg-color" to="/create-story">Create Story</router-link>
    </div>
    
    <a v-bind:href="'https://kovan.etherscan.io/address/'+ walletAddress" target="_blank" rel="noopener noreferrer">Your wallet address: {{walletAddress}}</a>

    <div class="row mt-4">
      <div class="col-sm-12 col-lg-6" v-bind:key="story.storyId" v-for="story of storiesList">
        <div class="card mb-3">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <p class="m-0"><strong class="home__text">{{story.title}}</strong> by {{story.authorName}}</p>
              <p class="text-muted m-0">{{story.preview}}</p>
            </div>
            <router-link class="btn btn-primary primary-bg-color" :to="{ path: '/story/'+ story.storyId}">
              View
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <p>Username: {{username}}</p>
    <img :src="url" alt="image" />
    <p>{{url}}</p>

    <p>Login to</p>
    <div v-bind:key="n" v-for="n in usersLen">
      <button @click="login(n)">Account #{{n}}</button>
    </div>

    <p class="mt-3">Your files</p>
    <div v-bind:key="file.created" v-for="file of files">
      <p @click="getFile()">{{file.name}}</p>
    </div>

    <div class="form-group">
      <label class="font-weight-bold">Upload File</label>
      <div class="input-group">
        <div class="custom-file">
          <input type="file" class="custom-file-input" @change="uploadFile">
          <label class="custom-file-label"></label>
        </div>
      </div>
    </div>

    <button @click="addPhoto()">Upload</button>
    <img id="my-img">getshareFiles
    <button @click="shareFile()">Share</button>
    <button @click="getshareFiles()">GetshareFiles</button>
  </div>
   
</template>

<script>
import { Users, BrowserStorage } from '@spacehq/users';
import { UserStorage } from "@spacehq/storage";
import { mapGetters, mapActions } from 'vuex';
import fleekStorage from '@fleekhq/fleek-storage-js'

import { fleekAPIKey, fleekAPISecret } from '../config';

export default {
  name: 'Home',
  data: () => ({
    userToken: "",
    url: "",
    spaceStorage: null,
    spaceUser: null,
    usersLen: 0,
    userList: [],
    files: [],
    username: ''
  }),
  methods: {
    ...mapActions(['connectToBlockchain']),
    async login(num){
      const storage = new BrowserStorage();
      this.browserStorage = storage;

      const onErrorCallback = (err, identity) => {
        console.log("ERROR: Identity failed to auth using Space SDK: ", err.toString())
        console.log(identity)
      }

      const users = await Users.withStorage(storage, {endpoint: "wss://auth.space.storage"}, onErrorCallback);
      console.log("Initialized users object using browser storage")
      console.log("users: ", users)
      console.log("users.list(): ", users.list())
      this.userList = users.list();
      this.usersLen = users.list().length;

      let userList = await storage.list()
      console.log("storage.list(): ", await storage.list());
      this.userList = userList;
      
      const spaceUser = await users.authenticate(userList[num - 1]);
      this.spaceUser = spaceUser;
      console.log(spaceUser, "spaceUser")

      const spaceStorage = new UserStorage(spaceUser);
      //this.username = spaceStorage.userMetadataStore.username;
      console.log(spaceStorage, "spaceStorage")

      //await spaceStorage.createFolder({ bucket: 'personal', path: '/test' });
      let result = await spaceStorage.listDirectory({ bucket: 'personal', path: '/' });
      console.log(result.items, "result")

      this.files = result.items;
    },
    async uploadFile(event){
      const uploadedFile = await fleekStorage.upload({
          apiKey: fleekAPIKey,
          apiSecret: fleekAPISecret,
          key: event.target.files[0].name,
          data: event.target.files[0]
      });

      console.log(uploadedFile);
      const spaceStorage = new UserStorage(this.spaceUser);
      await spaceStorage.createFolder({ bucket: 'personal', path: uploadedFile.key });

      let result = await spaceStorage.listDirectory({ bucket: 'personal', path: '/' });
      console.log(result.items, "new folder");
      this.files = result.items;
    },
    async getFile(){
      const spaceStorage = new UserStorage(this.spaceUser);

      const response = await spaceStorage.openFile({ bucket: 'personal', path: '/' });
      // response.stream is an async iterable
      for await (const chunk of response.stream) {
        // aggregate the chunks based on your logic
        console.log(chunk, "chunk")
      }

      function typedArrayToUrl(buffer, mimeType){
        return URL.createObjectURL(new Blob(buffer, { type: mimeType }));
      }

      // response also contains a convenience function consumeStream
      const fileBytes = await response.consumeStream();
      console.log(fileBytes, "fileBytes")
      //const fileUrl = URL.createObjectURL(new Blob([fileBytes.buffer], { type: response.mimeType }));
      const fileUrl = typedArrayToUrl([fileBytes.buffer], response.mimeType);
      console.log(fileUrl, "fileUrl")
      // let src = `data:${response.mimeType};base64,` + fileBytes;
      // console.log(src)
      this.url = fileUrl;

      const content = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 5, 0, 0, 0, 5, 8, 6, 0, 0, 0, 141, 111, 38, 229, 0, 0, 0, 28, 73, 68, 65, 84, 8, 215, 99, 248, 255, 255, 63, 195, 127, 6, 32, 5, 195, 32, 18, 132, 208, 49, 241, 130, 88, 205, 4, 0, 14, 245, 53, 203, 209, 142, 14, 31, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
      console.log(content, "content")
        document.getElementById('my-img').src = URL.createObjectURL(
          new Blob([content.buffer], { type: response.mimeType } /* (1) */)
        );
    },
  },
  computed: mapGetters(['walletAddress', 'storiesBlockchain', 'storiesCount', 'storiesList']),
  async mounted(){
    //await this.connectToBlockchain();

    const storage = new BrowserStorage();
    this.browserStorage = storage;

    const onErrorCallback = (err, identity) => {
      console.log("ERROR: Identity failed to auth using Space SDK: ", err.toString())
      console.log(identity)
    }

    const users = await Users.withStorage(storage, {endpoint: "wss://auth.space.storage"}, onErrorCallback);
    this.userList = users.list();
    this.usersLen = users.list().length;
  }
}
</script>

<style scoped>
  .home{
    min-height: 70vh;
  }

  .home__text {
    font-size: 1.4rem;
  }
</style>
