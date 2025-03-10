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
import HighLikedAnswers from '../components/HighLikedAnswers.vue'
import Podcast from '../components/Podcast.vue'
import ZhihuHot from '../components/ZhihuHot.vue'
import Translate from '../components/Translate.vue'
import Fund from '../components/Fund.vue'

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
  },
  {
    path: '/zhihu/hot',
    name: 'ZhihuHot',
    component: ZhihuHot
  },
  {
    path: '/zhihu/high',
    name: 'HighLikedAnswers',
    component: HighLikedAnswers
  },
  {
    path: '/podcast',
    name: 'Podcast',
    component: Podcast
  },
  {
    path: '/translate',
    name: 'Translate',
    component: Translate
  },
  {
    path: '/fund',
    name: 'Fund',
    component: Fund
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



