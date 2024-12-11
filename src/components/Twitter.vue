<template>
  <a-list item-layout="horizontal" :data-source="xData">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta :description="item.quoted_tweet?.text">
          <template #title>
            <a target="_blank" :href="`https://twitter.com/${item.author.username}/status/${item.id}`">{{ item.text
              }}</a>
          </template>
          <template #avatar>
            <a :href="`https://twitter.com/${item.author.username}`" target="_blank">
              <a-avatar :src="item.author.profile_image_url" />
            </a>
          </template>
        </a-list-item-meta>
        <template #extra v-if="item.quoted_tweet">
          <a-avatar-group :max-count="2" size="large" :max-style="{
            color: '#f56a00',
            backgroundColor: '#fde3cf',
          }">

            <a-tooltip v-for="item in item.quoted_tweet.media" :key="item.url" :title="item.type" placement="top">
              <a-avatar :src="item.url" />
            </a-tooltip>
          </a-avatar-group>
          <!-- <img width="100" alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" /> -->
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons-vue';
const xData = ref([]);
onMounted(() => {
  fetchTwitterData()
});

async function fetchTwitterData() {
  // const baseUrl = `${import.meta.env.VITE_API_URL}/x/`
  const baseUrl = `https://sunziagent.com/x/`

  let userName = 'DonaldJ.Trump'
  const encodedUserName = encodeURIComponent(userName); // URL 转码

  const url = `${baseUrl}recent?userId=44196397&userName=${encodedUserName}`; // 追加至 URL 末尾
  
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();  // 正确解析 JSON
  console.log('data response:', JSON.stringify(data));
  xData.value.length = 0
  xData.value.push(...data)
}

</script>