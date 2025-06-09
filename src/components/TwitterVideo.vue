<template>
    <div>
        <a-checkbox-group v-model:value="type" :options="typeOptions" @change="typeChange" />
        <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
                {{ selectedValue == 0 ? '选择时间' : selectedLabel }}
                <DownOutlined />
            </a>
            <template #overlay>
                <a-menu @click="handleMenuClick">
                    <a-menu-item v-for="item in timeOptions" :key="item.value">
                        <a href="javascript:;">{{ item.label }}</a>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-row :gutter="10">
            <a-col :span="12">
                <a-row>
                    <a-col :span="24" style="margin-bottom: 15px;border-bottom: 1px solid #e8e8e8;"
                        v-for="item in leftData" :key="item.id" @mouseenter="mouseIn(item.id)"
                        @mouseleave="() => { hoverId = '' }">
                        <a-comment :avatar="item.sender.avatar">
                            <template #author>
                                <a :href="`https://x.com/${item.sender.screen_name}`" target="_blank">
                                    <span style="font-weight: bold;">{{ item.sender.name
                                    }}</span>
                                </a>
                                <transition name="expand">
                                    <span style="font-weight: bold;" v-show="hoverId === item.id"
                                        class="expandable-content screen-name"> @{{
                                            item.sender.screen_name
                                        }}</span>
                                </transition>
                            </template>
                            <template #content>
                                <transition name="expand">
                                    <span v-show="hoverId === item.id" class="expandable-content description">
                                        {{ item.sender.description }}
                                    </span>
                                </transition>
                            </template>
                            <template #datetime>
                                <span style="color: #888;">
                                    {{ item.sender.created_at }}注册
                                    {{ item.sender.statuses_count }}推文
                                    {{ item.sender.followers_count }}关注
                                </span>
                            </template>
                        </a-comment>
                        <a :href="item.href" target="_blank"><a-typography-text strong>
                                {{ item.full_text }}
                            </a-typography-text></a>
                        <a-typography-text type="secondary">
                            {{ item.created_at }}
                        </a-typography-text>
                        <VideoPlayer :data="item" :currentPlayingId="currentPlayingId" @play="handlePlay" />
                        <span v-for="{ icon, text } in item.actions" :key="icon" style="margin-right: 8px;">
                            <component :is="icon" />
                            {{ text }}
                        </span>
                    </a-col>
                </a-row>
            </a-col>
            <a-col :span="12">
                <a-row>
                    <a-col :span="24" v-for="item in rightData"
                        style="margin-bottom: 15px;border-bottom: 1px solid #e8e8e8;" :key="item.id"
                        @mouseenter="() => { hoverId = item.id }" @mouseleave="() => { hoverId = '' }">
                        <a-comment :avatar="item.sender.avatar">
                            <template #author>
                                <a :href="`https://x.com/${item.sender.screen_name}`" target="_blank">
                                    <span style="font-weight: bold;">{{ item.sender.name
                                    }}</span>
                                </a>
                                <transition name="expand">
                                    <span style="font-weight: bold;" v-show="hoverId === item.id"
                                        class="expandable-content screen-name"> @{{
                                            item.sender.screen_name
                                        }}</span>
                                </transition>
                            </template>
                            <template #content>
                                <transition name="expand">
                                    <span v-show="hoverId === item.id" class="expandable-content description">
                                        {{ item.sender.description }}
                                    </span>
                                </transition>
                            </template>
                            <template #datetime>
                                <span style="color: #888;">
                                    {{ item.sender.created_at }}注册
                                    {{ item.sender.statuses_count }}推文
                                    {{ item.sender.followers_count }}关注
                                </span>
                            </template>
                        </a-comment>
                        <a :href="item.href" target="_blank"><a-typography-text strong>
                                {{ item.full_text }}
                            </a-typography-text></a>
                        <a-typography-text type="secondary">
                            {{ item.created_at }}
                        </a-typography-text>
                        <VideoPlayer :data="item" :currentPlayingId="currentPlayingId" @play="handlePlay" />
                        <span v-for="{ icon, text } in item.actions" :key="icon" style="margin-right: 8px;">
                            <component :is="icon" />
                            {{ text }}
                        </span>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { BookOutlined, CommentOutlined, HeartOutlined, MessageOutlined, RetweetOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import VideoPlayer from './child/VideoPlayer.vue';
import moment from 'moment';
import { message } from 'ant-design-vue';
const leftData = reactive([]);
const rightData = reactive([]);
const currentPlayingId = ref(null); // 当前正在播放的视频ID

const hoverId = ref('')
const type = ref(['Search'])
const typeOptions = [
    {
        label: '书签',
        value: 'Bookmark',
    },
    {
        label: '时间线',
        value: 'Search',
    },
];
const timeOptions = [
    {
        label: '选择时间',
        value: 0,
    },
    {
        label: '1天内',
        value: 1,
    },
    {
        label: '3天内',
        value: 3,
    },
    {
        label: '5天内',
        value: 5,
    },
    {
        label: '一周内',
        value: 7,
    },
    {
        label: '所有',
        value: 10000,
    },
];
const selectedValue = ref('0')
// 计算属性，自动根据 selectedValue 显示 label
const selectedLabel = computed(() => {
    const found = timeOptions.find(item => item.value === selectedValue.value)
    return found ? found.label : ''
})

//时间间隔选择
const handleMenuClick = (e) => {
    selectedValue.value = e.key
    console.log(selectedValue.value)
    getLaestTweets()
}
function handlePlay(id) {
    currentPlayingId.value = id;
}

function mouseIn(id) {
    hoverId.value = id
    let text = '12345'
    // 使用 navigator.clipboard API 复制文本
    navigator.clipboard.writeText(text)
        .then(() => {
            // 可以添加一个提示消息
            // message.success('文本已复制到剪贴板');
        })
        .catch(err => {
            console.error('复制失败:', err);
            // message.error('复制失败');
        });
}

function typeChange(checkedValues) {
    // checkedValues 就是最新的选中数组
    console.log('当前选中:', checkedValues);
    console.log(type.value)
    // 这里可以做你需要的逻辑
    getLaestTweets()
}

onMounted(() => {
    getLaestTweets()
});

//获取最新的数据
async function getLaestTweets() {
    const url = `${import.meta.env.VITE_API_URL}/x/get`
    // const url = 'https://sunziagent.com/x/get'

    console.log('url is:', url)
    // 使用 try-catch 处理超时错误
    try {
        let para = {
            key: 'list',
            type: 'list',
            isRefresh: true
        }


        //筛选结果
        if (type.value.length == 2 || type.value.length == 0) {
            para.type = 'list'
        } else {
            para.type = type.value[0]
        }
        if (selectedValue.value != 0) {
            para.type = 'Time'
            para.time = selectedValue.value
        }
        let options = {
            method: 'POST', // 指定请求方法为 POST
            headers: {
                'Content-Type': 'application/json', // 设置请求头，指明发送的数据格式
            },
            body: JSON.stringify(para), // 将数据对象转换为 JSON 字符串
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        leftData.length = 0
        rightData.length = 0
        console.log(data)
        if (data.length > 0) {
            if (Array.isArray(data)) {
                data.forEach((item, idx) => {

                    let temp = { ...item }

                    try {
                        temp.sender = item.sender;
                        temp.sender.created_at = createdTime(temp.sender.created_at);
                        temp.actions = [
                            { icon: BookOutlined, text: item.bookmark_count },      // 收藏
                            { icon: CommentOutlined, text: item.quote_count },      // 引用/带评论转推
                            { icon: HeartOutlined, text: item.favorite_count },     // 喜欢/点赞
                            { icon: MessageOutlined, text: item.reply_count },      // 回复
                            { icon: RetweetOutlined, text: item.retweet_count },    // 转推
                        ]

                        temp.created_at = createdTime(item.created_at);
                    } catch (error) {
                        console.log(error)
                        console.log('item is:\n', item)
                    }


                    if (idx % 2 === 0) {
                        leftData.push(temp);
                    } else {
                        rightData.push(temp);
                    }
                });
            }
        }
        console.log('data:', data);
        // 处理数据...
    } catch (error) {
        if (error.name === 'TimeoutError') {
            console.error('请求超时');
            // 处理超时错误...
        } else {
            console.error('请求失败:', error);
            // 处理其他错误...
        }
    }

}

//格式化时间
function createdTime(created_at) {
    const now = Date.now();
    const created = new Date(created_at).getTime();
    const diff = Math.floor((now - created) / 1000); // 差值（秒）

    if (diff >= 86400) { // 1天=86400秒
        const days = Math.floor(diff / 86400);
        return `${days}天前`;
    } else if (diff >= 3600) { // 1小时=3600秒
        const hours = Math.floor(diff / 3600);
        return `${hours}小时前`;
    } else if (diff >= 60) { // 1分钟=60秒
        const minutes = Math.floor(diff / 60);
        return `${minutes}分钟前`;
    } else {
        return `${diff}秒前`;
    }
}

</script>

<style scoped>
.video-container {
    width: 100%;
    position: relative;
    cursor: pointer;
}

video {
    display: block;
    max-width: 100%;
}

:deep(.ant-comment .ant-comment-inner) {
    padding-bottom: 0;
}

.expandable-content {
    display: block;
    overflow: hidden;
    /* padding: 10px 0;
    margin: 5px 0; */
}

.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 500px;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
    padding: 0;
    margin: 0;
    transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
    max-height: 500px;
    opacity: 1;
    transform: translateY(0);
}

/* 可选：为内容添加渐变效果 */
.screen-name,
.description {
    display: block;
    transition: transform 0.3s ease-out;
}
</style>