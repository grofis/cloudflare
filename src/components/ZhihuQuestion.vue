<template>
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
                                {{ `浏览:${item.reaction.new_pv}/${item.reaction.pv} ` }} 
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
</template>

<script setup>
import { ref,onMounted } from 'vue';
const initLoading = ref(false);
const loading = ref(false);

const questions = ref(
    [
        {
            "question": {
                "url": "https://www.zhihu.com/question/2920707420",
                "created": 1730544740,
                "updated_time": 1730544740,
                "title": "为什么电脑厂商用了二十多年时间才发现电源应该放在机箱下部？电源下置这么显而易见的结构这么晚才出现？",
                "highlight_title": "",
                "type": "question",
                "id": "2920707420",
                "token": 2920707420,
                "is_recent_hot": false,
                "have_answer": false,
                "question_answer_url": "",
                "topics": [
                    {
                        "url_token": 19550286,
                        "name": "个人电脑"
                    },
                    {
                        "url_token": 19552747,
                        "name": "英特尔 (Intel)"
                    },
                    {
                        "url_token": 19553309,
                        "name": "中央处理器 (CPU)"
                    }
                ],
                "label": "",
                "creator": {
                    "url_token": "",
                    "name": ""
                }
            },
            "reaction": {
                "new_pv": 89342,
                "new_pv_7_days": 0,
                "new_follow_num": 64,
                "new_follow_num_7_days": 0,
                "new_answer_num": 18,
                "new_answer_num_7_days": 0,
                "new_upvote_num": 438,
                "new_upvote_num_7_days": 0,
                "pv": 620296,
                "follow_num": 294,
                "answer_num": 79,
                "upvote_num": 1176,
                "pv_incr_rate": "0.00%",
                "head_percent": "0.00%",
                "new_pv_yesterday": 89342,
                "new_pv_t_yesterday": 89342,
                "score": 7.701924999999999,
                "score_level": 4,
                "text": ""
            }
        },
        {
            "question": {
                "url": "https://www.zhihu.com/question/3006118937",
                "created": 1730625504,
                "updated_time": 1730625504,
                "title": "如何评价牛津大学女数学博士@牛津kate朱朱？",
                "highlight_title": "",
                "type": "question",
                "id": "3006118937",
                "token": 3006118937,
                "is_recent_hot": false,
                "have_answer": false,
                "question_answer_url": "",
                "topics": [
                    {
                        "url_token": 19687143,
                        "name": "数学博士"
                    },
                    {
                        "url_token": 19704923,
                        "name": "牛津大学 (University of Oxford)"
                    },
                    {
                        "url_token": 20214391,
                        "name": "小红书"
                    }
                ],
                "label": "新题",
                "creator": {
                    "url_token": "",
                    "name": ""
                }
            },
            "reaction": {
                "new_pv": 21788,
                "new_pv_7_days": 0,
                "new_follow_num": 14,
                "new_follow_num_7_days": 0,
                "new_answer_num": 6,
                "new_answer_num_7_days": 0,
                "new_upvote_num": 593,
                "new_upvote_num_7_days": 0,
                "pv": 343502,
                "follow_num": 185,
                "answer_num": 65,
                "upvote_num": 3750,
                "pv_incr_rate": "0.00%",
                "head_percent": "0.00%",
                "new_pv_yesterday": 21788,
                "new_pv_t_yesterday": 21788,
                "score": 7.231037499999999,
                "score_level": 4,
                "text": ""
            }
        }
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

onMounted(() => {
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
</style>