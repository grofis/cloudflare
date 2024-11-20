// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Question from '../components/ZhihuQuestion.vue'
import Answers from '../components/ZhihuAnswers.vue'
import People from '../components/People.vue'
import Cctv from '../components/Cctv.vue'
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



