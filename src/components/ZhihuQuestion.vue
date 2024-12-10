<template>
    <div class="container">
        <h1>{{ title }}</h1>
        <div class="input-section">
            <input v-model="inputText" placeholder="请输入关键词..." @keyup.enter="addText">
            <button @click="addText">搜索</button>
        </div>
        <div class="text-list">
            <div v-for="(text, index) in texts" :key="index" class="text-item">
                {{ text }}
                <button class="delete-btn" @click="deleteText(index)">删除</button>
            </div>
        </div>

        <div class="radio-group-container">
            <div class="text-wrapper">
                <a-typography-text type="secondary">{{ saveTime }}获取</a-typography-text>
            </div>
            <div class="tags-wrapper">
                <a-checkable-tag v-for="(tag, index) in tagsData" :key="tag.name"
                        v-model:checked="selectTags[index]" @change="checked => handleChange(tag, checked)"
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
                    <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                        <a-list-item-meta>
                            <template #description>
                                <div>
                                    {{ `${item.reaction.new_answer_num}/${item.reaction.answer_num}回答· ` }}
                                    {{ `${item.reaction.new_upvote_num}/${item.reaction.upvote_num}赞同·` }}
                                    {{ `${item.reaction.new_follow_num}/${item.reaction.follow_num}关注·` }}
                                    {{ `${formatNumber(item.reaction.new_pv)}/${formatNumber(item.reaction.pv)}浏览` }}
                                </div>
                            </template>
                            <template #title>
                                <a :href="item.question.url" target="_blank">{{ item.question.title }}</a>
                                <a-tag v-for="tag in item.question.topics" :key="tag" color="default">
                                    {{ tag.name }}
                                </a-tag>
                            </template>
                            <template #avatar>
                                <a-avatar size="large"
                                    :style="{ backgroundColor: getColorByNum(item.reaction.answer_num), verticalAlign: 'middle' }"
                                    :gap="4">
                                    {{ item.reaction.answer_num }}
                                </a-avatar>
                            </template>
                        </a-list-item-meta>
                    </a-skeleton>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>


<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const initLoading = ref(false);
const loading = ref(false);
import { formatTimeAgo } from '@/utils/timeUtils'



const title = ref('熊猫说')
const inputText = ref('')
const texts = ref([])
const saveTime = ref('')

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

const fetchQuestions = async () => {
    initLoading.value = true; // Set loading state
    try {
        let startTime = performance.now();  // 开始时间
        const url = `${import.meta.env.VITE_API_URL}/zhihu/data`
        console.log('请求URL:', url)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        const data = await response.json();
        let endTime = performance.now();    // 结束时间
        let duration = endTime - startTime; // 计算耗时
        startTime = endTime
        console.log(`网络请求耗时: ${duration.toFixed(2)}ms`);
        console.log(`数据长度: ${data.data.length}`);
        
        saveTime.value = data.saveTime
        data.data.map(item => {
            let temp = item.reaction.new_pv + item.reaction.new_follow_num * 1.5 + item.reaction.new_upvote_num * 1.2
            let num = 0
            if (item.reaction.new_answer_num > 0) {
                num = temp / item.reaction.new_answer_num
            }
            item.reaction.num = num
            const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
            let timeDiff = (currentTime - item.question.created) * 1000; // 转换为毫秒
            item.question.topics.push({ name: formatTimeAgo(timeDiff) + '创建' });
            timeDiff = (currentTime - item.question.updated_time) * 1000;
            item.question.topics.push({ name: formatTimeAgo(timeDiff) + '更新' });

            return item
        })
        // Assuming the data structure matches the expected format
        questions.value.length = 0;
        questions.value.push(...data.data); // Update questions with fetched data
        srcData.value.length = 0;
        srcData.value.push(...data.data);
        console.log(questions.value)

        endTime = performance.now();
        duration = endTime - startTime;
        console.log(`数据处理耗时: ${duration.toFixed(2)}ms`);
    } catch (error) {
        console.error('Error fetching questions:', error);
    } finally {
        initLoading.value = false; // Reset loading state
    }
};

onMounted(() => {
    fetchQuestions(); // Fetch questions when the component is mounted
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
    // 先将数据存储到 localStorage
    localStorage.setItem('questionData', JSON.stringify(item));

    const route = router.resolve({
        name: 'Answers',
        params: { id: item.question.id }
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



h1 {
    color: #2c3e50;
    text-align: center;
}

.input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
}

input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 8px 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
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
</style>
