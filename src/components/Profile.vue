<template>
  <div class="profile container mt-4">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Profile</h1>
      <label class="btn btn-outline-success btn-sm">
        <p class="mt-2">Upload File</p>
        <input
          class="profile__file"
          type="file"
          @change="uploadFile">
      </label>
    </div>

    <p>Login to</p>
    <div v-bind:key="n" v-for="n in usersLen">
      <button @click="login(n)">Account #{{n}}</button>
    </div>

    <button @click="createIdentity()">Create New Identity</button>

    <p class="mt-3">Your files</p>
    <div >
      
    </div>

    <div class="row mt-4">
      <div class="col-sm-6 col-md-4 col-lg-3" v-bind:key="file.name" v-for="file of files">
        <div class="card mb-3">
          <div class="card-body">
            <p>{{file.name}}</p>
            <div class="d-flex">
              <button class="btn btn-primary primary-bg-color w-50" @click="openFile(file.name)">
                Open
              </button>
              <button class="btn btn-primary secondary-bg-color w-50">
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
   
</template>

<script>
import { Users, BrowserStorage } from '@spacehq/users';
import { UserStorage } from "@spacehq/storage";
import fleekStorage from '@fleekhq/fleek-storage-js'

import { fleekAPIKey, fleekAPISecret } from '../config';

export default {
  name: 'Profile',
  data: () => ({
    userToken: "",
    url: "",
    spaceStorage: null,
    spaceUser: null,
    usersLen: 0,
    userList: [],
    files: [],
    browserStorage: null
  }),
  methods: {
    async login(num){
      const onErrorCallback = (err, identity) => {
        console.log("ERROR: Identity failed to auth using Space SDK: ", err.toString())
        console.log(identity)
      }

      const users = await Users.withStorage(this.browserStorage, {endpoint: "wss://auth.space.storage"}, onErrorCallback);
      console.log("Initialized users object using browser storage")
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
    openFile(filename){
      window.open("https://storageapi.fleek.co/ysongh-team-bucket/" + filename,
        "_blank",
        "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=500,height=600"
      );
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
    }
  },
  async mounted(){
    const storage = new BrowserStorage();
    this.browserStorage = storage;

    const onErrorCallback = (err, identity) => {
      console.log("ERROR: Identity failed to auth using Space SDK: ", err.toString())
      console.log(identity)
    }

    const users = await Users.withStorage(storage, {endpoint: "wss://auth.space.storage"}, onErrorCallback);
    this.userList = users.list();
    this.usersLen = users.list().length;

    console.log("Loading Complete")
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
