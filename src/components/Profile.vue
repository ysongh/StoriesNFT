<template>
  <div class="profile container mt-4">
    <h1>Profile</h1>
    
    <div v-if="!accountLoading">
      <div class="d-flex align-items-center">
        <button class="btn btn-primary" @click="createIdentity()" :disabled="fileLoading">
          Create New Identity
        </button>
        <p class="mt-3 ml-2">Or Login to</p>
      </div>
      
      <div class="d-flex flex-wrap">
        <div v-bind:key="n" v-for="n in usersLen">
          <div class="card">
            <button class="btn" @click="login(n)" :disabled="fileLoading">
              Account #{{n}}
            </button>
          </div>
        </div>
      </div>
    </div>

    <center v-else>
      <div class="spinner-grow text-dark" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </center>

    <div v-if="isLogin" class="d-flex justify-content-between align-items-center mt-5">
      <h2>Your files</h2>
      <label class="btn btn-outline-success">
        <span>Upload File</span>
        <input
          class="profile__file"
          type="file"
          @change="uploadFile">
      </label>
    </div>

    <div v-if="!fileLoading" class="row mt-4">
      <div class="col-sm-6 col-md-4 col-lg-3" v-bind:key="file.name" v-for="file of files">
        <div class="card mb-3">
          <div class="card-body">
            <p>{{file.name}}</p>
            <div class="d-flex">
              <button class="btn btn-primary primary-bg-color w-50" @click="openFile(file.name)" :disabled="openFileLoading">
                Open
              </button>
              <button class="btn btn-primary secondary-bg-color w-50" @click="openModal(file.name)" data-toggle="modal" data-target="#publishStoryModal">
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
     <center v-else>
      <div class="spinner-grow text-dark" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </center>

    <PublishStory></PublishStory>
  </div>
   
</template>

<script>
import { Users, BrowserStorage } from '@spacehq/users';
import { UserStorage } from "@spacehq/storage";
import { mapActions } from 'vuex';
// import fleekStorage from '@fleekhq/fleek-storage-js'

// import { fleekAPIKey, fleekAPISecret } from '../config';
import PublishStory from './PublishStory';

export default {
  name: 'Profile',
  components: {
    PublishStory
  },
  data: () => ({
    userToken: "",
    url: "",
    spaceStorage: null,
    spaceUser: null,
    usersLen: 0,
    userList: [],
    files: [],
    browserStorage: null,
    accountLoading: false,
    fileLoading: false,
    openFileLoading: false,
    isLogin: false
  }),
  methods: {
    ...mapActions(['setCurrentFile', 'setCurrentFilename']),
    async login(num){
      try{
        this.fileLoading = true;

        const onErrorCallback = (err, identity) => {
          console.log("ERROR: Identity failed to auth using Space SDK: ", err.toString())
          console.log(identity)
        }

        const users = await Users.withStorage(this.browserStorage, {endpoint: "wss://auth.space.storage"}, onErrorCallback);
        console.log("users: ", users)
        console.log("users.list(): ", users.list())
        this.userList = users.list();
        this.usersLen = users.list().length;

        let userList = await this.browserStorage.list()
        console.log("storage.list(): ", await this.browserStorage.list());
        this.userList = userList;
        
        const spaceUser = await users.authenticate(userList[num - 1]);
        this.spaceUser = spaceUser;
        console.log(spaceUser, "spaceUser")

        const spaceStorage = new UserStorage(spaceUser);
        console.log(spaceStorage, "spaceStorage")

        //await spaceStorage.createFolder({ bucket: 'personal', path: '/test' });
        let result = await spaceStorage.listDirectory({ bucket: 'personal', path: '/' });
        console.log(result.items, "result")

        this.files = result.items;
        this.fileLoading = false;
        this.isLogin = true;
      }
      catch(err){
        console.error(err);
        this.fileLoading = false;
      }
    },
    async uploadFile(event){
      const sourcePaths = Array.from(event.target.files).map((file) => ({
        name: file.name,
        size: file.size,
        data: file,
        mimeType: file.type,
        path: file.webkitRelativePath || file.name,
      }));

      const spaceStorage = new UserStorage(this.spaceUser);
      const uploadResponse = await spaceStorage.addItems({
        bucket: 'personal',
        files: [
          {
            data: sourcePaths[0].data,
            path: sourcePaths[0].path,
            mimeType: sourcePaths[0].mimeType,
          }
        ]
      });
      
      uploadResponse.once('done', async (AddItemsEventData) => {
        console.log(AddItemsEventData, "AddItemsEventData");

        let result = await spaceStorage.listDirectory({ bucket: 'personal', path: '/' });
        console.log(result, "result")
        this.files = result.items;
      });
    },
    async openFile(path){
      try{
        this.openFileLoading = true;
        const spaceStorage = new UserStorage(this.spaceUser);
        const response = await spaceStorage.openFile({ bucket: 'personal', path: `/${path}` });
        
        // response.stream is an async iterable
        let newdata = null;
        for await (const chunk of response.stream) {
          // aggregate the chunks based on your logic
          console.log(chunk, "chunk")
          if(!newdata) newdata = chunk;
        }
        const fileUrl = URL.createObjectURL(new Blob([newdata], { type: response.mimeType }));
        console.log(fileUrl, "fileUrl")
        this.url = fileUrl;
        
        window.open(fileUrl,
          "_blank",
          "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=500,height=600"
        );
        this.openFileLoading = false;
      }
      catch(err) {
        console.error(err);
        this.openFileLoading = false;
      }
    },
    async createIdentity(){
      const onErrorCallback = (err, identity) => {
        console.log("ERROR: Identity failed to auth using Space SDK: ", err.toString())
        console.log(identity)
      }

      const users = await Users.withStorage(this.browserStorage, {endpoint: "wss://auth.space.storage"}, onErrorCallback);
      this.userList = users.list();
      this.usersLen = users.list().length;

      const userData = await users.createIdentity();
      console.log(userData, "userData");

      let userList = await this.browserStorage.list();
      this.userList = userList;
      
      const spaceUser = await users.authenticate(userData);
      this.spaceUser = spaceUser;
      console.log(spaceUser, "spaceUser")

      const spaceStorage = new UserStorage(spaceUser);
      console.log(spaceStorage, "spaceStorage")

      //await spaceStorage.createFolder({ bucket: 'personal', path: '/test' });
      let result = await spaceStorage.listDirectory({ bucket: 'personal', path: '/' });
      console.log(result.items, "result")

      this.files = result.items;
      this.isLogin = true;
    },
    async openModal(path){
      this.setCurrentFilename(path);
      const spaceStorage = new UserStorage(this.spaceUser);
      const response = await spaceStorage.openFile({ bucket: 'personal', path: `/${path}` });
      
      // response.stream is an async iterable
      let newdata = null;
      for await (const chunk of response.stream) {
        // aggregate the chunks based on your logic
        console.log(chunk, "chunk")
        if(!newdata) newdata = chunk;
      }
      console.log(newdata, path, "sa")
      this.setCurrentFile(newdata);
    }
  },
  async mounted(){
    this.accountLoading = true;
    try{
      const storage = new BrowserStorage();
      this.browserStorage = storage;

      const onErrorCallback = (err, identity) => {
        console.log("ERROR: Identity failed to auth using Space SDK: ", err.toString())
        console.log(identity)
      }

      const users = await Users.withStorage(storage, {endpoint: "wss://auth.space.storage"}, onErrorCallback);
      this.userList = users.list();
      this.usersLen = users.list().length;

      console.log("Loading Complete");
      this.accountLoading = false;
    }
    catch(err) {
      console.error(err);
      this.accountLoading = false;
    }
  }
}
</script>

<style scoped>
  .profile{
    min-height: 70vh;
  }

  .profile__file{
    opacity: 0;
    position: absolute;
    left: -9999px
  }
</style>
