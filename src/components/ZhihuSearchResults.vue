<template>
    <div style="background-color: aliceblue;">
        <div class="input-section">
            <input v-model="inputText" placeholder="请输入关键词..." @keyup.enter="addText">
            <button @click="addText" class="search-btn">搜索</button>
        </div>

        <div v-if="listData.length > 0">
            <template v-for="obj in listData">
                <a-typography :style="{ margin: '5px 0px 0px 0px', backgroundColor: 'white' }">
                    <a-typography-text :style="{ fontSize: '1.2em' }">
                        <a class="question-title" :href="`${questionUrl}${obj?.question.id}`" target="_blank"
                            v-html="obj?.question.name"> </a>
                    </a-typography-text>

                </a-typography>
                <div style="margin: 0 0px; background-color: white;">

                    <a-list item-layout="vertical" size="large" :data-source="obj.answers">

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
                                        <a-tag color="#2db7f5" v-if="item?.isFiltered">筛选结果</a-tag>
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
                                    <template #avatar><a-avatar
                                            :src="item.author.avatar_url.split('?')[0]" /></template>


                                </a-list-item-meta>
                                <span v-html="item.excerpt"></span>
                                <a :href="`${questionUrl}${obj?.question.id}/answer/${item.id}`" target="_blank">跳转</a>
                            </a-list-item>
                        </template>
                    </a-list>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeUtils'
import { ref, onMounted, reactive } from 'vue';
import moment from 'moment';
import { useRoute } from 'vue-router';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';


let keywords = ref('');
const questionUrl = 'https://www.zhihu.com/question/';
const questionData = ref(null);
let listData = reactive([]);

const saveTime = ref('');
const inputText = ref('');
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
        text += 'Please return the evaluation in the following JSON format: {"isPositive": true/false, "score": [score], "reason": "[detailed reason in Chinese]"}.'
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

const addText = () => {
    console.log(inputText.value)
    let text = inputText.value
    searchData(text)
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

//工具函数
const formatNumber = (num) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num;
};

// API 请求函数
const searchData = async (words) => {
    try {
        let time = saveTime.value
        saveTime.value = time + ' 开始获取答案数据...';
        let startTime = performance.now();  // 开始时间
        const baseUrl = `${import.meta.env.VITE_API_URL}/zhihu/`
        words = encodeURIComponent(words)
        // const baseUrl = 'https://worker.qchunbhuil.workers.dev/zhihu/' //localhost:8787
        // const baseUrl = 'http://localhost:8787/zhihu/' //localhost:8787
        const url = `${baseUrl}search?keywords=${words}`;
        console.log(url)

        const response = await fetch(url);
        const data = await response.json();
        const currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
        data.forEach(item => {
            item.answers.forEach(answer => {
                answer.isFiltered = false

                let timeDiff = (currentTime - answer.created_time) * 1000; // 转换为毫秒
                answer.time_ago_create = formatTimeAgo(timeDiff);

                timeDiff = (currentTime - answer.updated_time) * 1000; // 转换为毫秒
                answer.time_ago_update = formatTimeAgo(timeDiff);

                answer.actions = createActionItems(answer);
            })
            item.question.name = item.question?.name?.replace(/<em>/g, '<strong>').replace(/<\/em>/g, '</strong>');
        })
        listData.length = 0
        listData.push(...data)
        console.log('data:', data)


        // // 处理数据
        // const processedData = data.map(processAnswerData);
        // processedData.forEach(element => {
        //     element.isFiltered = true
        // });

        // if (processedData.length > 0) {
        //     // 创建新数据的 ID 集合
        //     const newDataIds = new Set(processedData.map(item => item.id));
        //     console.log('筛选前:', listData.length, listData);

        //     // 删除已存在的数据
        //     let temp = listData.filter(item => !newDataIds.has(item.id));

        //     // 合并数组：新数据在前，旧数据在后
        //     listData.length = 0;  // 清空原数组
        //     listData.push(...processedData, ...temp);  // 重新填充数据

        //     console.log('更新后:', listData.length, listData);
        // }
        // let endTime = performance.now();  // 结束时间
        // let diffTime = ((endTime - startTime) / 1000).toFixed(2);
        // saveTime.value = time + `答案用时 ${diffTime}s, 答案 ${processedData.length}条`;
        // console.log('fetchAnswersData time:', endTime - startTime);
    } catch (error) {
        console.error('Error fetching answers:', error);
    }
};
//常量配置 
const createActionItems = (item) => [
    { icon: StarOutlined, text: item.favorites_count },
    { icon: LikeOutlined, text: item.voteup_count },
    { icon: MessageOutlined, text: item.comment_count },
];

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

//事件处理函数
const handleFilterChange = (e) => {
    sortData(e.target.value);
};

// 生命周期钩子
onMounted(() => {
    let URL = new URLSearchParams(window.location.search)
    keywords.value = URL.get('keywords') || '';
    if (keywords.value) {
        console.log('keywords:', keywords.value)
        let words = encodeURIComponent(keywords.value)
        searchData(words).then(() => {
            //generateStory()
        })
    } else {
        console.log('keywords is empty')
    }

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

.question-title {
    text-decoration: none;
    /* 移除下划线 */
    color: inherit;
    /* 继承父元素的颜色，而不是使用默认的蓝色 */
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
</style>
