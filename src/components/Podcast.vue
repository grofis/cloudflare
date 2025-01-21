<template>
    <div class="input-section">
        <input v-model="inputText" placeholder="请输入URL..." @keyup.enter="addText">
        <button @click="addText" class="search-btn">识别</button>
    </div>
    <div class="text-list">
        <div v-for="(text, index) in texts" :key="index" class="text-item">
            {{ text }}
            <button class="delete-btn" @click="deleteText(index)">删除</button>
        </div>
    </div>
</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeUtils'
import { ref, onMounted, reactive } from 'vue';
import moment from 'moment';
import { useRoute } from 'vue-router';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';

// 输入框相关的响应式变量
const inputText = ref('');
const texts = ref([]);

import { GoogleGenerativeAI } from '@google/generative-ai';


const judgment = ref('');

async function generateStory() {
    try {
        console.log('generateStory:', import.meta.env.VITE_GOOGLE_API_KEY)

        // Initialize the GoogleGenerativeAI with your API key
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY); // Replace with your actual API key

        // Define the model and prompt
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let text = "Write a story about a magic backpack.";

        // Generate content
        const result = await model.generateContent(text);
        const response = await result.response;
        let temp = await response.text();
        console.log('temp:', temp)
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




async function handleAudioRecognition(url) {
    try {
        console.log('开始音频识别:', url);

        // 1. 获取音频文件
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error(`音频文件获取失败: ${response.status}`);
        }

        // 2. 获取音频数据
        const audioBlob = await response.blob();
        const totalSize = audioBlob.size;

        // 3. 计算分片大小（保持在18MB以下）
        const CHUNK_SIZE = 10 * 1024 * 1024; // 18MB
        const chunksCount = Math.ceil(totalSize / CHUNK_SIZE);

        console.log(`音频总大小: ${totalSize} bytes, 将分为 ${chunksCount} 个片段`);

        // 4. 初始化 Gemini API
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.1,  // 可选：降低随机性，使输出更稳定
                maxOutputTokens: 2048  // 可选：设置最大输出长度
            }
        });

        // 5. 处理每个分段
        const results = [];
        for (let i = 0; i < chunksCount; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min((i + 1) * CHUNK_SIZE, totalSize);

            // 分割 Blob
            const chunkBlob = audioBlob.slice(start, end, audioBlob.type);
            const base64Data = await blobToBase64(chunkBlob);

            // 处理单个分段
            console.log(`处理第 ${i + 1}/${chunksCount} 个片段 (${chunkBlob.size} bytes)`);
            const audioData = {
                inlineData: {
                    data: base64Data,
                    mimeType: audioBlob.type || 'audio/mpeg'
                }
            };

            const prompt = [
                `请转写这段音频内容 (片段 ${i + 1}/${chunksCount})。`,
                '使用以下格式：',
                '[时间戳] 说话人：内容',
                `注意：这是第 ${i + 1} 段，总共 ${chunksCount} 段`
            ].join('\n');

            const result = await model.generateContent({
                contents: [
                    {
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {  // 注意这里使用 inline_data 而不是 inlineData
                                    mime_type: audioBlob.type || 'audio/mpeg',  // 使用下划线格式
                                    data: base64Data
                                }
                            }
                        ]
                    }
                ]
            });
            const text = await result.response.text();
            results.push(text);

            // 保存中间结果，防止处理中断
            const audioId = btoa(url).replace(/[^a-zA-Z0-9]/g, '');
            localStorage.setItem(`audio_transcript_${audioId}_partial`, JSON.stringify(results));
        }

        // 6. 合并结果
        const finalTranscript = results.join('\n\n');

        // 7. 保存最终结果
        const audioId = btoa(url).replace(/[^a-zA-Z0-9]/g, '');
        localStorage.setItem(`audio_transcript_${audioId}`, finalTranscript);
        // 清理中间结果
        localStorage.removeItem(`audio_transcript_${audioId}_partial`);

        return finalTranscript;

    } catch (error) {
        console.error('音频识别失败:', error);
        throw error;
    }
}

// 辅助函数：Blob 转 Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}



// 修改 addText 函数
const addText = async () => {
    // if (inputText.value.trim()) {
    //     texts.value.push(inputText.value);
    //     try {
    let url = 'https://media.xyzcdn.net/65a203f83b60e1feafcafb6d/lmHE2qC34sKJIoZf8roWNJXWSGd3.mp3'
    const result = await handleAudioRecognition(url);
    // 可以在这里显示结果
    console.log('音频识别结果:', result);
    //     } catch (error) {
    //         console.error('识别失败:', error);
    //     }
    //     inputText.value = '';
    // }
};

const deleteText = (index) => {
    texts.value.splice(index, 1);
};

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

.text-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.text-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.delete-btn {
    background-color: #dc3545;
    color: white;
    padding: 4px 8px;
    font-size: 0.8em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.delete-btn:hover {
    background-color: #c82333;
}
</style>