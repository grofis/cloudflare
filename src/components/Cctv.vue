<template>
    <a-list item-layout="horizontal" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta
            :description="item.brief"
          >
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
        const response = await fetch(`https://sunziagent.com/cctv`); //sunziagent.com http://localhost:8787/cctv
        const result = await response.json();
        console.log(result);
        if(result[0]?.total>0){
            result[0].list.map(item => {
                item.title = item.title
                    .replace(/^\[天下财经\]/, '')
            })
            data.value.length = 0
            data.value.push(...result[0].list)
        }
        if(result[1]?.total>0){
            data.value.push(...result[1].list)
        }
        if(result[2]?.total>0){
            result[2].list.map(item => {
                item.title = item.title
                    .replace(/^\[新闻30分\]/, '')
            })
            data.value.push(...result[2].list)
        }

        
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching question details:', error);
    }
};
  </script>