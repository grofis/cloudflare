<template>
    <div class="container">
        <h1>{{ title }}</h1>
        <div class="input-section">
            <input v-model="inputText" placeholder="请输入文字..." @keyup.enter="addText">
            <button @click="addText">添加文字</button>
        </div>
        <div class="text-list">
            <div v-for="(text, index) in texts" :key="index" class="text-item">
                {{ text }}
                <button class="delete-btn" @click="deleteText(index)">删除</button>
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
                <a-list-item>

                    <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                        <a-list-item-meta>
                            <template #description>
                                <div>
                                    {{ `答案:${item.reaction.new_answer_num}/${item.reaction.answer_num} ` }}
                                    {{ `赞同:${item.reaction.new_upvote_num}/${item.reaction.upvote_num} ` }}
                                    {{ `关注:${item.reaction.new_follow_num}/${item.reaction.follow_num} ` }}
                                    {{ `浏览:${formatNumber(item.reaction.new_pv)}/${formatNumber(item.reaction.pv)} ` }}
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
import { ref, onMounted } from 'vue';
const initLoading = ref(false);
const loading = ref(false);

const title = ref('文字记录器')
const inputText = ref('')
const texts = ref([])

const addText = () => {
    if (inputText.value.trim()) {
        texts.value.push(inputText.value)
        inputText.value = ''
    }
}

const deleteText = (index) => {
    texts.value.splice(index, 1)
}

const questions = ref(
    [
    ]
);

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
        const response = await fetch('https://worker.qchunbhuil.workers.dev/data'); // Replace with your API URL
        const data = await response.json();
        console.log('length:', data)
        // data.map(item=>{
        //     return {}
        // })
        // Assuming the data structure matches the expected format
        questions.value.length = 0;
        questions.value.push(...data); // Update questions with fetched data
    } catch (error) {
        console.error('Error fetching questions:', error);
    } finally {
        initLoading.value = false; // Reset loading state
    }
};

const fetchData = async () => {
    initLoading.value = true; // Set loading state
    try {
        const response = await fetch('https://worker.qchunbhuil.workers.dev/zhihu'); // Replace with your API URL
        const data = await response.json();
        console.log('length:', data)

    } catch (error) {
        console.error('Error fetching questions:', error);
    } finally {
    }
};

onMounted(() => {
    fetchData(); // Fetch questions when the component is mounted
    fetchQuestions(); // Fetch questions when the component is mounted
});

const onLoadMore = () => { }

const getColorByNum = (num) => {
    const remainder = num % 10;
    const colorKey = Object.keys(colorMap)[remainder];
    return colorMap[colorKey];
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 5px;
}

h1 {
    color: #2c3e50;
    text-align: center;
}

.input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
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
</style>
