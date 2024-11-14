// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Question from '../components/ZhihuQuestion.vue'
import Answers from '../components/ZhihuAnswers.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



