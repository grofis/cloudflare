<template>
    <div>
        <a-typography :style="{ margin: '5px 8px' }">
            <a-typography-text :style="{ fontSize: '1.2em' }">
                <a :href="`${questionUrl}${questionId}`" target="_blank"> {{ questionData?.title }}</a>
            </a-typography-text>
            <a-typography-paragraph>
                {{ questionData?.answer_num }}
                <a-typography-text type="secondary">个回答·</a-typography-text>

                {{ formatNumber(questionData?.pv) }}
                <a-typography-text type="secondary">浏览</a-typography-text>
                {{ questionData?.time_ago_create }}
                <a-typography-text type="secondary">提问</a-typography-text>
                <template v-if="questionData?.time_ago_create !== questionData?.time_ago_update">
                    ·{{ questionData?.time_ago_update }}
                    <a-typography-text type="secondary">更新</a-typography-text>
                </template>
            </a-typography-paragraph>
        </a-typography>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 0 8px;">
            <a-typography-text type="secondary">{{ saveTime }}</a-typography-text>
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
                            <div>
                                {{ item.author ? item.author.headline + '·' : '' }}{{
                                    item.time_ago_create }}
                                <a-typography-text type="secondary">发布</a-typography-text>
                                <template v-if="item?.time_ago_create !== item?.time_ago_update">
                                    ·{{ item?.time_ago_update }}
                                    <a-typography-text type="secondary">更新</a-typography-text>
                                </template>
                            </div>
                        </template>
                        <template #avatar><a-avatar :src="item.author.avatar_url" /></template>

                    </a-list-item-meta>
                    <!-- {{ item.excerpt.length > 150 ? item.excerpt.substring(0, 150) + '...' : item.excerpt }} -->
                    {{ item.excerpt }}
                    <a :href="`${questionUrl}${questionId}/answer/${item.answer_id}`" target="_blank">跳转</a>
                    <a-row v-if="item.images.length > 0">
                        <a-image-preview-group>
                            <!-- content第一条内容是文字，所以要item.content.slice(1)去除 -->
                            <a-col :span="8" v-for="(image, imgIndex) in item.images" :key="image.token"
                                class="image-col">
                                <a-image :src="image.url" :alt="image.height + 'x' + image.width"
                                    class="square-image" />
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
import moment from 'moment';
import { useRoute } from 'vue-router';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';

//状态定义
const route = useRoute();
let questionId = ref('');
const questionUrl = 'https://www.zhihu.com/question/';
const questionData = ref(null);
const listData = reactive([]);
const filters = ref('1');
const saveTime = ref('');

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

        if (processedData.length > 0) {
            // 更新列表数据
            listData.length = 0;
            listData.push(...processedData);
        }
        let endTime = performance.now();  // 结束时间
        let diffTime = ((endTime - startTime) / 1000).toFixed(2);
        saveTime.value = time + `答案用时 ${diffTime}s, 答案 ${processedData.length}条`;
        console.log('fetchAnswersData time:', endTime - startTime);
    } catch (error) {
        console.error('Error fetching answers:', error);
    }
};

const fetchQuestionDetails = async () => {
    try {
        const baseUrl = `${import.meta.env.VITE_API_URL}/zhihu/`
        const url = `${baseUrl}question?id=${questionId.value}`;
        const response = await fetch(url);
        console.log('url:', url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();  // 正确解析 JSON
        // console.log('data response:', JSON.stringify(data));

        // 从 initialState.entities.questions 中获取问题数据
        const questionDetails = data.initialState.entities.questions[questionId.value];

        if (questionDetails) {
            let questionObj = {}
            questionObj.title = questionDetails.title
            questionObj.answer_num = questionDetails.answerCount
            questionObj.pv = questionDetails.visitCount
            questionObj.created = questionDetails.created
            questionObj.updatedTime = questionDetails.updatedTime

            const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
            let timeDiff = (currentTime - questionDetails.created) * 1000; // 转换为毫秒
            questionObj.time_ago_create = formatTimeAgo(timeDiff);

            timeDiff = (currentTime - questionDetails.updatedTime) * 1000;
            questionObj.time_ago_update = formatTimeAgo(timeDiff);

            questionData.value = questionObj;
            saveTime.value = moment(data.saveTime).format('YYYY-MM-DD HH:mm:ss') + ' 获取问题信息，';
        }


        let answers = data.initialState.entities.answers
        // Convert answers object to array
        const answersArray = Object.values(answers);

        // Process the answers array
        const processedData = answersArray.map(processNewAnswerData);

        // Update list data
        listData.length = 0;
        listData.push(...processedData);
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
        author: { name: item.author.name, headline: item.author.headline, avatar_url: item.author.avatarUrl },
        answer_id: item.id,
        thumbnail_info: item.thumbnailInfo || { count: 0, thumbnails: [] }
    };

    // Use existing processAnswerData to maintain consistency
    return processAnswerData(processedItem);
};


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
    // 打印完整 URL 以查看格式
    questionId.value = route.params.id || window.location.pathname.split('/').pop();

    // 获取存储的问题数据
    const storedData = localStorage.getItem('questionData');
    console.log('storedData:', storedData)
    if (storedData) {
        let temp = JSON.parse(storedData);
        console.log('temp:', temp)
        let questionObj = {}
        questionObj.title = temp.question.title
        questionObj.answer_num = temp.reaction.answer_num
        questionObj.pv = temp.reaction.pv

        questionObj.created = temp.question.created
        questionObj.updatedTime = temp.question.updated_time

        const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
        let timeDiff = (currentTime - questionObj.created) * 1000; // 转换为毫秒
        questionObj.time_ago_create = formatTimeAgo(timeDiff);

        timeDiff = (currentTime - questionObj.updatedTime) * 1000;
        questionObj.time_ago_update = formatTimeAgo(timeDiff);


        questionData.value = questionObj
        localStorage.removeItem('questionData');
    }
    fetchQuestionDetails().then(() => {
        // 获取答案数据
        fetchAnswersData();
    })

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
