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
  </div>
   
</template>

<script>
import { Users, UserStorage, AddItemsResultSummary } from '@spacehq/sdk';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  data: () => ({
    userToken: "",
    url: ""
  }),
  methods:
  mapActions(['connectToBlockchain']),
  computed: mapGetters(['walletAddress', 'storiesBlockchain', 'storiesCount', 'storiesList']),
  async mounted(){
    //await this.connectToBlockchain();

    const users = new Users({ endpoint: 'wss://auth.space.storage' });
    console.log(users, "users")
    // createIdentity generate a random keypair identity
    const identity = await users.createIdentity();

    const spaceUser = await users.authenticate(identity)
    console.log(spaceUser, "spaceUser")
    this.userToken = spaceUser.token;

    const storage = new UserStorage(spaceUser);
    console.log(storage, "storage")

    await storage.createFolder({ bucket: 'personal', path: '/hello' });
    let result = await storage.listDirectory({ bucket: 'personal', path: '/' });
    console.log(result, "result")

    const uploadResponse = await storage.addItems({
      bucket: 'personal',
      files: [
        {
          path: '/logo',
          data: '',
          mimeType: 'image/png'
        }
      ],
    });

    console.log(uploadResponse, "uploadResponse")
    
    uploadResponse.once('done', async (AddItemsEventData) => {
      const summary = AddItemsResultSummary;
      console.log(summary, "summary", AddItemsEventData);

       result = await storage.listDirectory({ bucket: 'personal', path: '/' });
       console.log(result, "result")

      const response = await storage.openFile({ bucket: 'personal', path: '/logo' });
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
