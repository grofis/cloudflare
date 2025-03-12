<template>
    <div class="container" style="background-color: white;">
        <a-row justify="start">
            <a-col :span="4" class="icon-container">
                <router-link :to="'/cctv'" target="_blank">
                    <GlobalOutlined :style="{ color: '#FF0000' }" />
                    <div>CCTV</div>
                </router-link>
            </a-col>
            <a-col :span="4" class="icon-container">
                <router-link :to="'/btc'" target="_blank">
                    <DollarCircleOutlined :style="{ color: '#F7931A' }" />
                    <div>BTC</div>
                </router-link>
            </a-col>
            <a-col :span="4" class="icon-container">
                <router-link :to="'/x'" target="_blank">
                    <TwitterOutlined :style="{ color: '#1DA1F2' }" />
                    <div>Twitter</div>
                </router-link>
            </a-col>
            <a-col :span="4" class="icon-container">
                <router-link :to="'/'" target="_blank">
                    <BulbOutlined :style="{ color: '#FFA000' }" />
                    <div>想法</div>
                </router-link>
            </a-col>
            <a-col :span="4" class="icon-container">
                <router-link :to="'/people'" target="_blank">
                    <UserOutlined :style="{ color: '#9C27B0' }" />
                    <div>人物</div>
                </router-link>
            </a-col>
            <a-col :span="4" class="icon-container">
                <router-link :to="'/stock'" target="_blank">
                    <StockOutlined :style="{ color: '#4CAF50' }" />
                    <div>股市</div>
                </router-link>
            </a-col>
        </a-row>
        <a-row justify="start" style="margin-top: 10px;">
            <a-col :span="4" class="icon-container">
                <router-link :to="'/zhihu/high'" target="_blank">
                    <StarOutlined :style="{ color: '#4CAF50' }" />
                    <div>高赞</div>
                </router-link>
            </a-col>
            <a-col :span="4" class="icon-container">
                <router-link :to="'/zhihu/hot'" target="_blank">
                    <FireOutlined :style="{ color: '#FFA000' }" />
                    <div>热门</div>
                </router-link>
            </a-col>
            <a-col :span="4" class="icon-container">
                <router-link :to="'/translate'" target="_blank">
                    <TranslationOutlined :style="{ color: '#0066CC' }" />
                    <div>翻译</div>
                </router-link>
            </a-col>
            <a-col :span="4" class="icon-container">
                <router-link :to="'/fund'" target="_blank">
                    <LineChartOutlined :style="{ color: '#009933' }" />
                    <div>基金</div>
                </router-link>
            </a-col>
        </a-row>
        

        <div class="input-section">
            <input v-model="inputText" placeholder="请输入关键词..." @keyup.enter="addText">
            <button @click="addText" class="search-btn">搜索</button>
        </div>
        <div class="text-list">
            <div v-for="(text, index) in texts" :key="index" class="text-item">
                {{ text }}
                <button class="delete-btn" @click="deleteText(index)">删除</button>
            </div>
        </div>
        <div>
            <div>
                <a-checkable-tag v-for="topic in topics" :key="topic.id" :checked="selectedTopicId === topic.id"
                    @change="checked => handleTopicChange(topic.id, checked)">
                    {{ topic.name }}
                </a-checkable-tag>
            </div>
        </div>

        <div class="radio-group-container">
            <div class="text-wrapper">
                <a-typography-text type="secondary">{{ saveTime }}</a-typography-text>
            </div>
            <div class="tags-wrapper">
                <a-checkable-tag v-for="(tag, index) in tagsData" :key="tag.name" v-model:checked="selectTags[index]"
                    @change="checked => handleChange(tag, checked)"
                    :style="{ backgroundColor: getTagBackgroundColor(tag) }">
                    {{ tag.order ? `${tag.name}${tag[tag.order]}` : tag.name }}
                </a-checkable-tag>
            </div>
        </div>
        <a-list class="demo-loadmore-list" :loading="initLoading" item-layout="horizontal" :data-source="questions">
            <template #loadMore>
                <div v-if="!initLoading && !loading"
                    :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-button @click="onLoadMore">loading more</a-button>
                </div>
            </template>
            <template #renderItem="{ item }">
                <a-list-item @click="handleItemClick(item)">
                    <template #extra>
                        <a-avatar-group>
                            <template v-for="topic in item.topics">
                                <a-tooltip v-if="topic && topic.avatarUrl" placement="top" :title="topic.name">
                                    <a :href="`https://www.zhihu.com/topic/${topic.id}/hot`" target="_blank"
                                        class="author-link">
                                        <a-avatar :src="topic.avatarUrl" style="background-color: #87d068">
                                        </a-avatar>
                                    </a>
                                </a-tooltip>
                            </template>
                        </a-avatar-group>
                    </template>
                    <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                        <a-list-item-meta>
                            <template #description>

                                <div>
                                    {{ `${item.new_answer_num}/${item.answer_num}回答· ` }}
                                    {{ `${item.new_upvote_num}/${item.upvote_num}赞同·` }}
                                    {{ `${item.new_follow_num}/${item.follow_num}关注·` }}
                                    {{ `${formatNumber(item.new_pv)}/${formatNumber(item.pv)}浏览` }}
                                </div>

                            </template>
                            <template #title>
                                <a :href="item.url" target="_blank">{{ item.title }}</a>
                                <template v-for="tag in item.topics">
                                    <a-tag v-if="tag && !tag.avatarUrl" :key="tag" color="default">
                                        {{ tag.name }}
                                    </a-tag>
                                </template>
                            </template>
                            <template #avatar>
                                <a :href="`https://www.zhihu.com/people/${item.author?.urlToken}`" target="_blank"
                                    class="author-link">
                                    <a-tooltip placement="top" :title="item.author?.name">
                                        <div class="avatar-container">
                                            <a-avatar size="large" :src="item.author?.avatarUrl"
                                                style="background-color: #87d068">
                                            </a-avatar>
                                            <a-typography-text type="secondary" class="author-name">
                                                {{ truncateName(item.author?.name) }}
                                            </a-typography-text>
                                        </div>
                                    </a-tooltip>
                                </a>
                            </template>
                        </a-list-item-meta>
                    </a-skeleton>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>


<script setup>
import moment from 'moment';
import 'moment/dist/locale/zh-cn';  // 导入中文语言包
moment.locale('zh-cn');  // 设置为中文

import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { formatTimeAgo } from '@/utils/timeUtils'
import {
    GlobalOutlined,
    DollarCircleOutlined,
    TwitterOutlined,
    BulbOutlined,
    UserOutlined,
    StockOutlined,
    StarOutlined,
    FireOutlined,
    TranslationOutlined,
    LineChartOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const initLoading = ref(false);
const loading = ref(false);

// 使用数组渲染按钮
const topics = [
    { id: '0', name: '全部' },
    { id: '1000013', name: '科技互联网' },
    { id: '1000002', name: '科学工程' },
    { id: '1000012', name: '经济与管理' },
    { id: '1000021', name: '人文' },
    { id: '1000010', name: '运动健身' },
    { id: '1000025', name: '体育竞技' },
    { id: '1000022', name: '教育' },
    { id: '1000020', name: '艺术' },
    { id: '1000028', name: '娱乐' },
    { id: '1000011', name: '旅行' },
    { id: '1000009', name: '数码' }
];




const title = ref('熊猫说')
const inputText = ref('')
const texts = ref([])
const saveTime = ref('')
const selectedTopicId = ref('0');
const handleTopicChange = (topicId, checked) => {
    selectedTopicId.value = checked ? topicId : null;
    handleTopicClick(topicId);  // 调用原有的点击处理函数
};

const tagsData = reactive([
    { name: '默认', asc: '', desc: '', type: 'default', order: null },
    { name: '答案', asc: '少', desc: '多', type: 'answer_num', order: null },
    { name: '点赞', asc: '少', desc: '多', type: 'new_upvote_num', order: null },
    { name: '关注', asc: '少', desc: '多', type: 'new_follow_num', order: null },
    { name: '浏览', asc: '少', desc: '多', type: 'new_pv', order: null },
    { name: '涨粉', asc: '少', desc: '多', type: 'num', order: null }
]);
const selectTags = reactive([false, false, false, false, false, false]);
const handleChange = (tag, checked) => {
    // 更新 selectTags，确保只有当前选中的标签为 true
    selectTags.forEach((_, index) => {
        if (tagsData[index] === tag) {
            if (tagsData[index].order === 'asc') {
                tagsData[index].order = 'desc';
                selectTags[index] = true; // 当前选中的标签保持其 checked 状态
            } else if (tagsData[index].order === 'desc') {
                tagsData[index].order = null;
                selectTags[index] = false;
            } else {
                tagsData[index].order = 'asc';
                selectTags[index] = true;
            }
        } else {
            selectTags[index] = false; // 其他标签的 checked 状态为 false
            tagsData[index].order = null; // 其他标签的 order 设置为 null
        }
    });

    // 根据选中的标签进行排序
    const selectedTag = tagsData.find((t, index) => selectTags[index]);
    if (selectedTag && selectedTag.type !== 'default') {
        sortQuestions(selectedTag.type, selectedTag.order);
    } else {
        questions.value.length = 0;
        questions.value.push(...srcData.value);
    }
    console.log(tag, checked);
};

const truncateName = (name) => {
    if (!name) {
        return '';
    }
    if (name.length === 4) {
        return name.slice(0, 2)
    }
    return name.slice(0, 3);
}

const handleAuthorClick = (e) => {
    // 允许链接正常打开，但阻止事件冒泡
    e.stopPropagation();
}

const sortQuestions = (type, order) => {
    if (order === null) {
        // 如果 order 为 null，保持原有顺序
        questions.value.length = 0;
        questions.value.push(...srcData.value);
        return;
    }
    questions.value.sort((a, b) => {
        if (order === 'asc') {
            return a['reaction'][type] - b['reaction'][type];
        } else {
            return b['reaction'][type] - a['reaction'][type];
        }
    });
};

const addText = () => {
    if (inputText.value.trim()) {
        texts.value.push(inputText.value)
        if (inputText.value.includes('https://www.zhihu.com/question/')) {
            const questionId = extractQuestionId(inputText.value);

            inputText.value = ''
            console.log('questionId:', questionId)
            if (questionId) {
                const route = router.resolve({
                    name: 'Answers',
                    params: { id: questionId }
                });
                console.log('Generated URL:', route.href);  // 打印实际生成的 URL

                window.open(route.href, '_blank');
            }
        } else {
            const route = router.resolve({
                name: 'ZhihuSearch',
                params: { keywords: inputText.value }
            });
            console.log('Generated URL:', route.href);  // 打印实际生成的 URL

            window.open(route.href, '_blank');
        }
    }
}

function extractQuestionId(url) {
    const match = url.match(/question\/(\d+)/);
    return match ? match[1] : null;
}

const deleteText = (index) => {
    texts.value.splice(index, 1)
}

const questions = ref([]);
const srcData = ref([]);

const colorMap = {
    processing: '#108ee9',
    success: '#00a854',
    error: '#f44336',
    warning: '#ffbf00',
    magenta: '#eb2f96',
    red: '#f5222d',
    volcano: '#fa541c',
    orange: '#fa8c16',
    gold: '#faad14',
    lime: '#a0d911',
    green: '#52c41a',
    cyan: '#13c2c2',
    blue: '#1890ff',
    geekblue: '#2f54eb',
    purple: '#722ed1'
};

const formatNumber = (num) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num;
};

const handleTopicClick = async (topicId) => {
    const loadingStartTime = performance.now();  // Record the start time of loading
    initLoading.value = true; // Set loading state
    try {
        let startTime = performance.now();  
        let url = `${import.meta.env.VITE_API_URL}/zhihu/current?topicId=${topicId}`
        console.log('请求URL:', url)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        let data = await response.json();
        console.log('data:', data)
        // data = data.data
        let endTime = performance.now();    // 结束时间
        let duration = endTime - startTime; // 计算耗时
        startTime = endTime
        console.log(`网络请求耗时: ${duration.toFixed(2)}ms`);
        console.log(`数据长度: ${data.length}`);

        saveTime.value = moment(data[0].saveTime).format('MM-DD HH:mm:ss') + ' 获取';
        data.map(item => {
            let temp = item.new_pv + item.new_follow_num * 1.5 + item.new_upvote_num * 1.2
            let num = 0
            if (item.new_answer_num > 0) {
                num = temp / item.new_answer_num
            }
            item.num = num
            const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
            let timeDiff = (currentTime - item.created) * 1000; // 转换为毫秒
            if (!item.topics) {
                item.topics = []
            }
            item.topics.push({ name: formatTimeAgo(timeDiff) + '创建' });
            timeDiff = (currentTime - item.updated_time) * 1000;
            item.topics.push({ name: formatTimeAgo(timeDiff) + '更新' });

            return item
        })
        // Assuming the data structure matches the expected format
        questions.value.length = 0;
        questions.value.push(...data); // Update questions with fetched data
        srcData.value.length = 0;
        srcData.value.push(...data);
        console.log(questions.value)

        endTime = performance.now();
        duration = endTime - startTime;
        console.log(`数据处理耗时: ${duration.toFixed(2)}ms`);
    } catch (error) {
        console.error('Error fetching questions:', error);
    } finally {
        initLoading.value = false; // Reset loading state
        const loadingEndTime = performance.now();
        const totalLoadingTime = loadingEndTime - loadingStartTime;
        console.log(`总加载时间: ${totalLoadingTime.toFixed(2)}ms`);
        saveTime.value = saveTime.value + ` 用时: ${(totalLoadingTime / 1000).toFixed(2)}s`
    }
};

onMounted(() => {
    handleTopicClick(topics[0].id); // Fetch questions when the component is mounted
});

const onLoadMore = () => { }

const getColorByNum = (num) => {
    const remainder = num % 10;
    const colorKey = Object.keys(colorMap)[remainder];
    return colorMap[colorKey];
};

// 根据标签的类型和排序状态返回背景颜色
const getTagBackgroundColor = (tag) => {
    const order = tag.order;
    if (order === 'asc') {
        return '#f50'; // asc 背景颜色
    } else if (order === 'desc') {
        return '#2db7f5'; // desc 背景颜色
    }
    return ''; // 默认背景颜色
};

const handleItemClick = (item) => {
    const route = router.resolve({
        name: 'Answers',
        params: { id: item.id }
    });
    console.log('Generated URL:', route.href);  // 打印实际生成的 URL

    window.open(route.href, '_blank');
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 5px;
}

.radio-group-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0px;
}

.text-wrapper {
    flex-shrink: 0;
}

.tags-wrapper {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.avatar-container {
    display: flex;
    flex-direction: column;
    /* 改为垂直方向排列 */
    align-items: center;
    /* 水平居中 */
    gap: 4px;
    /* 元素之间的间距 */
}

/* .author-link {
    display: block;
    text-decoration: none;
    cursor: pointer;
} */

.author-name {
    font-size: 12px;
}

.icon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

h1 {
    color: #2c3e50;
    text-align: center;
}

.input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    margin-top: 8px;
}

input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.search-btn {
    padding: 8px 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-btn:hover {
    background-color: #3aa876;
}

.text-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.text-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.delete-btn {
    background-color: #dc3545;
    padding: 4px 8px;
    font-size: 0.8em;
}

.delete-btn:hover {
    background-color: #c82333;
}

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

:deep(.ant-spin-container .ant-list-items .ant-list-item) {
    padding: 10px 0px;
}

.radio-group-container {
    display: flex;
    justify-content: flex-end;
}

.icon-container a {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
}

.icon-container a:hover {
    opacity: 0.8;
}
</style>
