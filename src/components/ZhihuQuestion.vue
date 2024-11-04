<template>
    <a-list :data-source="questions" item-layout="vertical">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #extra>
            <div class="stats-container">
              <a-space>
                <a-statistic :value="item.score" :precision="1" suffix="分" />
                <a-statistic :value="item.answers" suffix="回答" />
                <a-statistic :value="item.views" suffix="浏览" />
                <a-statistic :value="item.follows" suffix="关注" />
              </a-space>
            </div>
          </template>
          
          <a-list-item-meta>
            <template #title>
              <div class="question-header">
                <a-tag v-if="item.trend" color="blue">{{ item.trend }}</a-tag>
                <a :href="item.url" target="_blank">{{ item.title }}</a>
              </div>
            </template>
            <template #description>
              <a-space>
                <a-tag 
                  v-for="tag in item.tags" 
                  :key="tag"
                  color="default"
                >
                  #{{ tag }}
                </a-tag>
              </a-space>
            </template>
          </a-list-item-meta>
  
          <template #actions>
            <a-button type="primary" icon="edit">
              写回答
            </a-button>
          </template>
  
          <div class="rating">
            <a-rate 
              :value="item.rating" 
              :count="5"
              disabled
              style="color: #FF3230"
            />
          </div>
        </a-list-item>
      </template>
    </a-list>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const questions = ref([
    {
      title: '如何看待江苏省涟水中等专业学校给予王某某诫勉谈话处理，取消年度评优资格？',
      url: 'https://www.zhihu.com/question/2979498424',
      trend: '上升',
      tags: ['生活', '教育', '数学'],
      rating: 5,
      score: 10.0,
      answers: 2726,
      views: 8180000,
      follows: 1295,
      comments: 75000
    },
    // 可以添加更多问题数据
  ]);
  </script>
  
  <style scoped>
  .question-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .stats-container {
    display: flex;
    gap: 16px;
  }
  
  .rating {
    margin: 8px 0;
  }
  </style>