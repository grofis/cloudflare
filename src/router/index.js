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
import Magazine from '../components/Magazine.vue'
import MagazineSearch from '../components/MagazineSearchResult.vue'
import Fandeng from '../components/Fandeng.vue'
import Paulgraham from '../components/Paulgraham.vue'
import HackerNews from '../components/HackerNews.vue'
import KeyValue from '../components/KeyValue.vue'
import ValueDetails from '../components/ValueDetails.vue'
import ValueEdit from '../components/ValueEdit.vue'
import TwitterVideo from '../components/TwitterVideo.vue'
import TwitterDetail from '../components/TwitterDetail.vue'

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
    path: '/x/detail',
    name: 'TwitterDetail',
    component: TwitterDetail
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
  },
  {
    path: '/magazine',
    name: 'Magazine',
    component: Magazine
  },
  {
    path: '/magazine/search',
    name: 'MagazineSearch',
    component: MagazineSearch
  },
  {
    path: '/fandeng',
    name: 'fandeng',
    component: Fandeng
  },
  {
    path: '/paul',
    name: 'paul',
    component: Paulgraham
  },
  {
    path: '/hn',
    name: 'HackerNews',
    component: HackerNews
  },
  {
    path: '/kv',
    name: 'KeyValue',
    component: KeyValue
  },
  {
    path: '/value',
    name: 'ValueDetails',
    component: ValueDetails
  },
  {
    path: '/edit',
    name: 'ValueEdit',
    component: ValueEdit
  },
  {
    path: '/video',
    name: 'TwitterVideo',
    component: TwitterVideo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



