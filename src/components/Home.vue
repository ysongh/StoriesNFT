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

    <p>{{userToken}}</p>
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
  </div>
   
</template>

<script>
import { Users, BrowserStorage } from '@spacehq/users';
import { UserStorage, AddItemsResultSummary } from "@spacehq/storage";
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  data: () => ({
    userToken: "",
    url: "",
    spaceStorage: null,
    spaceUser: null,
    usersLen: 0,
    userList: [],
    files: []
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

      console.log(userList, "fds")
      
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
      const sourcePaths = Array.from(event.target.files).map((file) => ({
        name: file.name,
        size: file.size,
        data: file,
        mimeType: file.type,
        path: file.webkitRelativePath || file.name,
      }));
      console.log(sourcePaths);

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

      console.log(uploadResponse, "uploadResponse")
      
      uploadResponse.once('done', async (AddItemsEventData) => {
        const summary = AddItemsResultSummary;
        console.log(summary, "summary", AddItemsEventData);

        let result;

        result = await spaceStorage.listDirectory({ bucket: 'personal', path: '/' });
        console.log(result, "result")

        const response = await spaceStorage.openFile({ bucket: 'personal', path: sourcePaths[0].path });
        // response.stream is an async iterable
        for await (const chunk of response.stream) {
          // aggregate the chunks based on your logic
          console.log(chunk, "chunk")
        }

        // response also contains a convenience function consumeStream
        const fileBytes = await response.consumeStream();
        console.log(fileBytes, "fileBytes")
        const fileUrl = URL.createObjectURL(new Blob([fileBytes.buffer], { type: response.mimeType }));
        console.log(fileUrl, "fileUrl")
        this.url = fileUrl;
      });
    },
    async getFile(){
      const spaceStorage = new UserStorage(this.spaceUser);

      const response = await spaceStorage.openFile({ bucket: 'personal', path: '/photo-1414235077428-338989a2e8c0.jpeg' });
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
    }
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
