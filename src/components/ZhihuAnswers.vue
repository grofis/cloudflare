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
        <a-list item-layout="vertical" size="large" :data-source="listData">

            <template #renderItem="{ item }">
                <a-list-item key="item.title">

                    <template #actions>
                        <span v-for="{ icon, text } in item.actions" :key="icon">
                            <component :is="icon" style="margin-right: 8px" />
                            {{ text }}
                        </span>
                    </template>

                    <!-- <template #extra v-if="item.thumbnail_info.count > 0">
                        <img width="272" alt="logo" :src="item.thumbnail_info?.thumbnails[0]?.url" />
                    </template> -->
                    <a-list-item-meta>
                        <template #title>
                            <a :href="item.name">{{ item.author.name }}</a>
                        </template>
                        <template #description>
                            <a-typography-text type="secondary">{{ item.author ? item.author.headline + '·' : '' }}{{
                                item.time_ago_create }}发布{{ item.time_ago_create !== item.time_ago_update ?
                                    '·' + item.time_ago_update + '更新' : '' }}</a-typography-text>
                        </template>
                        <template #avatar><a-avatar :src="item.author.avatar_url" /></template>
                    </a-list-item-meta>
                    <!-- {{ item.excerpt.length > 150 ? item.excerpt.substring(0, 150) + '...' : item.excerpt }} -->
                    {{ item.excerpt }}
                    <a :href="`${questionUrl}${questionId}/answer/${item.answer_id}`" target="_blank">跳转</a>
                    <a-row v-if="item.images.length > 0">
                        <a-image-preview-group>
                            <!-- content第一条内容是文字，所以要item.content.slice(1)去除 -->
                            <a-col :span="8" v-for="(image, imgIndex) in item.images"
                                :key="image.token" class="image-col">
                                <a-image :src="image.url" :alt="image.height + 'x' + image.width" class="square-image" />
                                <!-- {{ 'image-' + item.id + '-' + imgIndex }} -->
                            </a-col>
                        </a-image-preview-group>
                    </a-row>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeUtils'
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';

// ================ 状态定义 ================
const route = useRoute();
let questionId = ref('');
const questionUrl = 'https://www.zhihu.com/question/';
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
    item.images = [];
    if (item.thumbnail_info.count > 0) {
        item.images.push(...item.thumbnail_info.thumbnails) 
    }
    delete item.thumbnail_info;

    return item;
};

// ================ API 请求函数 ================
const fetchAnswersData = async () => {
    try {
        const baseUrl = 'https://worker.qchunbhuil.workers.dev/zhihu/' //localhost:8787
        // const baseUrl = 'http://localhost:8787/zhihu/' //localhost:8787
        const url = `${baseUrl}answer?id=${questionId.value}`;
        console.log('url:', url);
        const response = await fetch(url);
        console.log('response:', response);
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
    // 打印完整 URL 以查看格式
    console.log('Current URL:', window.location.pathname);

    questionId.value = route.params.id || window.location.pathname.split('/').pop();


    // 获取存储的问题数据
    const storedData = localStorage.getItem('questionData');
    if (storedData) {
        questionData.value = JSON.parse(storedData);
        localStorage.removeItem('questionData');
    }

    // 获取答案数据
    fetchAnswersData();
    console.log('data is', questionId, questionData.value);
});
</script>

<style scoped>
.filter-container {
    display: flex;
    justify-content: flex-end;
}


:deep(.ant-spin-container .ant-list-items .ant-list-item) {
    padding: 8px;
}

:deep(.ant-list-item-meta-title),
:deep(.ant-list-item .ant-list-item-meta) {
    margin-bottom: 4px;
}

:deep(.ant-list .ant-list-item .ant-list-item-meta .ant-list-item-meta-avatar) {
    margin-inline-end: 8px;
}

.image-col {
    aspect-ratio: 1 / 1;
    /* 确保宽高比为1:1 */
    overflow: hidden;
    /* 确保内容不溢出 */
    display: flex;
    /* 使内部内容居中 */
    align-items: center;
    justify-content: center;
    /* background-color: #FFFFCC; */
    /* 举例背景色，根据需要调整 */
    text-align: center;
    /* 内容居中显示 */
    border: 0px solid #faad14;
    /* margin-bottom: 5px; */
    /* padding: 8px 4px; */
    position: relative;
    box-sizing: border-box;
    /* 确保padding包括在内 */
    /* 使内部元素可以绝对定位 */
}


.square-image {
    position: absolute;
    /* 绝对定位以充满父容器 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
    /* 保持图片比例，并裁剪以填充整个容器 */
    object-position: center;
    /* 使图片的中心部分显示在容器中间 */
}
</style>
