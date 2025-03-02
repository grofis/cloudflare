<template>
    <div style="background-color: white;">
        <div class="input-section">
            <input v-model="inputText" placeholder="请输入关键词..." @keyup.enter="addText">
            <button @click="addText" class="search-btn">翻译</button>
        </div>
    </div>
    <a-list item-layout="horizontal" :data-source="data">
        <template #renderItem="{ item }">
            <a-list-item>
                <a-list-item-meta >
                    <template #title>
                        <a href="">{{ item.title }}</a>
                    </template>
                    <template #avatar>
                        <a-avatar src="https://joeschmoe.io/api/v1/random" />
                    </template>
                </a-list-item-meta>
                <template #description>
                    {{ item.translated }}
                </template>
            </a-list-item>
        </template>
    </a-list>
</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeUtils'
import { ref, onMounted, reactive } from 'vue';
import moment from 'moment';
import { useRouter } from 'vue-router';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
            prompt = 'Translate the following content to Chinese:' + text
        }

        // Generate content
        const result = await model.generateContent(prompt);
        let temp = result.response.text();
        judgment.value = parseGeminiResponse(temp)
        console.log('story:', judgment.value)
        data.push({ title: text, translated: judgment.value })
    } catch (error) {
        console.error('Error generating story:', error);
    }
}

const parseGeminiResponse = (responseText) => {
    try {
        console.log('parseGeminiResponse:', responseText)
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

function addText() {
    let text = inputText.value

    generateStory(text)
}

onMounted(() => {
    // generateStory()

});
</script>

<style scoped>
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