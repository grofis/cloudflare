<template>
    <context-holder />
    <div>
        <div class="input-section">
            <a-textarea v-model:value="inputText" :rows="rows" placeholder="textarea with clear icon"
                @keyup.enter="addText" allow-clear />
            <button @click="addText" size="small" type="text" class="search-btn">更新</button>
        </div>
    </div>
    <a-list item-layout="vertical" :data-source="data">
        <template #renderItem="{ item, index }">
            <a-list-item :key="item.key">
                <a-list-item-meta>
                    <template #title>
                        <a style="font-size: 18px;">{{ item.value.title?item.value.title:item.key }}</a>
                    </template>

                    <template #description>
                        <div>
                            <a-typography-text type="secondary">{{ item.value.time }}-{{
                                `${JSON.stringify(item.value).length}字` }}</a-typography-text>
                            <ExpandText :text="JSON.stringify(item.value)" />
                        </div>
                    </template>
                </a-list-item-meta>
                <template #actions>
                    <span v-for="(action, actionIndex) in actions" :key="actionIndex"
                        @click.stop="action.onClick(item, index)" class="action-item">
                        <component :is="action.icon" style="margin-right: 2px" />
                        {{ action.text }}
                    </span>
                </template>
            </a-list-item>
        </template>
    </a-list>
</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeUtils'
import { ref, onMounted, reactive, watch } from 'vue';
import moment from 'moment';
import { useRouter } from 'vue-router';
import { StarOutlined, LikeOutlined, MessageOutlined,EyeOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ExpandText from './child/ExpandText.vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4603537_0l6ll6wkpcx.js',
});

import { message } from 'ant-design-vue';
const [messageApi, contextHolder] = message.useMessage();


const data = reactive([]);

const inputText = ref('');
let rows = ref(2);
//监控文本的长度，根据长度调整行数
watch(inputText, (newValue) => {
    const textLength = newValue.length;
    if (textLength > 1000) {
        rows.value = 15;
    } else if (textLength > 500) {
        rows.value = 10;
    } else if (textLength > 200) {
        rows.value = 5;
    } else {
        rows.value = 2;
    }
});


const editIndex = ref('');
const actions = [
    {
        icon: FormOutlined,
        text: '修改',
        onClick: (item, index) => {
            console.log('修改:', item, index);
            inputText.value = JSON.stringify(item.value);
            editIndex.value = index;
            // 处理修改逻辑
        },
    },
    {
        icon: DeleteOutlined,
        text: '删除',
        onClick: (item, index) => {
            console.log('删除:', item, index);
            // deleteItem(item, index)
        },
    },
    {
        icon: EyeOutlined,
        text: '浏览',
        onClick: (item, index) => {
            console.log('浏览:', item, index);
            // 处理收藏逻辑
            showItem(item)
        },
    },
];

async function generateStory(text) {
    try {
        console.log('generateStory:', import.meta.env.VITE_GOOGLE_API_KEY)

        // Initialize the GoogleGenerativeAI with your API key
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY); // Replace with your actual API key

        // Define the model and prompt
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // const prompt = "Write a story about a magic backpack.";

        console.log('addText:', text)

        // 判断是否包含中文字符
        const containsChinese = /[\u4e00-\u9fa5]/.test(text)
        console.log('addText:', text, 'isChinese:', containsChinese)
        let prompt = ''
        if (containsChinese) {
            prompt = 'Translate the following content to English:' + text
        } else {
            prompt = 'Translate the following content to Chinese.In the translation results, keep the line breaks in English<br>:' + text
        }

        // Generate content
        const result = await model.generateContent(prompt);
        let temp = result.response.text();
        console.log('temp:', temp)
        return temp
    } catch (error) {
        console.error('Error generating story:', error);
        return ''
    }
}

async function saveData(key, value) {
    const url = `${import.meta.env.VITE_API_URL}/translate/set`
    let para = {
        key: key,
        value: value
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
    let res = await response.json();
    messageApi.success(res.message)
    getData()
}

async function getData() {
    const url = `${import.meta.env.VITE_API_URL}/kv/keys`
    let para = {
        key: 'list',
        type: 'list'
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
    let res = await response.json();
    console.log('getData:', res)
    data.length = 0
    data.push(...res)
}

async function updateHnList() {
    const url = `${import.meta.env.VITE_API_URL}`

    let options = {
        method: 'POST', // 指定请求方法为 POST
        headers: {
            'Content-Type': 'application/json', // 设置请求头，指明发送的数据格式
        },
        body: JSON.stringify({}), // 将数据对象转换为 JSON 字符串
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    let res = await response.json();
    console.log('updateHnList:', res)
    generateStory(res).then(temp => {
        console.log('temp:', temp)
    })
}

function addText() {
    let text = inputText.value.trim()
    let temp = JSON.parse(text)
    let src = data[editIndex.value]
    let value = JSON.stringify(src.value)
    if (value === text) {
        messageApi.error('内容相同，请修改后保存')
        return
    }
    temp['updated'] = new Date().toISOString()
    saveData(src.key, temp)
    // inputText.value = JSON.stringify(item.value);
    // editIndex.value = index;
}

function editItem(item) {
    console.log('editItem:', item)
    let text = JSON.stringify(item.value)
    inputText.value = text
}

function deleteItem(item, index) {
    console.log('deleteItem:', item, index);
    data.splice(index, 1);
    const url = `${import.meta.env.VITE_API_URL}/translate/delete`
    let para = {
        type: 'delete',
        key: item.key,
    }
    let options = {
        method: 'POST', // 指定请求方法为 POST
        headers: {
            'Content-Type': 'application/json', // 设置请求头，指明发送的数据格式
        },
        body: JSON.stringify(para), // 将数据对象转换为 JSON 字符串
    }

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 返回解析 JSON 的 Promise
        })
        .then(data => {
            // 现在 data 是解析后的 JSON 数据
            console.log('deleteItem:', data);
            messageApi.success('删除成功!');
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}


function showItem(item) {
    console.log('showItem:', item);
    const url = `${window.location.origin}/value`;
    localStorage.setItem('item', JSON.stringify(item));

    // 使用命名窗口，这样相同名称的窗口会被重用
    window.open(url, 'valueWindow');
}

onMounted(() => {
    // generateStory()
    getData()

});
</script>

<style scoped>
.input-section {

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
    margin-top: 10px;
    padding: 5px 16px;
    background-color: #FF9933;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.search-btn:hover {
    background-color: #3aa876;
}

.action-item {
    cursor: pointer;
}

.action-item:hover {
    color: #1890ff;
}
</style>