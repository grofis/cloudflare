<template>
    <div>
        <div class="input-section">
            <a-textarea v-model:value="inputText" placeholder="textarea with clear icon" @keyup.enter="addText"
                allow-clear />
            <button @click="addText" size="small" type="text" class="search-btn">翻译</button>
        </div>
    </div>
    <a-list item-layout="horizontal" :data-source="data">
        <template #renderItem="{ item }">
            <a-list-item>
                <a-list-item-meta>
                    <template #title>
                        <a style="font-size: 18px;" :href="item.href" target="_blank">{{ item.title }}</a>
                    </template>
                    
                    <template #description>
                        <div>
                            <a-tag v-for="tag in item.tags" :key="tag">{{ tag }}</a-tag>
                            <a-typography-text type="secondary">{{ item.time }}</a-typography-text>
                            <ExpandText :text="item.source" />
                            <ExpandText :text="item.translated" />
                        </div>
                    </template>
                </a-list-item-meta>
                
            </a-list-item>
        </template>
    </a-list>
</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeUtils'
import { ref, onMounted, reactive } from 'vue';
import moment from 'moment';
import { useRouter } from 'vue-router';
import { GoogleOutlined } from '@ant-design/icons-vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ExpandText from './child/ExpandText.vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4603537_0l6ll6wkpcx.js',
});

const data = reactive([]);

const inputText = ref('');
const judgment = ref('');

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
            prompt = 'Translate the following content to Chinese.In the translation results, keep the line breaks as in English<br>:' + text
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

async function saveData(item) {
    const url = `${import.meta.env.VITE_API_URL}/translate/set`
    let para = {
        key: new Date().getTime(),
        value: item
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
}

async function getData() {
    const url = `${import.meta.env.VITE_API_URL}/translate/get`
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
    res.forEach(item => {
        item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
        if (item.translator == 'Google') {
            item.iconFont = 'icon-google'
        } else {
            item.iconFont = 'icon-deepseek'
        }
        data.push(item)
    })
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
    // console.log('addText:', text)

    // // 识别文章的标题、来源、链接、标签
    const regex = /title:\s*"([^"]+)",\s*from:\s*'([^']+)',\s*href:\s*'([^']+)',\s*tags:\s*\[([^\]]+)\],/;
    const match = text.match(regex);
    let item = {}
    if (match) {
        // Extracted information
        item.title = match[1];
        item.from = match[2];
        item.href = match[3];
        item.tags = match[4].split(',').map(tag => tag.trim().replace(/['"]/g, ''));

        console.log('Title:', item.title);
        console.log('From:', item.from);
        console.log('Href:', item.href);
        console.log('Tags:', item.tags);

        // Remove the first four lines from the text
        text = text.replace(regex, '').trim();
        text = text.replace(/\n/g, '<br>');
    } else {
        let json = JSON.parse(text)
        item.title = json.title
        item.from = json.from
        item.href = json.href
        item.tags = json.tags
        console.log('json:', json)
        text = json.source
    }

    
    if (text.length > 0) {
        generateStory(text).then(temp => {
            console.log('temp:', temp)
            item.source = text
            item.translated = temp
            item.translator = "Google"
            item.iconFont = 'icon-google'
            item.time = new Date().toISOString()
            data.push(item)
            inputText.value = ''
            saveData(item)
        })
    }
    console.log('text:', text)
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