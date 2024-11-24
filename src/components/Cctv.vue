<template>
  <a-list item-layout="horizontal" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta :description="item.brief">
          <template #title>
            <a :href="item.url" target="_blank">{{ item.title }}</a>
          </template>
          <template #avatar>
            <a-avatar shape="square" :size="60" :src="item.image" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script setup>
import { ref, onMounted } from 'vue';
const data = ref([]);

onMounted(() => {
  fetchQuestionDetails()
});

const fetchQuestionDetails = async () => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/cctv`

    const response = await fetch(url); //sunziagent.com http://localhost:8787/cctv
    const result = await response.json();
    let tvData = []
    console.log('result:', result); // 查看实际类型

    if (result[0]?.total > 0) {
      result[0].list.map(item => {
        item.title = item.title
          .replace(/^\[天下财经\]/, '')
      })
      console.log('result[0].list:', result[0].list);
      tvData.push(...result[0].list)
    }
    if (result[1]?.total > 0) {
      tvData.push(...result[1].list)
    }
    if (result[2]?.total > 0) {
      result[2].list.map(item => {
        item.title = item.title
          .replace(/^\[新闻30分\]/, '')
      })
      tvData.push(...result[2].list)
    }

    if (tvData.length > 0) {
      data.value.length = 0
      data.value.push(...tvData)
    }

    console.log('value:', data.value);
  } catch (error) {
    console.error('Error fetching question details:', error);
  }
};
</script>