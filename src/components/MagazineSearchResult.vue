<template>

  <div class="table-content">
    <template v-for="(item, index) in catalogData" :key="index">
      <div>
        <h3 v-if="item.sublevels && item.sublevels.length > 1" class="magazine-title-children"
          @click="toggleChildList(index)">
          {{ item.name }}
          <span>·{{ item.sublevels.length }}</span>
          <component :is="expandedItem === index ? UpOutlined : RightOutlined" :style="{ fontSize: '0.8em' }" />
        </h3>
        <div v-else-if="item.sublevels && item.sublevels.length === 1">
          <h3 class="magazine-title-children">{{ item.name }}
          </h3>
          <span class="magazine-title-none"> - {{ item.sublevels[0].name }}</span>
        </div>
        <h3 v-else-if="item.sublevels && item.sublevels.length === 1" class="magazine-title-children">
          {{ item.name }}
          <span class="magazine-title-none"> {{ item.sublevels[0].name }}</span>
        </h3>
        <span class="magazine-title-none" v-else>{{ item.name }}</span>
      </div>

      <a-list v-if="item.sublevels && item.sublevels.length > 0" size="large" bordered :data-source="item.sublevels"
        v-show="expandedItem === index" style="margin-left: 20px;">
        <template #renderItem="{ item: subItem }">
          <a-list-item>
            <a :href="subItem.url" target="_blank">{{ subItem.name }}</a>
          </a-list-item>
        </template>
      </a-list>
    </template>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { UpOutlined, RightOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router'



const router = useRoute()
const keyword = router.query.keyword
console.log('Received keyword:', keyword)

const catalogData = ref([]);
onMounted(() => {
  fetchMagazineCatalog()
});





const fetchMagazineCatalog = async () => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/magazine/search?keyword=${keyword}`

    const response = await fetch(url);
    const result = await response.json();
    console.log('magazine result:', result)
    catalogData.value.length = 0;
    catalogData.value.push(...result);
    console.log('result:', result);
  } catch (error) {
    console.error('Error fetching question details:', error);
  }
};
</script>
<style scoped>
:deep(.ant-list-lg .ant-list-item) {
  padding: 8px 5px;
}

:deep(.magazine-title-children) {
  margin: 16px 0;
  cursor: pointer;
}

:deep(.magazine-title-children):hover {
  opacity: 0.8;
}

:deep(.magazine-title-none) {
  display: block;
  margin: 5px 0;
}
</style>
