<template>
    <template v-for="item in listData">
        <div style="background-color: aliceblue;">
            <a-typography :style="{ margin: '15px 0px 0px 0px', backgroundColor: 'white' }">
                <a-typography-text :style="{ fontSize: '1.2em' }">
                    <a :href="`${questionUrl}${item.info.id}`" target="_blank"> {{ item.info.title }}</a>
                </a-typography-text>
                <a-typography-paragraph>
                    判断结果:{{ judgment.score }}分，{{ judgment.reason }}
                </a-typography-paragraph>
                <a-typography-paragraph>
                    {{ item.info?.answerCount }}
                    <a-typography-text type="secondary">个回答·</a-typography-text>

                    {{ formatNumber(item.info?.visitCount) }}
                    <a-typography-text type="secondary">浏览</a-typography-text>
                    {{ item.info?.time_ago_create }}
                    <a-typography-text type="secondary">提问</a-typography-text>
                    <template v-if="questionData?.time_ago_create !== questionData?.time_ago_update">
                        ·{{ questionData?.time_ago_update }}
                        <a-typography-text type="secondary">更新</a-typography-text>
                    </template>
                    <a-tag color="cyan" :style="{cursor:'pointer'}" @click="showAnswers(item)">{{ item.answers.length }}条</a-tag>
                    <a-typography-text type="secondary">优质回答</a-typography-text>
                </a-typography-paragraph>
            </a-typography>
            <div style="margin: 0 0px; background-color: white;" v-if="item.isShow">
                <!-- <div style="display: flex; justify-content: space-between; align-items: center; margin: 0 8px;">
                    <a-typography-text type="secondary">{{ saveTime }}</a-typography-text>
                    <a-radio-group v-model:value="filters" button-style="solid" size="small"
                        @change="handleFilterChange">
                        <a-radio-button value="fastest">最快</a-radio-button>
                        <a-radio-button value="hotest">最热</a-radio-button>
                        <a-radio-button value="newest">最新</a-radio-button>
                    </a-radio-group>
                </div> -->
                <a-list item-layout="vertical" size="large" :data-source="item.answers">

                    <template #renderItem="{ item }">
                        <a-list-item key="item.id">

                            <template #actions>
                                <span v-for="{ icon, text } in item.actions" :key="icon">
                                    <component :is="icon" style="margin-right: 8px" />
                                    {{ text }}
                                </span>
                            </template>
                            <a-list-item-meta>
                                <template #title>
                                    <a :href="item.name">{{ item.author.name }}</a>
                                    
                                    <a-typography-text type="secondary"> {{ item?.author.follower_count }} 人关注</a-typography-text>
                                    <!-- <a-tag color="#50c8f8" v-if="item?.isFiltered">筛选结果</a-tag> -->
                                </template>
                                <template #description>
                                    <div>
                                        {{ item.author ? item.author.headline + '·' : '' }}{{
                                            item.time_ago_create }}
                                        <a-typography-text type="secondary">发布</a-typography-text>
                                        <template v-if="item?.time_ago_create !== item?.time_ago_update">
                                            ·{{ item?.time_ago_update }}
                                            <a-typography-text type="secondary">更新</a-typography-text>
                                        </template>
                                        ·{{ item?.content_length }}
                                        <a-typography-text type="secondary">字</a-typography-text>
                                    </div>
                                </template>
                                <template #avatar><a-avatar :src="item.author.avatar_url.split('?')[0]" /></template>

                            </a-list-item-meta>
                            {{ item.excerpt }}
                            <!-- <a :href="`${questionUrl}${questionId}/answer/${item.answer_id}`" target="_blank">跳转</a> -->


                        </a-list-item>
                    </template>
                </a-list>
            </div>
        </div>
    </template>
</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeUtils'
import { ref, onMounted, reactive } from 'vue';
import moment from 'moment';
import { useRoute } from 'vue-router';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';

//状态定义
const route = useRoute();
let questionId = ref('');
const questionUrl = 'https://www.zhihu.com/question/';
const questionData = ref(null);
let listData = reactive([]);
const filters = ref('1');
const saveTime = ref('');

import { GoogleGenerativeAI } from '@google/generative-ai';


const judgment = ref('');

async function generateStory() {
    try {
        console.log('generateStory:', import.meta.env.VITE_GOOGLE_API_KEY)

        // Initialize the GoogleGenerativeAI with your API key
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY); // Replace with your actual API key

        // Define the model and prompt
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let text = 'Evaluate the following content for its positivity and constructiveness. Consider aspects that are interesting, joyful, and worth spreading as positive and constructive. Conversely, consider complaints, verbal attacks, focus on the dark side of society, and deviation from mainstream values as negative and destructive. Provide a score from 1 to 10 for positive and constructive content, and -1 to -10 for negative and destructive content.'
        text += '\n\n'
        text += 'Please directly provide the judgment score and give the assessment reasons in Chinese. The reasons must be concise, clear, and compelling, either directly extracted from the content or summarized by you, within 50 characters.Return the evaluation in the following JSON format: {"isPositive": true/false, "score": [score], "reason": "[detailed reason in Chinese]"}.'
        text += '\n\n'
        text += `Here is the content to evaluate:`
        text += '\n\n'
        text += `Title: ${questionData.value.title}\n`
        text += `Detail:${questionData.value.detail}\n`
        // const prompt = "Write a story about a magic backpack.";

        // Generate content
        const result = await model.generateContent(text);
        const response = await result.response;
        let temp = await response.text();
        judgment.value = parseGeminiResponse(temp)
        console.log('story:', judgment.value)
    } catch (error) {
        console.error('Error generating story:', error);
    }
}

const parseGeminiResponse = (responseText) => {
    try {
        // 使用正则表达式匹配 JSON 内容
        const jsonMatch = responseText.match(/json\s*({[\s\S]*?})\s*/);
        if (jsonMatch && jsonMatch[1]) {
            // 解析匹配到的 JSON 字符串
            return JSON.parse(jsonMatch[1]);
        }
        throw new Error('No valid JSON found in response');
    } catch (error) {
        console.error('Error parsing response:', error);
        return null;
    }
};

//常量配置 
const createActionItems = (item) => [
    { icon: StarOutlined, text: item.thanks_count },
    { icon: LikeOutlined, text: item.voteup_count },
    { icon: MessageOutlined, text: item.comment_count },
];

//工具函数
const formatNumber = (num) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num;
};

// API 请求函数
const fetchAnswersData = async () => {
    try {
        let time = saveTime.value
        saveTime.value = time + ' 开始获取答案数据...';
        let startTime = performance.now();  // 开始时间
        const baseUrl = `${import.meta.env.VITE_API_URL}/zhihu/`
        // const baseUrl = 'https://worker.qchunbhuil.workers.dev/zhihu/' //localhost:8787
        // const baseUrl = 'http://localhost:8787/zhihu/' //localhost:8787
        const url = `${baseUrl}answer?id=${questionId.value}`;

        const response = await fetch(url);
        const data = await response.json();

        // 处理数据
        const processedData = data.map(processAnswerData);
        processedData.forEach(element => {
            element.isFiltered = true
        });

        if (processedData.length > 0) {
            // 创建新数据的 ID 集合
            const newDataIds = new Set(processedData.map(item => item.id));
            console.log('筛选前:', listData.length, listData);

            // 删除已存在的数据
            let temp = listData.filter(item => !newDataIds.has(item.id));

            // 合并数组：新数据在前，旧数据在后
            listData.length = 0;  // 清空原数组
            listData.push(...processedData, ...temp);  // 重新填充数据

            console.log('更新后:', listData.length, listData);
        }
        let endTime = performance.now();  // 结束时间
        let diffTime = ((endTime - startTime) / 1000).toFixed(2);
        saveTime.value = time + `答案用时 ${diffTime}s, 答案 ${processedData.length}条`;
        console.log('fetchAnswersData time:', endTime - startTime);
    } catch (error) {
        console.error('Error fetching answers:', error);
    }
};

// 处理图片宽度的函数
const processImageWidth = (detail) => {
    if (!detail) return '';

    // 使用正则表达式找到所有 img 标签并添加宽度样式
    return detail.replace(/<img[^>]*>/g, (match) => {
        // 如果已经有 style 属性，在其中添加 width
        if (match.includes('style="')) {
            return match.replace('style="', 'style="width: 300px; ');
        }
        // 如果没有 style 属性，添加新的 style 属性
        return match.replace('>', ' style="width: 300px;">');
    });
};

const fetchHighLikedAnswers = async () => {
    try {
        const url = `${import.meta.env.VITE_API_URL}/zhihu/high`
        const response = await fetch(url);
        console.log('url:', url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();  // 正确解析 JSON



        let questions = Object.values(data)

        const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）


        questions.forEach(temp => {
            let timeDiff = (currentTime - temp.info.created) * 1000; // 转换为毫秒
            temp.info.time_ago_create = formatTimeAgo(timeDiff);

            timeDiff = (currentTime - temp.info.updated_time) * 1000;
            temp.info.time_ago_update = formatTimeAgo(timeDiff);

            // 处理 info 对象，只保留需要的属性
            temp.info = {
                time_ago_create: temp.info.time_ago_create,
                time_ago_update: temp.info.time_ago_update,
                id: temp.info.id,
                title: temp.info.title,
                answerCount: temp.info.answerCount,
                visitCount: temp.info.visitCount
            }

            temp.answers = temp.answers.map(item => {
                return processNewAnswerData(JSON.parse(item.reaction))
            })

            temp.isShow = false
        })

        console.log('data response:', JSON.stringify(questions));
        listData.length = 0;
        listData.push(...questions);
    } catch (error) {
        console.error('Error fetching question details:', error);
    }
};

const processNewAnswerData = (item) => {
    // Create a reaction object that matches the expected format
    const reaction = {
        thanks_count: item.thanksCount,
        voteup_count: item.voteupCount,
        comment_count: item.commentCount
    };

    // Create processed item with all required fields
    const processedItem = {
        ...item,
        reaction: JSON.stringify(reaction), // Match the expected input format for processAnswerData
        created_time: item.createdTime,
        updated_time: item.updatedTime,
        author: { name: item.author.name, headline: item.author.headline, avatar_url: item.author.avatar_url, follower_count: item.author.follower_count },
        answer_id: item.id,
        thumbnail_info: item.thumbnailInfo || { count: 0, thumbnails: [] }
    };

    // Use existing processAnswerData to maintain consistency
    return processAnswerData(processedItem);
};

const showAnswers = (item) => {
    item.isShow = !item.isShow
}


//数据处理函数
const processAnswerData = (item) => {
    // 解析和合并 reaction 数据
    const reaction = JSON.parse(item.reaction);
    Object.assign(item, reaction);

    // 计算时间差并格式化

    const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
    let timeDiff = (currentTime - item.created_time) * 1000; // 转换为毫秒

    item.response_time = timeDiff;
    item.time_ago_create = formatTimeAgo(timeDiff);

    timeDiff = (currentTime - item.updated_time) * 1000;
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

//排序相关函数
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

//事件处理函数
const handleFilterChange = (e) => {
    sortData(e.target.value);
};

// 生命周期钩子
onMounted(() => {
    fetchHighLikedAnswers()

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

:deep(.ant-typography),
:deep(.ant-typography p) {
    margin-bottom: 0px;
}

:deep(.ant-tag) {
    margin-inline-start: 5px;
    margin-inline-end: 0px;
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
    background-color: #FFFFCC;
    /* 举例背景色，根据需要调整 */
    text-align: center;
    /* 内容居中显示 */
    border: 1px solid #faad14;
    margin-bottom: 5px;
    padding: 8px 4px;
    /* position: relative; */
    box-sizing: border-box;
    /* 确保padding包括在内 */
    /* 使内部元素可以绝对定位 */
}


.square-image {
    /* position: absolute; */
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
