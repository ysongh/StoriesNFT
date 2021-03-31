import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../components/Home.vue'
import CreateStory from '../components/CreateStory.vue'
import Story from '../components/Story.vue'
import Tokens from '../components/Tokens.vue'
import Profile from '../components/Profile.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create-story',
    name: 'CreateStory',
    component: CreateStory
  },
  {
    path: '/tokens',
    name: 'Tokens',
    component: Tokens
  },
  {
    path: '/story/:id',
    name: 'Story',
    component: Story
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: Profile
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router 