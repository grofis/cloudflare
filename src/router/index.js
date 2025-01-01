// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Question from '../components/ZhihuQuestion.vue'
import Answers from '../components/ZhihuAnswers.vue'
import People from '../components/People.vue'
import Cctv from '../components/Cctv.vue'
import Btc from '../components/Btc.vue'
import Stock from '../components/Stock.vue'
import Twitter from '../components/Twitter.vue'
import ZhihuSearch from '../components/ZhihuSearchResults.vue'
const routes = [
  
  {
    path: '/',
    name: 'Question',
    component: Question
  },
  {
    path: '/answers/:id',
    name: 'Answers',
    component: Answers,
    props: true
  },
  {
    path: '/people',
    name: 'People',
    component: People
  },
  {
    path: '/cctv',
    name: 'Cctv',
    component: Cctv
  },
  {
    path: '/btc',
    name: 'Btc',
    component: Btc
  },
  {
    path: '/stock',
    name: 'Stock',
    component: Stock
  },
  {
    path: '/x',
    name: 'Twitter',
    component: Twitter
  },
  {
    path: '/zhihu/search',
    name: 'ZhihuSearch',
    component: ZhihuSearch
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



