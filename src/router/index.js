// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Question from '../components/ZhihuQuestion.vue'
import Answer from '../components/ZhihuAnswers.vue'

const routes = [
  
  {
    path: '/Answer',
    name: 'Answer',
    component: Answer
  },
  {
    path: '/',
    name: 'Question',
    component: Question
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



