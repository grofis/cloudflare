<template>
    <div style="background-color: white;">
        <div class="input-section">
            <input v-model="inputText" placeholder="请输入关键词..." @keyup.enter="addText">
            <button @click="addText" class="search-btn">搜索</button>
        </div>
        <div>
            <a-checkable-tag v-for="topic in topics" :key="topic.id" :checked="selectedTopicId === topic.id"
                @change="checked => handleTopicClick(topic.id, checked)">
                {{ topic.name }}
            </a-checkable-tag>
        </div>
        <div class="filters-container">
            <a-checkbox v-model:checked="isNew" :disabled="loading" @change="handleNewChange">刷新</a-checkbox>
            <a-checkbox v-model:checked="isMergedQuestion" @change="handleMergeChange">合并</a-checkbox>
            <a-checkbox v-model:checked="isSingleAnswer" @change="handleSingleAnswerChange">单条</a-checkbox>

            <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                    <a-typography-text type="secondary">
                        {{ selectedLength ? `${selectedLength.label}` : '字数' }}
                    </a-typography-text>
                </a>
                <template #overlay>
                    <a-menu @click="({ key }) => handleLengthSelect(contentLengthFilters.find(f => f.key === key))">
                        <a-menu-item v-for="filter in contentLengthFilters" :key="filter.key">
                            <a href="javascript:;">{{ filter.label }}</a>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                    <a-typography-text type="secondary">
                        {{ selectedTime ? `${selectedTime.label}` : '时间' }}
                    </a-typography-text>
                </a>
                <template #overlay>
                    <a-menu @click="({ key }) => handleTimeSelect(timeFilters.find(f => f.key === key))">
                        <a-menu-item v-for="filter in timeFilters" :key="filter.key">
                            <a href="javascript:;">{{ filter.label }}</a>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                    <a-typography-text type="secondary">
                        {{ selectedUpvoteNum ? `${selectedUpvoteNum.label}` : '点赞数' }}
                    </a-typography-text>
                </a>
                <template #overlay>
                    <a-menu @click="({ key }) => handleUpvoteNumSelect(upvoteNumFilters.find(f => f.key === key))">
                        <a-menu-item v-for="filter in upvoteNumFilters" :key="filter.key">
                            <a href="javascript:;">{{ filter.label }}</a>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                    <a-typography-text type="secondary">
                        {{ selectedCommentNum ? `${selectedCommentNum.label}` : '评论数' }}
                    </a-typography-text>
                </a>
                <template #overlay>
                    <a-menu @click="({ key }) => handleCommentNumSelect(commentNumFilters.find(f => f.key === key))">
                        <a-menu-item v-for="filter in commentNumFilters" :key="filter.key">
                            <a href="javascript:;">{{ filter.label }}</a>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
        <a-typography-text type="secondary">
            {{ dataInfo }}
        </a-typography-text>
        <a-list class="large-text-list" v-if="!isMergedQuestion" item-layout="vertical" size="large"
            :data-source="listData">

            <template #renderItem="{ item }">
                <a-list-item key="item.id">

                    <!-- <template #actions>
                        <span v-for="{ icon, text } in item.actions" :key="icon">
                            <component :is="icon" style="margin-right: 8px" />
                            {{ text }}
                        </span>
                    </template> -->
                    <a-list-item-meta>
                        <template #title>
                            <a target="_blank" :href="getAnswersUrl(item.question_id)">{{ item.title }}</a>
                        </template>
                        <template #description>
                            <div>
                                <a-avatar :src="item.author.avatar_url" />
                                {{ item?.author.name }}
                                ·{{ item?.author.follower_count }}
                                <a-typography-text type="secondary">粉</a-typography-text>
                                <!-- <a-typography-text type="secondary">小时</a-typography-text> -->
                                ·{{ item?.timeLong }}
                                <a-typography-text type="secondary">小时</a-typography-text>
                                ·{{ item?.nums }}
                                <a-typography-text type="secondary">互动</a-typography-text>
                                ·{{ item?.content_length }}
                                <a-typography-text type="secondary">字</a-typography-text>
                                ·{{ item?.comment_count }}
                                <a-typography-text type="secondary">评论</a-typography-text>
                                <template v-if="item?.time_ago_create !== item?.time_ago_update">
                                    ·{{ item?.time_ago_update }}
                                    <a-typography-text type="secondary">更新</a-typography-text>
                                </template>
                            </div>
                        </template>
                    </a-list-item-meta>
                    <span class="excerpt" v-html="item.excerpt"></span>
                    <a :href="`${questionUrl}${item.question_id}/answer/${item.id}`" target="_blank">跳转</a>
                </a-list-item>
            </template>
        </a-list>
        <a-list v-else class="large-text-list" item-layout="vertical" size="large" :data-source="mergedData">
            <template #renderItem="{ item }">
                <a-list-item key="item.id"
                    style="background-color: aliceblue;margin-bottom: 24px;border-radius: 0px 0px 10px 10px;">
                    <a-list-item-meta>
                        <template #title>
                            <a target="_blank" :href="getAnswersUrl(item.question_id)">{{ item.title }}</a>
                        </template>
                        <template #description>
                            <div class="answer-item" v-for="(answer, index) in item.answers" :key="answer.id">
                                <div>
                                    <a-avatar :src="answer.author.avatar_url.split('?')[0]" />
                                    {{ answer?.author.name }}
                                    ·{{ answer?.author.follower_count }}
                                    <a-typography-text type="secondary">粉</a-typography-text>
                                    <!-- <a-typography-text type="secondary">小时</a-typography-text> -->
                                    ·{{ answer?.timeLong }}
                                    <a-typography-text type="secondary">小时</a-typography-text>
                                    ·{{ answer?.nums }}
                                    <a-typography-text type="secondary">互动</a-typography-text>
                                    ·{{ answer?.content_length }}
                                    <a-typography-text type="secondary">字</a-typography-text>
                                    <template v-if="answer?.time_ago_create !== answer?.time_ago_update">
                                        ·{{ answer?.time_ago_update }}
                                        <a-typography-text type="secondary">更新</a-typography-text>
                                    </template>
                                    <a-tag color="cyan" style="margin-left: 5px;">
                                        {{ answer.index + 1 }}
                                    </a-tag>
                                </div>
                                <div>
                                    <span class="excerpt" v-html="answer.excerpt"></span>
                                    <a :href="`${questionUrl}${answer.question_id}/answer/${answer.id}`"
                                        target="_blank">跳转</a>
                                </div>
                                <a-divider v-if="index !== item.answers.length - 1" class="answer-divider" />
                            </div>
                        </template>
                    </a-list-item-meta>

                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeUtils'
import { ref, onMounted, reactive } from 'vue';
import moment from 'moment';
import { useRouter } from 'vue-router';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { GoogleGenerativeAI } from '@google/generative-ai';


let keywords = ref('');
const questionUrl = 'https://www.zhihu.com/question/';
const questionData = ref(null);
let listData = reactive([]);

const saveTime = ref('');
const inputText = ref('');

//是否把问题结果合并
const isMergedQuestion = ref(true);
let mergedData = reactive([]);
let dataInfo = ref('');

//跳转本地详情页面
const router = useRouter();
const getAnswersUrl = (questionId) => {
    const route = router.resolve({
        name: 'Answers',
        params: { id: questionId }
    });
    return route.href;
};


const contentLengthFilters = [
    { key: '0', label: '不限', value: 0 },
    { key: '500', label: '大于500', value: 500 },
    { key: '1000', label: '大于1000', value: 1000 },
    { key: '2000', label: '大于2000', value: 2000 }
];

const timeFilters = [
    { key: '0', label: '不限', value: 0 },
    { key: '12', label: '小于12小时', value: 12 },
    { key: '24', label: '小于24小时', value: 24 },
    { key: '48', label: '小于48小时', value: 48 },
    { key: '72', label: '小于72小时', value: 72 },
    { key: '96', label: '小于96小时', value: 96 },
    { key: '120', label: '小于120小时', value: 120 }
];

const upvoteNumFilters = [
    { key: '0', label: '不限', value: 0 },
    { key: '1000', label: '大于1000', value: 1000 },
    { key: '2000', label: '大于2000', value: 2000 },
    { key: '5000', label: '大于5000', value: 5000 },
    { key: '10000', label: '大于10000', value: 10000 },
    { key: '20000', label: '大于20000', value: 20000 }
];

const commentNumFilters = [
    { key: '0', label: '最少', value: 0 },
    { key: '10', label: '小于10', value: 10 },
    { key: '50', label: '小于50', value: 50 },
    { key: '100', label: '小于100', value: 100 },
    { key: '500', label: '大于500', value: 500 },
    { key: '800', label: '大于800', value: 800 },
    { key: '1000', label: '大于1000', value: 1000 },
    { key: '-2', label: '高赞少评', value: -2 },
    { key: '-1', label: '最多', value: -1 },

];
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

const selectedTopicId = ref('1000013');
const handleTopicClick = (topicId, checked) => {
    selectedTopicId.value = checked ? topicId : null;
    // 调用原有的点击处理函数
    searchData()
};

const selectedLength = ref(null);
const handleLengthSelect = (filter) => {
    // 如果选择了新的非零值，或者从非零值切换到其他值，则刷新数据
    if ((filter?.value !== 0 && filter?.value !== selectedLength.value?.value) ||
        (selectedLength.value?.value !== 0 && filter?.value !== selectedLength.value?.value)) {
        selectedLength.value = filter;
        searchData();
    } else {
        selectedLength.value = filter;
    }
};

const selectedTime = ref(null);
const handleTimeSelect = (filter) => {
    // 如果选择了新的非零值，或者从非零值切换到其他值，则刷新数据
    if ((filter?.value !== 0 && filter?.value !== selectedTime.value?.value) ||
        (selectedTime.value?.value !== 0 && filter?.value !== selectedTime.value?.value)) {
        selectedTime.value = filter;
        searchData();
    } else {
        selectedTime.value = filter;
    }
};

const selectedUpvoteNum = ref(null);
const handleUpvoteNumSelect = (filter) => {
    // 如果选择了新的非零值，或者从非零值切换到其他值，则刷新数据
    if ((filter?.value !== 0 && filter?.value !== selectedUpvoteNum.value?.value) ||
        (selectedUpvoteNum.value?.value !== 0 && filter?.value !== selectedUpvoteNum.value?.value)) {
        selectedUpvoteNum.value = filter;
        searchData();
    } else {
        selectedUpvoteNum.value = filter;
    }
};

//根据评论数筛选
const selectedCommentNum = ref(null);
const handleCommentNumSelect = (filter) => {
    console.log('handleCommentNumSelect:', filter)
    console.log('selectedCommentNum.value:', filter?.value !== 0, filter?.value !== selectedCommentNum.value?.value,
        selectedCommentNum.value?.value !== 0, filter?.value !== selectedCommentNum.value?.value)
    // 如果选择了新的非零值，或者从非零值切换到其他值，则刷新数据
    // if ((filter?.value !== 0 && filter?.value !== selectedCommentNum.value?.value)) {
    //     selectedCommentNum.value = filter;
    //     // searchData();
    //     console.log('if:', filter)
    // } else {
        selectedCommentNum.value = filter;
        //用非合并模式显示
        isMergedQuestion.value = false;

        // console.log('else:', filter)
        // // 对 mergedData 中每个问题的 answers 按 comment_count 排序
        // mergedData.forEach(q => {
        //     q.answers.sort((a, b) => a.comment_count - b.comment_count)
        // })

        loading.value = true;
        searchData().then(() => {
            console.log('result:', listData)  
            if (filter?.value < 0 || filter?.value > 100) {
                listData.sort((a, b) => b.comment_count - a.comment_count)
            } else if (filter?.value > 0 && filter?.value < 100) {
                listData.sort((a, b) => a.comment_count - b.comment_count)
            }
            loading.value = false;
        })


    // }
};

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

const isNew = ref(false);
const loading = ref(false);
const handleNewChange = (checked) => {
    console.log('合并选项变更:', checked, isMergedQuestion.value);
    // 这里添加你的处理逻辑
    loading.value = true;
    searchData().then(() => {
        loading.value = false;
    })
}

const handleMergeChange = (checked) => {
}

const isSingleAnswer = ref(false);
const handleSingleAnswerChange = (checked) => {
    searchData().then(() => {
        //generateStory()
    })
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
const searchData = async () => {
    try {
        let time = saveTime.value
        saveTime.value = time + ' 开始获取答案数据...';
        let startTime = performance.now();  // 开始时间

        // 构建完整的URL
        const baseUrl = `${import.meta.env.VITE_API_URL}/zhihu/hot`;

        // 构建请求体
        const requestBody = {
            filters: {
                minLength: selectedLength.value?.value || 0,
                maxHours: selectedTime.value?.value || 0,
                minUpvoteNum: selectedUpvoteNum.value?.value || 0,
                maxCommentNum: selectedCommentNum.value?.value || 0,
                isSingle: isSingleAnswer.value
            },
            isNew: isNew.value,
            topicId: selectedTopicId.value
        };

        console.log('Request payload:', requestBody);

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        let data = await response.json();
        dataInfo.value = `${data.question_num}个问题，${data.size}条回答，耗时${((performance.now() - startTime) / 1000).toFixed(2)}秒，更新于：${data.set_time}`
        data = data.data
        // let data = [
        //     {
        //         "id": 212804,
        //         "question_id": 10069616272,
        //         "answer_id": 91664888458,
        //         "created_at": "2025-02-02T21:14:34.000Z",
        //         "updated_at": "2025-02-04T16:41:48.000Z",
        //         "reaction": {
        //             "id": 91664888458,
        //             "author": {
        //                 "avatar_url": "https://picx.zhimg.com/v2-4c04f58fc47372cb7d718a2913cd46ff_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://picx.zhimg.com/v2-4c04f58fc47372cb7d718a2913cd46ff.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "https://pic1.zhimg.com/v2-3c8d21e5e0b4d825580e20a91bfcf39a_l.png?source=1def8aca",
        //                     "description": "感谢你在「知奥百问，全景追踪」活动中的创作",
        //                     "medal_avatar_frame": "",
        //                     "medal_id": "1797652730489237504",
        //                     "medal_name": "知奥百问 全景追踪 2024",
        //                     "mini_avatar_url": "https://picx.zhimg.com/v2-3c8d21e5e0b4d825580e20a91bfcf39a_r.png?source=1def8aca"
        //                 },
        //                 "follower_count": 10728,
        //                 "gender": 1,
        //                 "headline": "",
        //                 "id": "4f86522449430de8ffc6a102e0418583",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": false,
        //                 "name": "哈利波特大",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/4f86522449430de8ffc6a102e0418583",
        //                 "url_token": "nan-yu-96-58",
        //                 "user_type": "people"
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 1505,
        //             "created_time": 1738530874,
        //             "excerpt": "有个河北的老哥，家住农村，发了一个自己家的视频，想跟外国人交流一下 其实这个河北大哥的家也还凑合，不破，就一个院子进去之后一排平房。 这画面肯定是不能跟美国农村那种维多利亚风格的别墅比，但是作为房子来说，老哥的家功能性也是足够的。 结果评论区很多人觉得大哥的视频太给中国人丢面子，纷纷举报他的视频，并且说他泄密了 一帮人开始在评论区整齐划一的刷这种评论，号召更多的人举报老哥： 还有一些人就更直白了，直…",
        //             "question_id": 10069616272,
        //             "thanks_count": 520,
        //             "thumbnail_info": {
        //                 "count": 3,
        //                 "thumbnails": [
        //                     {
        //                         "height": 2038,
        //                         "token": "v2-9d7d798dac1576c65859037bba3dc698",
        //                         "type": "image",
        //                         "url": "https://picx.zhimg.com/80/v2-9d7d798dac1576c65859037bba3dc698_720w.jpg?source=1def8aca",
        //                         "width": 1284
        //                     },
        //                     {
        //                         "height": 1698,
        //                         "token": "v2-bfc1b592a738e63dd3e436d77adc605b",
        //                         "type": "image",
        //                         "url": "https://pic1.zhimg.com/80/v2-bfc1b592a738e63dd3e436d77adc605b_720w.jpg?source=1def8aca",
        //                         "width": 1110
        //                     },
        //                     {
        //                         "height": 221,
        //                         "token": "v2-bc3d978a766b81ee0216bb0056b6e1a3",
        //                         "type": "image",
        //                         "url": "https://picx.zhimg.com/80/v2-bc3d978a766b81ee0216bb0056b6e1a3_720w.jpg?source=1def8aca",
        //                         "width": 1284
        //                     }
        //                 ],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1738687308,
        //             "voteup_count": 10625,
        //             "content_length": 1504
        //         },
        //         "nums": 12650,
        //         "content_length": 1504,
        //         "timeLong": "66.1",
        //         "weight": "191.38",
        //         "title": "最近小红书上面的“中美对账”最让你震惊的是什么？",
        //         "excerpt": "有个河北的老哥，家住农村，发了一个自己家的视频，想跟外国人交流一下 其实这个河北大哥的家也还凑合，不破，就一个院子进去之后一排平房。 这画面肯定是不能跟美国农村那种维多利亚风格的别墅比，但是作为房子来说，老哥的家功能性也是足够的。 结果评论区很多人觉得大哥的视频太给中国人丢面子，纷纷举报他的视频，并且说他泄密了 一帮人开始在评论区整齐划一的刷这种评论，号召更多的人举报老哥： 还有一些人就更直白了，直…",
        //         "time_ago_create": "2天前",
        //         "time_ago_update": "22小时前"
        //     },
        //     {
        //         "id": 238562,
        //         "question_id": 8540935742,
        //         "answer_id": 92788648830,
        //         "created_at": "2025-02-04T13:04:49.000Z",
        //         "updated_at": "2025-02-04T14:19:09.000Z",
        //         "reaction": {
        //             "id": 92788648830,
        //             "author": {
        //                 "avatar_url": "https://picx.zhimg.com/v2-00b599951b034fdc57079c239a090e03_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://picx.zhimg.com/v2-00b599951b034fdc57079c239a090e03.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "https://pica.zhimg.com/v2-e66f695db706a1c8c79b8097c1565da2_l.png?source=1def8aca",
        //                     "description": "「知势榜」上榜答主即可获得",
        //                     "medal_avatar_frame": "",
        //                     "medal_id": "1463836052717301760",
        //                     "medal_name": "知「势」之星",
        //                     "mini_avatar_url": "https://pic1.zhimg.com/v2-e66f695db706a1c8c79b8097c1565da2_r.png?source=1def8aca"
        //                 },
        //                 "follower_count": 99703,
        //                 "gender": -1,
        //                 "headline": "见雨",
        //                 "id": "e16bdffa89fadc43a06671589ff59c4a",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": true,
        //                 "kvip_info": {
        //                     "is_vip": true,
        //                     "target_url": "https://www.zhihu.com/kvip/purchase",
        //                     "vip_icon": {
        //                         "night_mode_url": "https://pic1.zhimg.com/v2-57fe7feb4813331d5eca02ef731e12c9.jpg?source=88ceefae",
        //                         "url": "https://picx.zhimg.com/v2-57fe7feb4813331d5eca02ef731e12c9.jpg?source=88ceefae"
        //                     }
        //                 },
        //                 "name": "Anlin",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/e16bdffa89fadc43a06671589ff59c4a",
        //                 "url_token": "an-ling-91",
        //                 "user_type": "people"
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 115,
        //             "created_time": 1738674289,
        //             "excerpt": "你不知道这几天的乐子，openai 新出的那个 o3-mini 会难以自制地使用中文思考，为了反驳抄袭的指控，甚至有人提出了中文优越论，说可能用中文思考就是比用英文思考更好，现在进入了一个要么承认 openai 抄袭，要么承认中文是更好的语言这么一个忠孝难两全的尴尬状态， 而这一切的起因都是 deepseek-r1 开源并完全展示思维链。 可能有朋友不了解 OpenAI 有多宝贝他那个思维链，o1 要20刀一个月就不说了，如果你尝试问它的思维链相…",
        //             "question_id": 8540935742,
        //             "thanks_count": 55,
        //             "thumbnail_info": {
        //                 "count": 2,
        //                 "thumbnails": [
        //                     {
        //                         "height": 407,
        //                         "token": "v2-276d03c7e428f71df1420bbaba7587db",
        //                         "type": "image",
        //                         "url": "https://picx.zhimg.com/80/v2-276d03c7e428f71df1420bbaba7587db_720w.jpg?source=1def8aca",
        //                         "width": 1258
        //                     },
        //                     {
        //                         "height": 250,
        //                         "token": "v2-6c26537cdc391f17e1de822cfc8a2038",
        //                         "type": "image",
        //                         "url": "https://pica.zhimg.com/80/v2-6c26537cdc391f17e1de822cfc8a2038_720w.jpg?source=1def8aca",
        //                         "width": 977
        //                     }
        //                 ],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1738678749,
        //             "voteup_count": 1552,
        //             "content_length": 1025
        //         },
        //         "nums": 1722,
        //         "content_length": 1025,
        //         "timeLong": "26.2",
        //         "weight": "65.73",
        //         "title": "Deepseek 那么厉害为什么要开源，让国外得利？",
        //         "excerpt": "你不知道这几天的乐子，openai 新出的那个 o3-mini 会难以自制地使用中文思考，为了反驳抄袭的指控，甚至有人提出了中文优越论，说可能用中文思考就是比用英文思考更好，现在进入了一个要么承认 openai 抄袭，要么承认中文是更好的语言这么一个忠孝难两全的尴尬状态， 而这一切的起因都是 deepseek-r1 开源并完全展示思维链。 可能有朋友不了解 OpenAI 有多宝贝他那个思维链，o1 要20刀一个月就不说了，如果你尝试问它的思维链相…",
        //         "time_ago_create": "1天前",
        //         "time_ago_update": "1天前"
        //     },
        //     {
        //         "id": 29195,
        //         "question_id": 9580715900,
        //         "answer_id": 80198538023,
        //         "created_at": "2025-01-15T19:59:05.000Z",
        //         "updated_at": "2025-01-18T13:40:47.000Z",
        //         "reaction": {
        //             "id": 80198538023,
        //             "author": {
        //                 "avatar_url": "https://picx.zhimg.com/v2-977b9db5581a821a2d7c65eb190e2233_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://picx.zhimg.com/v2-977b9db5581a821a2d7c65eb190e2233.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "",
        //                     "description": "",
        //                     "medal_id": "0",
        //                     "medal_name": ""
        //                 },
        //                 "follower_count": 1991,
        //                 "gender": 1,
        //                 "headline": "最近比较忙，好友QQ聊，319607356。",
        //                 "id": "0e76cc32c0089a7a148753d339aa9330",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": false,
        //                 "name": "TongKaYiu",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/0e76cc32c0089a7a148753d339aa9330",
        //                 "url_token": "49-46-56-44",
        //                 "user_type": "people"
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 1131,
        //             "created_time": 1736971145,
        //             "excerpt": "2017年，我在推特跟瑞典右翼军事作家聊天。他说:“中国唯一让人不愉快的地方就是不能给我免签，申请签证太麻烦了。” 随后又说了句“如果再这样下去，国际舆论会对中国很不利。” 我收到这条信息确实吓住了，作为一个社会学爱好者，我知道封闭会带来什么恶果。渐渐的，这也成了一个心结。 过完春节之后，我的偶像——获得普利策奖的人类学作家突然在我推文评论，“孩子，看到你向中国学生推荐我的书，我很感谢你。” 见到偶像评…",
        //             "question_id": 9580715900,
        //             "thanks_count": 1138,
        //             "thumbnail_info": {
        //                 "count": 0,
        //                 "thumbnails": [],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1737207647,
        //             "voteup_count": 26484,
        //             "content_length": 422
        //         },
        //         "nums": 28753,
        //         "content_length": 422,
        //         "timeLong": "499.3",
        //         "weight": "57.59",
        //         "title": "为什么小红书突然涌入大量美国人？",
        //         "excerpt": "2017年，我在推特跟瑞典右翼军事作家聊天。他说:“中国唯一让人不愉快的地方就是不能给我免签，申请签证太麻烦了。” 随后又说了句“如果再这样下去，国际舆论会对中国很不利。” 我收到这条信息确实吓住了，作为一个社会学爱好者，我知道封闭会带来什么恶果。渐渐的，这也成了一个心结。 过完春节之后，我的偶像——获得普利策奖的人类学作家突然在我推文评论，“孩子，看到你向中国学生推荐我的书，我很感谢你。” 见到偶像评…",
        //         "time_ago_create": "20天前",
        //         "time_ago_update": "18天前"
        //     },
        //     {
        //         "id": 8297,
        //         "question_id": 10069616272,
        //         "answer_id": 84188063779,
        //         "created_at": "2025-01-21T11:10:37.000Z",
        //         "updated_at": "2025-01-27T05:34:07.000Z",
        //         "reaction": {
        //             "id": 84188063779,
        //             "author": {
        //                 "avatar_url": "https://pic1.zhimg.com/v2-8f51a2c207a11816b76f9dfe5383bfb6_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://picx.zhimg.com/v2-8f51a2c207a11816b76f9dfe5383bfb6.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "https://pica.zhimg.com/v2-548f815c48c8286768f921116785873d_l.png?source=1def8aca",
        //                     "description": "评论 1000 次",
        //                     "medal_avatar_frame": "",
        //                     "medal_id": "972462538273792000",
        //                     "medal_name": "乐于交流",
        //                     "mini_avatar_url": "https://picx.zhimg.com/v2-548f815c48c8286768f921116785873d_r.png?source=1def8aca"
        //                 },
        //                 "follower_count": 767,
        //                 "gender": 1,
        //                 "headline": "游戏行业农民工，攻击性略强",
        //                 "id": "bc60fee909665b25a502eeea71fc37fd",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": false,
        //                 "name": "明日登基查尔斯",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/bc60fee909665b25a502eeea71fc37fd",
        //                 "url_token": "yuan-jing-tang-85",
        //                 "user_type": "people"
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 2106,
        //             "created_time": 1737457837,
        //             "excerpt": "最让我震惊的是。 除了低估了西大老百姓水深火热的程度以外。 东大老百姓没有任何的信息茧房。对世界各国的政治、历史、电影、音乐、美食、文化、宗教、新闻，甚至当地植物品种都了如指掌。 各个国家的人被我们抓住痛脚贴脸调侃了个遍。 英国人说他们的食物不是屎，法国人帮我们反驳。一位捷克人说，你们为了香料征服了半个世界，却什么都不用。 法国人说他们其实不投降，被英国人嘲讽。 意大利人哭着说中国人再掰断pasta他们就…",
        //             "question_id": 10069616272,
        //             "thanks_count": 2313,
        //             "thumbnail_info": {
        //                 "count": 2,
        //                 "thumbnails": [
        //                     {
        //                         "height": 464,
        //                         "token": "v2-b426ded2c16a51241ac8bb784a3ee444",
        //                         "type": "image",
        //                         "url": "https://picx.zhimg.com/80/v2-b426ded2c16a51241ac8bb784a3ee444_720w.jpg?source=1def8aca",
        //                         "width": 1031
        //                     },
        //                     {
        //                         "height": 239,
        //                         "token": "v2-b8e9781e2bbf3b1b571742f12376e10d",
        //                         "type": "image",
        //                         "url": "https://pica.zhimg.com/80/v2-b8e9781e2bbf3b1b571742f12376e10d_720w.jpg?source=1def8aca",
        //                         "width": 419
        //                     }
        //                 ],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1737956047,
        //             "voteup_count": 15056,
        //             "content_length": 1050
        //         },
        //         "nums": 19475,
        //         "content_length": 1050,
        //         "timeLong": "364.1",
        //         "weight": "53.49",
        //         "title": "最近小红书上面的“中美对账”最让你震惊的是什么？",
        //         "excerpt": "最让我震惊的是。 除了低估了西大老百姓水深火热的程度以外。 东大老百姓没有任何的信息茧房。对世界各国的政治、历史、电影、音乐、美食、文化、宗教、新闻，甚至当地植物品种都了如指掌。 各个国家的人被我们抓住痛脚贴脸调侃了个遍。 英国人说他们的食物不是屎，法国人帮我们反驳。一位捷克人说，你们为了香料征服了半个世界，却什么都不用。 法国人说他们其实不投降，被英国人嘲讽。 意大利人哭着说中国人再掰断pasta他们就…",
        //         "time_ago_create": "15天前",
        //         "time_ago_update": "9天前"
        //     },
        //     {
        //         "id": 8291,
        //         "question_id": 10069616272,
        //         "answer_id": 85415301937,
        //         "created_at": "2025-01-23T05:59:48.000Z",
        //         "updated_at": "2025-01-23T07:01:27.000Z",
        //         "reaction": {
        //             "id": 85415301937,
        //             "author": {
        //                 "avatar_url": "https://picx.zhimg.com/ad6ff0cb3dc54094f34931e6aa4e350b_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://pica.zhimg.com/ad6ff0cb3dc54094f34931e6aa4e350b.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "https://picx.zhimg.com/v2-e305158084f6ca64e370eaf3582b6bed_l.png?source=1def8aca",
        //                     "description": "完成 10 次圆环挑战即可获得",
        //                     "medal_avatar_frame": "",
        //                     "medal_id": "1863228133316157440",
        //                     "medal_name": "圆环挑战 2025",
        //                     "mini_avatar_url": "https://picx.zhimg.com/v2-e305158084f6ca64e370eaf3582b6bed_r.png?source=1def8aca"
        //                 },
        //                 "follower_count": 2263,
        //                 "gender": 0,
        //                 "headline": "",
        //                 "id": "e24bd11281587e3149b98b0b2e15d10c",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": false,
        //                 "kvip_info": {
        //                     "is_vip": true,
        //                     "target_url": "https://www.zhihu.com/kvip/purchase",
        //                     "vip_icon": {
        //                         "night_mode_url": "https://picx.zhimg.com/v2-57fe7feb4813331d5eca02ef731e12c9.jpg?source=88ceefae",
        //                         "url": "https://pic1.zhimg.com/v2-57fe7feb4813331d5eca02ef731e12c9.jpg?source=88ceefae"
        //                     }
        //                 },
        //                 "name": "星晴",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/e24bd11281587e3149b98b0b2e15d10c",
        //                 "url_token": "yu-xiao-lan-32",
        //                 "user_type": "people",
        //                 "vip_info": {
        //                     "is_vip": true,
        //                     "vip_icon": {
        //                         "night_mode_url": "https://pica.zhimg.com/v2-c9686ff064ea3579730756ac6c289978.jpg?source=88ceefae",
        //                         "url": "https://picx.zhimg.com/v2-4812630bc27d642f7cafcd6cdeca3d7a.jpg?source=88ceefae"
        //                     }
        //                 }
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 1323,
        //             "created_time": 1737611988,
        //             "excerpt": "衣架堕胎……………… 看到这四个字我整个人虎躯一震 拿衣架狂砸肚子来堕胎吗？ 额……不是……居然是…… 因为有些州禁令堕胎，因为有些人没钱去医院， 所以把衣架伸进身体把胚胎搅烂达到流产的目的。 看《风声》结尾顾晓梦受那样的刑还坚持不招供， 感叹无产阶级战士的立场多么的坚定！ 结果对比衣架堕胎还算是小儿科了…… 那话怎么说的来着……钢铁般的意志",
        //             "question_id": 10069616272,
        //             "thanks_count": 147,
        //             "thumbnail_info": {
        //                 "count": 0,
        //                 "thumbnails": [],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1737615687,
        //             "voteup_count": 13830,
        //             "content_length": 163
        //         },
        //         "nums": 15300,
        //         "content_length": 163,
        //         "timeLong": "321.3",
        //         "weight": "47.62",
        //         "title": "最近小红书上面的“中美对账”最让你震惊的是什么？",
        //         "excerpt": "衣架堕胎……………… 看到这四个字我整个人虎躯一震 拿衣架狂砸肚子来堕胎吗？ 额……不是……居然是…… 因为有些州禁令堕胎，因为有些人没钱去医院， 所以把衣架伸进身体把胚胎搅烂达到流产的目的。 看《风声》结尾顾晓梦受那样的刑还坚持不招供， 感叹无产阶级战士的立场多么的坚定！ 结果对比衣架堕胎还算是小儿科了…… 那话怎么说的来着……钢铁般的意志",
        //         "time_ago_create": "13天前",
        //         "time_ago_update": "13天前"
        //     },
        //     {
        //         "id": 8294,
        //         "question_id": 10069616272,
        //         "answer_id": 84450612162,
        //         "created_at": "2025-01-22T00:31:19.000Z",
        //         "updated_at": "2025-01-23T00:14:50.000Z",
        //         "reaction": {
        //             "id": 84450612162,
        //             "author": {
        //                 "avatar_url": "https://pica.zhimg.com/v2-abed1a8c04700ba7d72b45195223e0ff_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://pic1.zhimg.com/v2-abed1a8c04700ba7d72b45195223e0ff.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "https://pic1.zhimg.com/v2-7565d834d652a9960da0cedd8d7952ee_l.png?source=1def8aca",
        //                     "description": "被 100 个人关注",
        //                     "medal_avatar_frame": "",
        //                     "medal_id": "972477022068568064",
        //                     "medal_name": "备受瞩目",
        //                     "mini_avatar_url": "https://picx.zhimg.com/v2-7565d834d652a9960da0cedd8d7952ee_r.png?source=1def8aca"
        //                 },
        //                 "follower_count": 255,
        //                 "gender": -1,
        //                 "headline": "减肥不坚定者",
        //                 "id": "be8c6f216bf880ba01bdd6a46b06fccf",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": false,
        //                 "name": "兰山篮溪",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/be8c6f216bf880ba01bdd6a46b06fccf",
        //                 "url_token": "lan-shan-lan-xi",
        //                 "user_type": "people"
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 919,
        //             "created_time": 1737505879,
        //             "excerpt": "剖腹产第三天就去上班。。。 靠卖血买一日三餐。 上大学40多万美元。。。。。 一天打4份工。。。。。 我还嘲笑他们没有钢铁意志。 原来是我没有钢铁意志。。。。 要是我这样过来早就揭竿而起了。。。 ———————————————————————— 评论区一群人让我别信美国人。 我不信美国人信你个二道贩子？",
        //             "question_id": 10069616272,
        //             "thanks_count": 280,
        //             "thumbnail_info": {
        //                 "count": 0,
        //                 "thumbnails": [],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1737591290,
        //             "voteup_count": 14272,
        //             "content_length": 143
        //         },
        //         "nums": 15471,
        //         "content_length": 143,
        //         "timeLong": "350.8",
        //         "weight": "44.10",
        //         "title": "最近小红书上面的“中美对账”最让你震惊的是什么？",
        //         "excerpt": "剖腹产第三天就去上班。。。 靠卖血买一日三餐。 上大学40多万美元。。。。。 一天打4份工。。。。。 我还嘲笑他们没有钢铁意志。 原来是我没有钢铁意志。。。。 要是我这样过来早就揭竿而起了。。。 ———————————————————————— 评论区一群人让我别信美国人。 我不信美国人信你个二道贩子？",
        //         "time_ago_create": "14天前",
        //         "time_ago_update": "13天前"
        //     },
        //     {
        //         "id": 237050,
        //         "question_id": 10069616272,
        //         "answer_id": 92447917514,
        //         "created_at": "2025-02-04T03:21:00.000Z",
        //         "updated_at": "2025-02-04T03:21:00.000Z",
        //         "reaction": {
        //             "id": 92447917514,
        //             "author": {
        //                 "avatar_url": "https://picx.zhimg.com/v2-b5d17871a206839a50b2cac052a16803_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://picx.zhimg.com/v2-b5d17871a206839a50b2cac052a16803.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "https://picx.zhimg.com/v2-e32ed2df1ce5878b1e9d3d53928e3c1f_l.png?source=1def8aca",
        //                     "description": "2021 知乎「向科学要答案」纪念徽章",
        //                     "medal_avatar_frame": "",
        //                     "medal_id": "1458836202908979200",
        //                     "medal_name": "向科学要答案 2021",
        //                     "mini_avatar_url": "https://picx.zhimg.com/v2-e32ed2df1ce5878b1e9d3d53928e3c1f_r.png?source=1def8aca"
        //                 },
        //                 "follower_count": 130245,
        //                 "gender": 1,
        //                 "headline": "唯刀百辟，唯心不易。",
        //                 "id": "7ef43ab4abe532aa5b97f78bd2e71a4f",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": false,
        //                 "name": "李傲文",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/7ef43ab4abe532aa5b97f78bd2e71a4f",
        //                 "url_token": "li-ao-wen",
        //                 "user_type": "people",
        //                 "vip_info": {
        //                     "is_vip": true,
        //                     "vip_icon": {
        //                         "night_mode_url": "https://pic1.zhimg.com/v2-c9686ff064ea3579730756ac6c289978.jpg?source=88ceefae",
        //                         "url": "https://pica.zhimg.com/v2-4812630bc27d642f7cafcd6cdeca3d7a.jpg?source=88ceefae"
        //                     }
        //                 }
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 165,
        //             "created_time": 1738639260,
        //             "excerpt": "郭德纲相声里的段子照进现实——王老爷心善，看不得穷人，所以把方圆十里的穷人都赶走了。 最让我震惊的，某些小红书用户的“地图泄密焦虑症” 这个河北老乡随手拍条村道，评论区确实让我开了眼了—— “删掉！导弹要顺着你家土路飞过来了！” “举报了！你让CIA看到村口旱厕还得了？” 好家伙，不知道的还以为这条坑洼土路上停着东风快递，茅草屋里藏着歼-20设计图呢！ 某些人的“国家安全意识”真是灵活得令人惊叹： 看见北上…",
        //             "question_id": 10069616272,
        //             "thanks_count": 63,
        //             "thumbnail_info": {
        //                 "count": 1,
        //                 "thumbnails": [
        //                     {
        //                         "height": 3106,
        //                         "token": "v2-aeefc50e934598ff3c6e389e7d5181f6",
        //                         "type": "image",
        //                         "url": "https://picx.zhimg.com/80/v2-aeefc50e934598ff3c6e389e7d5181f6_720w.jpg?source=1def8aca",
        //                         "width": 1080
        //                     }
        //                 ],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1738639260,
        //             "voteup_count": 1231,
        //             "content_length": 728
        //         },
        //         "nums": 1459,
        //         "content_length": 728,
        //         "timeLong": "36.0",
        //         "weight": "40.53",
        //         "title": "最近小红书上面的“中美对账”最让你震惊的是什么？",
        //         "excerpt": "郭德纲相声里的段子照进现实——王老爷心善，看不得穷人，所以把方圆十里的穷人都赶走了。 最让我震惊的，某些小红书用户的“地图泄密焦虑症” 这个河北老乡随手拍条村道，评论区确实让我开了眼了—— “删掉！导弹要顺着你家土路飞过来了！” “举报了！你让CIA看到村口旱厕还得了？” 好家伙，不知道的还以为这条坑洼土路上停着东风快递，茅草屋里藏着歼-20设计图呢！ 某些人的“国家安全意识”真是灵活得令人惊叹： 看见北上…",
        //         "time_ago_create": "1天前",
        //         "time_ago_update": "1天前"
        //     },
        //     {
        //         "id": 8300,
        //         "question_id": 10069616272,
        //         "answer_id": 85484428642,
        //         "created_at": "2025-01-23T07:38:19.000Z",
        //         "updated_at": "2025-01-23T07:51:50.000Z",
        //         "reaction": {
        //             "id": 85484428642,
        //             "author": {
        //                 "avatar_url": "https://pica.zhimg.com/v2-a00a6c3fbc35dc33a6cc6b675e6afa66_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://picx.zhimg.com/v2-a00a6c3fbc35dc33a6cc6b675e6afa66.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "",
        //                     "description": "",
        //                     "medal_id": "0",
        //                     "medal_name": ""
        //                 },
        //                 "follower_count": 1028,
        //                 "gender": -1,
        //                 "headline": "在知乎学做核弹",
        //                 "id": "dddeea3d1b9e81da210ce1b02fe235d9",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": true,
        //                 "name": "徒手搓核弹",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/dddeea3d1b9e81da210ce1b02fe235d9",
        //                 "url_token": "kai-bi-luo-64",
        //                 "user_type": "people"
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 507,
        //             "created_time": 1737617899,
        //             "excerpt": "讲一个不相干的事 我河北农村，2011年考上大学后，亲戚提醒，村里有奖励，去大队签个字就能拿，我就带着录取通知书去了，因为是个垃圾三本，村里奖励了1000块，给的现金，听说一本给5000块。 去的时候负责这事的人没在，我就等了一会，听八卦，有个女生考上了985，他爹不让她去，村里干部带人把他爹给揍了，村干部不让打人违反纪律，但这个村干部很鸡贼，把他大爷给带过来了，让他大爷动手，大爷打侄子合情合理。。。 后面不清楚…",
        //             "question_id": 10069616272,
        //             "thanks_count": 349,
        //             "thumbnail_info": {
        //                 "count": 0,
        //                 "thumbnails": [],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1737618710,
        //             "voteup_count": 11390,
        //             "content_length": 267
        //         },
        //         "nums": 12246,
        //         "content_length": 267,
        //         "timeLong": "319.7",
        //         "weight": "38.30",
        //         "title": "最近小红书上面的“中美对账”最让你震惊的是什么？",
        //         "excerpt": "讲一个不相干的事 我河北农村，2011年考上大学后，亲戚提醒，村里有奖励，去大队签个字就能拿，我就带着录取通知书去了，因为是个垃圾三本，村里奖励了1000块，给的现金，听说一本给5000块。 去的时候负责这事的人没在，我就等了一会，听八卦，有个女生考上了985，他爹不让她去，村里干部带人把他爹给揍了，村干部不让打人违反纪律，但这个村干部很鸡贼，把他大爷给带过来了，让他大爷动手，大爷打侄子合情合理。。。 后面不清楚…",
        //         "time_ago_create": "13天前",
        //         "time_ago_update": "13天前"
        //     },
        //     {
        //         "id": 8296,
        //         "question_id": 10069616272,
        //         "answer_id": 84589777175,
        //         "created_at": "2025-01-22T03:26:42.000Z",
        //         "updated_at": "2025-01-22T03:26:42.000Z",
        //         "reaction": {
        //             "id": 84589777175,
        //             "author": {
        //                 "avatar_url": "https://picx.zhimg.com/v2-deb0fe102926f694adb843cab1d374b5_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://picx.zhimg.com/v2-deb0fe102926f694adb843cab1d374b5.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "https://pic1.zhimg.com/v2-6da117205088242db9cd82e48b28640d_l.png?source=1def8aca",
        //                     "description": "被 1000 个人关注",
        //                     "medal_avatar_frame": "",
        //                     "medal_id": "972477022068568064",
        //                     "medal_name": "备受瞩目",
        //                     "mini_avatar_url": "https://picx.zhimg.com/v2-6da117205088242db9cd82e48b28640d_r.png?source=1def8aca"
        //                 },
        //                 "follower_count": 1565,
        //                 "gender": -1,
        //                 "headline": "5mao",
        //                 "id": "270c9a6022de5ec45f6ca0bc69521aac",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": false,
        //                 "name": "繁星与飞鸟",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/270c9a6022de5ec45f6ca0bc69521aac",
        //                 "url_token": "jiang-zhu-ting",
        //                 "user_type": "people"
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 885,
        //             "created_time": 1737516402,
        //             "excerpt": "最震惊的是一个美国女士发在tiktok上的视频。她在视频中说自己得了一种慢性病需要每个月吃某种药物，向保险公司申请（注意，是医生建议她吃这个药，但是医生决定不了，必须保险公司/同时也是医药生产厂商的批准）。等了两个月没批，她就打电话去问，保险公司说她的医保不能覆盖这种药物，她可以选择自费购买药物。 她就问自费买这个药一个月多少钱，对方说3000美元。她很绝望地说自己拿不出那么多钱，对方就说我们针对你这种保险…",
        //             "question_id": 10069616272,
        //             "thanks_count": 362,
        //             "thumbnail_info": {
        //                 "count": 0,
        //                 "thumbnails": [],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1737516402,
        //             "voteup_count": 11826,
        //             "content_length": 403
        //         },
        //         "nums": 13073,
        //         "content_length": 403,
        //         "timeLong": "347.9",
        //         "weight": "37.58",
        //         "title": "最近小红书上面的“中美对账”最让你震惊的是什么？",
        //         "excerpt": "最震惊的是一个美国女士发在tiktok上的视频。她在视频中说自己得了一种慢性病需要每个月吃某种药物，向保险公司申请（注意，是医生建议她吃这个药，但是医生决定不了，必须保险公司/同时也是医药生产厂商的批准）。等了两个月没批，她就打电话去问，保险公司说她的医保不能覆盖这种药物，她可以选择自费购买药物。 她就问自费买这个药一个月多少钱，对方说3000美元。她很绝望地说自己拿不出那么多钱，对方就说我们针对你这种保险…",
        //         "time_ago_create": "14天前",
        //         "time_ago_update": "14天前"
        //     },
        //     {
        //         "id": 8301,
        //         "question_id": 10069616272,
        //         "answer_id": 84808991676,
        //         "created_at": "2025-01-22T08:25:22.000Z",
        //         "updated_at": "2025-01-22T08:25:22.000Z",
        //         "reaction": {
        //             "id": 84808991676,
        //             "author": {
        //                 "avatar_url": "https://picx.zhimg.com/v2-89d000182ce3e2a28a622ee8f727439b_l.jpg?source=1def8aca",
        //                 "avatar_url_template": "https://picx.zhimg.com/v2-89d000182ce3e2a28a622ee8f727439b.jpg?source=1def8aca",
        //                 "badge": [],
        //                 "badge_v2": {
        //                     "detail_badges": [],
        //                     "icon": "",
        //                     "merged_badges": [],
        //                     "night_icon": "",
        //                     "title": ""
        //                 },
        //                 "exposed_medal": {
        //                     "avatar_url": "https://picx.zhimg.com/v2-5f9c6a46c92dfc64eb63554ee0425899_l.png?source=1def8aca",
        //                     "description": "参与「我在乎的 2023」相关活动获得",
        //                     "medal_avatar_frame": "",
        //                     "medal_id": "1720518513226158080",
        //                     "medal_name": "我的知乎 2023",
        //                     "mini_avatar_url": "https://picx.zhimg.com/v2-5f9c6a46c92dfc64eb63554ee0425899_r.png?source=1def8aca"
        //                 },
        //                 "follower_count": 1582,
        //                 "gender": 0,
        //                 "headline": "一条贫穷的咸鱼",
        //                 "id": "957f2f3aa4a170a05c922767e2aa3979",
        //                 "is_advertiser": false,
        //                 "is_followed": false,
        //                 "is_following": false,
        //                 "is_org": false,
        //                 "is_privacy": false,
        //                 "name": "Elvis",
        //                 "type": "people",
        //                 "url": "https://www.zhihu.com/api/v4/people/957f2f3aa4a170a05c922767e2aa3979",
        //                 "url_token": "pei-ling-yu-42",
        //                 "user_type": "people",
        //                 "vip_info": {
        //                     "is_vip": true,
        //                     "vip_icon": {
        //                         "night_mode_url": "https://pica.zhimg.com/v2-c9686ff064ea3579730756ac6c289978.jpg?source=88ceefae",
        //                         "url": "https://pic1.zhimg.com/v2-4812630bc27d642f7cafcd6cdeca3d7a.jpg?source=88ceefae"
        //                     }
        //                 }
        //             },
        //             "can_comment": {
        //                 "reason": "",
        //                 "status": true
        //             },
        //             "comment_count": 1159,
        //             "created_time": 1737534322,
        //             "excerpt": "我对账比较多的是月经 一整个震惊到无语凝噎 我不知道这里有多少人还记得，光就知乎上面 就有很多对女生经期保养的方式嗤之以鼻的 还有坐月子 还有一些奇奇怪怪的食疗偏方 这些在微博，知乎，在一些医学大v的嘴里都是伪科学，都是脑残，都是骗钱的 一说经期疼痛，喝热水，热敷，喝一些中药泡水，都说是安慰剂 一说，坐月子就是糟粕，是虐待，是落后，是迷信 举例就是欧美女性从来不坐月子，生完就光鲜亮丽，也不经痛，大姨妈照样…",
        //             "question_id": 10069616272,
        //             "thanks_count": 237,
        //             "thumbnail_info": {
        //                 "count": 0,
        //                 "thumbnails": [],
        //                 "type": "thumbnail_info"
        //             },
        //             "type": "answer",
        //             "updated_time": 1737534322,
        //             "voteup_count": 11277,
        //             "content_length": 713
        //         },
        //         "nums": 12673,
        //         "content_length": 713,
        //         "timeLong": "342.9",
        //         "weight": "36.96",
        //         "title": "最近小红书上面的“中美对账”最让你震惊的是什么？",
        //         "excerpt": "我对账比较多的是月经 一整个震惊到无语凝噎 我不知道这里有多少人还记得，光就知乎上面 就有很多对女生经期保养的方式嗤之以鼻的 还有坐月子 还有一些奇奇怪怪的食疗偏方 这些在微博，知乎，在一些医学大v的嘴里都是伪科学，都是脑残，都是骗钱的 一说经期疼痛，喝热水，热敷，喝一些中药泡水，都说是安慰剂 一说，坐月子就是糟粕，是虐待，是落后，是迷信 举例就是欧美女性从来不坐月子，生完就光鲜亮丽，也不经痛，大姨妈照样…",
        //         "time_ago_create": "14天前",
        //         "time_ago_update": "14天前"
        //     }
        // ]

        console.log('获取到的直接数据:', data.length, '条')
        const currentTime = Date.now(); // 当前时间戳（秒）

        data.forEach(answer => {
            let timeDiff = (currentTime - new Date(answer.created_at).getTime()); // 转换为毫秒
            answer.time_ago_create = formatTimeAgo(timeDiff);

            timeDiff = (currentTime - new Date(answer.updated_at).getTime()); // 转换为毫秒
            answer.time_ago_update = formatTimeAgo(timeDiff);

            // 处理 excerpt
            answer.excerpt = processExcerpt(answer.excerpt);
            // answer.reaction = JSON.parse(answer.reaction)
            // answer.actions = createActionItems(answer);
        })

        //如果需要合并问题，则把多个答案聚在一起

        mergedData.length = 0
        data.forEach((answer, index) => {
            let question = mergedData.find(item => item.question_id === answer.question_id)
            answer.index = index
            if (question) {
                question.answers.push(answer)
            } else {
                question = { question_id: answer.question_id, title: answer.title, answers: [answer] }
                mergedData.push(question)
            }
        })

        listData.length = 0
        listData.push(...data)
        console.log('data:', data)



    } catch (error) {
        console.error('Error fetching answers:', error);
    }
};

function processExcerpt(excerpt) {
    // 转换链接为 a 标签
    // 匹配 http 或 https 开头的 URL
    excerpt = excerpt.replace(
        /(https?:\/\/[^\s<]+)/g,
        url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${'地址'}</a>`
    );

    // 清理多余的空格
    excerpt = excerpt.replace(/\s+/g, ' ').trim();

    return excerpt;
}

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
    searchData().then(() => {
        //generateStory()
    })

});
</script>

<style scoped>
.filters-container {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    /* 下拉菜单之间的间距 */
    margin-bottom: 8px;
    /* 与下方内容的间距 */
    margin-right: 8px;
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

.answer-item {
    margin-top: 8px;
    margin-left: 16px;
}

:deep(.answer-divider) {
    margin: 10px 0;
}

:deep(.large-text-list .excerpt) {
    /* 设置所有文本为1.5倍大小 */
    font-size: 16px;
    color: rgba(0, 0, 0, 0.88);
}

.excerpt :deep(a) {
    color: #175199;
    text-decoration: none;
}

.excerpt :deep(a:hover) {
    text-decoration: underline;
}
</style>