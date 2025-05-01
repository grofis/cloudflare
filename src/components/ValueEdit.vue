<template>
    <a-typography-title :level="3">
        <a :href="item.value.href" target="_blank">{{ item.value.title }}</a>
    </a-typography-title>
    <a-typography-paragraph type="secondary">
        <a :href="item.value.from" target="_blank">{{ item.value.trans_title }}</a>
        <a-typography-text type="secondary" class="middle-text">
            {{ item?.value?.created_at ? item.value.created_at : '' }}
        </a-typography-text>
    </a-typography-paragraph>

    <div style="display: flex; align-items: center;">
        <a-checkbox v-model:checked="showEnglish">英</a-checkbox>
        <a-checkbox v-model:checked="showChinese">中</a-checkbox>


        <a-typography-paragraph :content="item.value.tags" class="middle-text"
            :editable="{ onChange: onTagsChange, tooltip: false, onEnd: onTagsChangeEnd, autoSize: false, style: { width: '100%', minWidth: '100%' } }" />

    </div>
    <a-typography-paragraph v-if="!isLines">
        <a-textarea v-model:value="item.value.source" placeholder="" allow-clear :autosize="true"
            @pressEnter="onEditEnd" />
        <a-textarea v-model:value="item.value.translated" placeholder="" allow-clear :autosize="true"
            @pressEnter="onEditEnd" />
    </a-typography-paragraph>
    <a-typography-paragraph v-else v-for="(item, index) in text" :key="index">
        <a-typography-text style="font-size: 16px;" v-if="!showEnglish">{{ item }}</a-typography-text>
        <br>
        <a-typography-text style="font-size: 18px;" v-if="!showChinese">{{ trans[index] }}</a-typography-text>
    </a-typography-paragraph>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, reactive, watch } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';


let item = reactive({ key: '', value: { source: '', translated: '' } });

const showEnglish = ref(false);
const showChinese = ref(false);
const isLines = ref(false);
const text = ref([]);
const trans = ref([]);
onMounted(() => {
    const storedItem = localStorage.getItem('item');
    console.log('storedItem:', storedItem)
    if (storedItem) {
        let temp = JSON.parse(storedItem);
        // 更新对象属性而不是替换整个对象
        Object.assign(item, temp);

        if (item.value.source.trim().length < 1) {
            item.value.source = '请输入英语原文'
        }
        if (item.value.translated.trim().length < 1) {
            item.value.translated = '请输入中文翻译'
        }

        if (item.value.source.includes('\n')) {
            isLines.value = true;
        }
    }
    console.log('item:', item.value)
    getData(item.key).then(res => {
        console.log('res:', res)
        //过滤默认的标签
        const filterTags = (tagsString) => {
            if (!tagsString) return '';

            const tagsArray = tagsString.split(',').map(tag => tag.trim());

            const filteredTags = tagsArray.filter(tag => {
                // 排除以 story 开头的标签和 author_smaddock
                return !tag.startsWith('story') && tag !== 'author_smaddock';
            });

            return filteredTags.join(', ');
        };

        res.tags = res.tags ? res.tags : '';
        // 在设置 tags 时应用过滤
        item.value.tags = filterTags(res.tags);


        item.value.source = res.source;
        item.value.translated = res.translated;
        text.value.length = 0
        let temp = res.source.split('<br>').filter(item => item.trim() !== '');
        text.value.push(...temp)
        // console.log('text:', typeof res.source, res.source)
        trans.value.length = 0
        temp = res.translated.split('<br>').filter(item => item.trim() !== '');
        trans.value.push(...temp)
        // console.log('trans:', typeof res.translated, res.translated)
        isLines.value = true
    })
});

async function generateStory(text) {
    try {
        console.log('generateStory:', import.meta.env.VITE_GOOGLE_API_KEY)

        // Initialize the GoogleGenerativeAI with your API key
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY); // Replace with your actual API key

        // Define the model and prompt
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // const prompt = "Write a story about a magic backpack.";

        console.log('addText:', text)
        let prompt = `Translate the following English content into Chinese. The input English is an array, please return the translation result array in a one-to-one correspondence: ${text}`

        // Generate content
        const result = await model.generateContent(prompt);
        let temp = result.response.text();
        console.log('result is:', temp)
        // 使用正则表达式匹配 [] 之间的内容
        const match = temp.match(/\[([\s\S]*)\]/);

        if (match && match[0]) {
            // 解析匹配到的JSON数组
            return JSON.parse(match[0]);
        }
        // 如果没有匹配到，尝试解析整个响应
        return JSON.parse(temp);
    } catch (error) {
        console.error('Error generating story:', error);
        return ''
    }
}

async function getData(key) {
    const url = `${import.meta.env.VITE_API_URL}/hn/get`
    let para = {
        key: key,
        type: 'content'
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
    return res
}


const onEditEnd = () => {
    // console.log('onEditEnd', JSON.stringify(item.value))
    item.value.source = item.value.source.replace(/^\s*[\r\n]/gm, '<br>');
    item.value.translated = item.value.translated.replace(/^\s*[\r\n]/gm, '<br>');

    item.value.source = item.value.source.replace(/\n/g, '<br>');
    item.value.translated = item.value.translated.replace(/\n/g, '<br>');

    let temp = item.value.source.split('<br>').filter(item => item.trim() !== '');
    console.log('temp:', temp)
    //去除空字符串
    generateStory(temp).then(res => {
        console.log('res:', res)
        console.log('res:', temp.length, res.length)
        item.value.translated = res
        console.log('item.value:', item.value.source)
        if (item.value.source.includes('<br>')) {
            isLines.value = true;
            text.value = temp;
            trans.value = res;
            item.value.source = temp.join('<br>')
            item.value.translated = res.join('<br>')
        }
        saveData(item.key, item.value)
    })
}

const onTagsChange = (value) => {
    console.log('onTagsChange:', value)
    item.value.tags = value
    // saveData(item.key, item.value)
}

const onTagsChangeEnd = () => {
    saveData(item.key, item.value)
}

async function saveData(key, value) {
    const url = `${import.meta.env.VITE_API_URL}/hn/set`
    let para = {
        key: key,
        value: value,
        type: 'content'
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
    // messageApi.success(res.message)
}


</script>
<style scoped>
.middle-text {
    margin-left: 5px;
    margin-bottom: 0px;
}
</style>