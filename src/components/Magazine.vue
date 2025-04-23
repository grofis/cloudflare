<template>
  <!-- 筛选条件 - 改为纵向排列 -->
  <div class="filter-section">
    <a-space direction="vertical" style="width: 100%">
      <div class="filter-item">
        <span class="filter-label">书名：</span>
        <a-radio-group v-model:value="book" @change="handleBookChange">
          <a-radio-button v-for="item in bookOptions" :value="item.id">{{ item.name }}</a-radio-button>
        </a-radio-group>
        <a-input-search placeholder="input search text" style="width: 200px" @search="onSearchClick" />
      </div>

      <div class="filter-item">
        <span class="filter-label">年份：</span>
        <a-radio-group v-model:value="year" @change="handleYearChange">
          <a-radio-button v-for="item in bookYears" :value="item">{{ item }}</a-radio-button>
        </a-radio-group>
      </div>

      <div class="filter-item">
        <span class="filter-label">期数：</span>
        <a-checkable-tag v-for="item in yearOptions" :key="item.issueId" :checked="category === item.issueId"
          @change="(checked) => handleCategoryChange(checked ? item.issueId : null)">
          {{ item.issueName }}
        </a-checkable-tag>
      </div>
    </a-space>
  </div>
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
import { useRouter } from 'vue-router';

const catalogData = ref([]);

const bookOptions = ref([{ id: '5207', name: '第一财经' }]);
const bookYears = ref([2025, 2024, 2023, 2022, 2021, 2020, 2019]);
const yearOptions = ref([{ issueId: '2025-01', issueName: '2025-01' }]);

const book = ref('5207');
const year = ref('2019');
const category = ref('2019-01');

const handleBookChange = () => {
  console.log('handleBookChange:', book.value);
  bookYears.value = bookOptions.value.find(item => item.id === book.value).years.reverse();
}

const handleYearChange = (value) => {
  console.log('handleYearChange:', value);
  fetchMagazineYearInfo();
}

const handleCategoryChange = (value) => {
  category.value = value;
  console.log('handleCategoryChange:', value);
  fetchMagazineCatalog();
}


const expandedItem = ref('');
// 添加切换显示/隐藏的方法
const toggleChildList = (index) => {
  expandedItem.value = index;
};
const router = useRouter();
const onSearchClick = (value) => {
  console.log('onSearchClick:', value);
  router.push({ path: '/magazine/search', query: { keyword: value } });
}

onMounted(() => {
  // fetchMagazineCatalog()
  fetchBookData();
  // fetchMagazineYearInfo();
});

const fetchBookData = async () => {
  let url = `${import.meta.env.VITE_API_URL}/magazine/init`
  let response = await fetch(url);
  let result = await response.json();
  console.log('result:', result);
  //bookOptions.value = result;
}

const fetchMagazineYearInfo = async () => {
  let url = `${import.meta.env.VITE_API_URL}/magazine/year/info?book=${book.value}&year=${year.value}`
  let response = await fetch(url);
  let result = await response.json();
  yearOptions.value = result.data;
  console.log('result:', result);
}

const fetchMagazineCatalog = async () => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/magazine/catalog/local?book=${book.value}&category=${category.value}`

    const response = await fetch(url);
    const result = await response.json();
    catalogData.value.length = 0;
    catalogData.value.push(...result.data);
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
