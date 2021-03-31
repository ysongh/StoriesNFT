<template>
  <div class="home container mt-4">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Profile</h1>
    </div>

    <p>Username: {{username}}</p>
    <img :src="url" alt="image" />
    <p>{{url}}</p>

    <p>Login to</p>
    <div v-bind:key="n" v-for="n in usersLen">
      <button @click="login(n)">Account #{{n}}</button>
    </div>

    <p class="mt-3">Your files</p>
    <div v-bind:key="file.name" v-for="file of files">
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
    username: ''
  }),
  methods: {
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
  }
}
</script>

<style scoped>

</style>
