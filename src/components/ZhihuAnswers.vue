<template>
    <div>
        <a-typography>
            <a-typography-text strong :style="{ fontSize: '1.2em' }">{{ questionData?.question?.title
                }}</a-typography-text>
            <a-typography-paragraph>
                {{ questionData?.reaction?.answer_num }}
                <a-typography-text type="secondary">个回答·</a-typography-text>

                {{ formatNumber(questionData?.reaction?.pv) }}
                <a-typography-text type="secondary">浏览</a-typography-text>
            </a-typography-paragraph>
        </a-typography>
        <div style="display: flex; justify-content: flex-end;">
            <a-radio-group v-model:value="filters" button-style="solid" size="small" @change="handleFilterChange">
                <a-radio-button value="fastest">最快</a-radio-button>
                <a-radio-button value="hotest">最热</a-radio-button>
                <a-radio-button value="newest">最新</a-radio-button>
            </a-radio-group>
        </div>
        <a-list item-layout="horizontal" size="large" :data-source="listData">

            <template #renderItem="{ item }">
                <a-list-item key="item.title">

                    <template #actions>
                        <span v-for="{ icon, text } in item.actions" :key="icon">
                            <component :is="icon" style="margin-right: 8px" />
                            {{ text }}
                        </span>
                    </template>
                    <template #extra v-if="item.thumbnail_info.count > 0">
                        <img width="272" alt="logo" :src="item.thumbnail_info.thumbnails[0]" />
                    </template>
                    <a-list-item-meta>
                        <template #title>
                            <a :href="item.name">{{ item.author.name }}</a>
                        </template>
                        <template #description>
                            <a-typography-text type="secondary">{{ item.author ? item.author.headline + '·' : '' }}{{
                                item.time_ago_create }}发布{{ item.time_ago_create !== item.time_ago_update ?
                                    '·' +item.time_ago_update+'更新' : '' }}</a-typography-text>
                        </template>
                        <template #avatar><a-avatar :src="item.author.avatar_url" /></template>
                    </a-list-item-meta>
                    {{ item.excerpt.length > 150 ? item.excerpt.substring(0, 150) + '...' : item.excerpt }}
                    <a :href="`${questionData.question.url}/answer/${item.answer_id}`" target="_blank">跳转</a>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';

// ================ 状态定义 ================
const route = useRoute();
const questionId = route.params.id;
const questionData = ref(null);
const listData = reactive([]);
const filters = ref('1');

// ================ 常量配置 ================
const createActionItems = (item) => [
    { icon: StarOutlined, text: item.thanks_count },
    { icon: LikeOutlined, text: item.voteup_count },
    { icon: MessageOutlined, text: item.comment_count },
];

// ================ 工具函数 ================
const formatNumber = (num) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num;
};

const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}天前`;
    }
    if (hours > 0) {
        return `${hours}小时前`;
    }
    if (minutes > 0) {
        return `${minutes}分钟前`;
    }
    return `${seconds}秒前`;
};

// ================ 数据处理函数 ================
const processAnswerData = (item) => {
    // 解析和合并 reaction 数据
    const reaction = JSON.parse(item.reaction);
    Object.assign(item, reaction);

    // 计算时间差并格式化

    const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
    let timeDiff = (currentTime - item.created_time) * 1000; // 转换为毫秒

    item.response_time = timeDiff;
    console.log('create timeDiff', timeDiff);
    item.time_ago_create = formatTimeAgo(timeDiff);

    timeDiff = (currentTime - item.updated_time) * 1000;
    console.log('update timeDiff', timeDiff);
    item.time_ago_update = formatTimeAgo(timeDiff);

    // 添加操作按钮数据和计算得分
    item.actions = createActionItems(item);
    item.num = item.voteup_count * 1.2 + item.thanks_count + item.comment_count * 1.5;

    return item;
};

// ================ API 请求函数 ================
const fetchQuestionData = async () => {
    try {
        const response = await fetch(`http://localhost:8787/answer?id=${questionId}`);
        const data = await response.json();

        // 处理数据
        const processedData = data.map(processAnswerData);

        // 更新列表数据
        listData.length = 0;
        listData.push(...processedData);

        console.log('listData', listData);
    } catch (error) {
        console.error('Error fetching answers:', error);
    }
};

const fetchQuestionDetails = async () => {
    try {
        const response = await fetch(`http://localhost:8787/question?id=${questionId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching question details:', error);
    }
};

// ================ 排序相关函数 ================
const sortStrategies = {
    'fastest': (a, b) => (b.num / b.response_time) - (a.num / a.response_time), // 最快
    'hotest': (a, b) => b.num - a.num, // 最热
    'newest': (a, b) => new Date(b.created_time) - new Date(a.created_time), // 最新
};

const sortData = (type) => {
    const sortFn = sortStrategies[type];
    if (sortFn) {
        const sortedData = [...listData].sort(sortFn);
        listData.length = 0;
        listData.push(...sortedData);
    }
};

// ================ 事件处理函数 ================
const handleFilterChange = (e) => {
    sortData(e.target.value);
};

// ================ 生命周期钩子 ================
onMounted(() => {
    // 获取存储的问题数据
    const storedData = localStorage.getItem('questionData');
    if (storedData) {
        questionData.value = JSON.parse(storedData);
        localStorage.removeItem('questionData');
    }

    // 获取答案数据
    fetchQuestionData();
    console.log('data is', questionId, questionData.value);
});
</script>

<style scoped>
.filter-container {
    display: flex;
    justify-content: flex-end;
}


</style>