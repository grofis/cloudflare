<template>
  <a-list :grid="{ gutter: 16, column: 2 }" :data-source="peopleData">
    <template #renderItem="{ item }">
      <a-list-item>
        <!-- <a-card :title="item.title">Card content</a-card> -->
        <a-card hoverable>
          <template #cover>
            <img :alt="item.stage" :src="item.picture" referrerpolicy="no-referrer"/>
          </template>
          <a-card-meta :title="item.title">
            <template #description>{{ item.stage.replace(/\s+/g, '') }}</template>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>
<script setup>
import { ref, onMounted } from 'vue';
// 方法1：直接导入 JSON 文件
import peopleJson from '@/assets/Wechat_People_copy.json';

const peopleData = ref([]);
onMounted(() => {
  let temp = []
  peopleJson.map(item => {
    temp.push(...item.data)
  })
  temp.sort((a, b) => b.id - a.id);
  // 如果使用方法1，直接赋值
  peopleData.value.push(...temp);
  console.log(peopleData.value)

  // 如果使用方法2，异步加载
  // loadPeopleData();
});

const ensureHttps = (url) => {
  if (!url) return '';
  // 方法1：直接替换 http 为 https
  return url.replace(/^http:/, 'https:');
  
  // 方法2：使用代理服务
  // return `https://your-proxy.com/image?url=${encodeURIComponent(url)}`;
  
  // 方法3：使用相对协议
  // return url.replace(/^http:/, '');
};
</script>