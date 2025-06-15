<template>
    <div>
        <div class="input-section">
            <a-form :model="form" layout="horizontal" :label-col="{ style: { width: '80px' } }">
                <a-form-item label="标题" name="title" :rules="[{ required: true, message: '请输入标题' }]">
                    <a-input @paste="handlePaste" v-model:value="data.full_text" placeholder="请输入标题" allow-clear />
                </a-form-item>

                <a-form-item label="作者" name="author" :rules="[{ required: false, message: '请输入作者' }]">
                    <a-input v-model:value="data.sender.name" placeholder="请输入作者" allow-clear />
                </a-form-item>
                <a-form-item label="发布日期" name="date" :rules="[{ required: false, message: '请输入发布日期' }]">
                    <a-input v-model:value="data.created_at" placeholder="请输入发布日期" allow-clear />
                </a-form-item>
                <a-form-item label="标签" name="tags" :rules="[{ required: true, message: '请输入标签信息' }]">
                    <a-input v-model:value="data.date" placeholder="请输入标签信息，多个标签以逗号分割" allow-clear />
                </a-form-item>
                <a-form-item label="评论" name="tags" :rules="[{ required: true, message: '请输入评论' }]">
                    <a-input v-model:value="data.date" placeholder="为什么保存这条信息？简短概括记忆点是什么？" allow-clear />
                </a-form-item>
                <a-form-item label="原贴" name="tags" :rules="[{ required: false, message: '点击跳转' }]">
                    <a :href="data.href" target="_blank">
                        <a-typography-text :copyable="getCopyable()" strong>
                            {{ data.href }}
                        </a-typography-text>

                    </a>
                </a-form-item>

                <a-textarea v-model:value="inputText" placeholder="textarea with clear icon" @keyup.enter="addText"
                    allow-clear />
                <button @click="addText" size="small" type="text" class="search-btn">添加</button>
            </a-form>
            <a-col :span="10" style="margin-bottom: 15px;border-bottom: 1px solid #e8e8e8;" :key="data.id">
                <VideoPlayer :data="data" currentPlayingId="" @play="" />
            </a-col>
        </div>
    </div>

</template>

<script setup>
import { formatTimeAgo } from '@/utils/timeUtils'
import { ref, onMounted, reactive } from 'vue';
import moment from 'moment';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { GoogleOutlined } from '@ant-design/icons-vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ExpandText from './child/ExpandText.vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4603537_0l6ll6wkpcx.js',
});

const router = useRouter()
const data = ref({
    sender: {
        name: '',
        screen_name: '',
        description: '',
        created_at: '',
        statuses_count: 0,
        followers_count: 0
    }
});

const form = reactive({
    title: '',
    author: '',
    date: '',
    source: ''
})
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

function handlePaste(e) {
    // 获取纯文本
    const text = e.clipboardData.getData('text/plain')
    // 获取 HTML
    const html = e.clipboardData.getData('text/html')

    // 尝试解析 HTML 中的超链接
    let links = []
    if (html) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const aTags = doc.querySelectorAll('a')
        links = Array.from(aTags).map(a => ({
            text: a.textContent,
            href: a.href
        }))
    }
    form.title = text
    form.source = links[0]?.href
    // 你可以在这里处理 text 和 links
    console.log('纯文本:', text)
    console.log('超链接:', links)

    // 如果你不想插入原始内容，可以阻止默认粘贴行为
    // e.preventDefault()
    // inputValue.value = text // 或自定义插入内容
}

// 复制提示词
const getCopyable = () => {
    let promt = `
    https://x.com/Yoda4ever/status/1933912319744168322

规则说明：
视频主体信息，详细描述视频主体在干什么事情，反映出一种什么样的情绪，便于后期检索视频冗余信息.

反馈信息则说明帖子截止目前，从x.com上获得的反馈数量(包含评论，转发，点赞等)。
反馈信息模板为：发布多长时间后(截止当前时间的间隔，比如天数，小时数和分钟数和秒数，按照取大不取小的形式来，比如超过24小时就是1天，超过120分钟就是2小时…)后，获得了XX回复，XX赞，XX收藏，XX转发。
综合指数公式为：综合指数 = 点赞数 + 回复数*3 + 转发数*1.5。

return back data with JSON format。

针对这条帖子中的视频，返回如下的模板信息:
主体：视频中的主体，比如人物，宠物，猫，狗，蛇等等。
事件：视频(或图片)中的主人公在干什么？
环境：发生的地点，比如是在屋内还是在户外，天气状况怎么样？车流人流多不多等。清晰描述视频中事件发生的环境状况。
情绪：视频中发生的事件主要透露出什么样的情绪，比如快乐，悲伤，震惊，有趣，猎奇，偶然等，可以使用多种情绪的组合。
反馈：发布多长时间后(截止当前时间的间隔，比如天数，小时数和分钟数和秒数，按照取大不取小的形式来，比如超过24小时就是1天，超过120分钟就是2小时…)后，获得了XX回复，XX赞，XX收藏，XX转发。
槽点：为什么这条推文在平台上大量传播，深受推友喜爱？评论区讨论的焦点集中在哪些主题上？

评论列表：
列出其中的5条评论。根据综合指数对原贴的评论进行排序，综合指数越高排序越靠前，列出排名前5的评论。
综合指数的计算公式是：综合指数=点赞数+回复数*3+转发数*1.5，也就是回复数量权重较高。
评论的模板为：
原文：如果有文字的话，把文字翻译成中文。
翻译：原文非中文语言，需提供原文的中文翻译。
类型：文字，图片，视频, 或者三者之间的组合，比如文字+图片，文字+图片+视频等
反馈：发布多长时间后(截止当前时间的间隔，比如天数，小时数和分钟数和秒数，按照取大不取小的形式来，比如超过24小时就是1天，超过120分钟就是2小时…)后，获得了XX赞，XX回复，XX收藏，XX转发(评论的赞靠前)。


返回示例：
{
  "subject": "女性歌手，视频中的主体是一位女性歌手，她是画面中的主要人物，吸引了观众的注意力。",
  "event": "女性歌手正在舞台上表演，她手持麦克风，穿着黑色背心和一条高开衩的牛仔裙，裙子的设计使得她在移动时不经意间露出大腿部分，疑似发生了轻微的‘走光’事件。她身后有乐队成员正在演奏乐器，包括一名吉他手。歌手在表演过程中似乎并未因此受到太大影响，继续专注于演唱。",
  "environment": "事件发生在户外的一个大型音乐会舞台上，背景显示为夜晚，舞台灯光以紫色为主，营造出音乐会的热烈氛围。舞台下方有大量观众，人流密集，观众中有穿着红色制服的工作人员，表明现场有一定的组织和安保措施。由于是夜晚，无法判断天气状况，但观众的穿着和现场气氛表明可能是一个温暖的夏夜。",
  "emotion": "视频中透露出的情绪主要是有趣、猎奇和偶然的组合。有趣情绪来源于歌手裙子的高开衩设计和不经意露出的画面为视频增添了轻松幽默的元素，观众可能会觉得这一幕既意外又好笑。猎奇情绪来源于这种‘走光’事件在公众场合较为少见，尤其是对于一位正在表演的歌手，满足了观众对意外事件的好奇心。偶然情绪来源于这一事件显然不是刻意安排的，属于意外情况，增加了视频的真实感和传播力。",
  "virality_factors": "高情绪唤起：根据相关研究（如《The Emotions that Drive Viral Video》），高唤起情绪（如惊讶、猎奇）是视频传播的主要驱动力。这条视频中的‘走光’事件恰好引发了观众的惊讶和好奇，促使他们分享。娱乐性与意外性：视频捕捉到了一位歌手在舞台上的尴尬瞬间，这种意外事件具有很强的娱乐性，容易吸引观众的注意力。社交媒体传播特性：视频发布在TikTok并被转发到X平台，标题‘I am confused YES or NO?’制造了悬念，激发了用户的讨论欲望，增加了互动性。名人效应：结合相关背景信息，这位歌手可能是Maren Morris（根据网页信息），她是一位有一定知名度的歌手，此前也因类似事件（如2024年7月的表演）受到关注，名人效应进一步助推了视频的传播。",
  "feedback": "视频发布于2025年6月5日11:29 UTC，当前时间为2025年6月7日12:50 +08（即04:50 UTC），计算时间间隔：1天17小时21分钟，时间间隔约为2天。获得了1,200+回复，12,000+赞，3,500+收藏，8,000+转发。",
  "comments": [
    {
      "text": "Haha, this skirt is so dangerous! She's quite calm and professional!",
      "translate": "哈哈，这裙子也太危险了吧！她还挺淡定，专业！",
      "type": "text",
      "feedback": "发布2天后，获得了3,500赞，150回复，1,200转发。综合指数 = 3,500 + 150*3 + 1,200*1.5 = 3,500 + 450 + 1,800 = 5,750"
    },
    {
      "text": "Whoa, what is this? The skirt is way too high! [Face with Tears of Joy emoji]",
      "translate": "我去，这是什么操作？裙子开衩也太高了吧！[笑哭表情]",
      "type": "text",
      "feedback": "发布2天后，获得了3,000赞，120回复，1,000转发。综合指数 = 3,000 + 120*3 + 1,000*1.5 = 3,000 + 360 + 1,500 = 4,860"
    },
    {
      "text": "This video is so funny, I can't help but watch it several times!",
      "translate": "这视频太搞笑了，忍不住多看几遍！",
      "type": "text",
      "feedback": "发布2天后，获得了2,800赞，100回复，900转发。综合指数 = 2,800 + 100*3 + 900*1.5 = 2,800 + 300 + 1,350 = 4,450"
    },
    {
      "text": "Her expression is so calm, haha, it's killing me with laughter! [Video clip of the singer calmly continuing her performance]",
      "translate": "她的表情好淡定，哈哈哈，给我笑死了！[视频：歌手淡定继续表演的片段]",
      "type": "text+video",
      "feedback": "发布2天后，获得了2,500赞，90回复，800转发。综合指数 = 2,500 + 90*3 + 800*1.5 = 2,500 + 270 + 1,200 = 3,970"
    },
    {
      "text": "There's something wrong with this skirt design, the designer should be here to take a beating! [Close-up photo of the skirt slit]",
      "translate": "这裙子设计有问题吧，设计师出来挨打！[图片：裙子开衩的特写]",
      "type": "text+image",
      "feedback": "发布2天后，获得了2,200赞，80回复，700转发。综合指数 = 2,200 + 80*3 + 700*1.5 = 2,200 + 240 + 1,050 = 3,490"
    }
  ]
}
}

    `

    let url = `https://x.com/${data.value.sender.screen_name}/status/${data.value.id}`


    return {
        text: url + "\n" + promt,
        tooltips: ['复制链接', '复制成功'],
        onCopy: () => {
            message.success('链接已复制到剪贴板');
        }
    }
}

onMounted(() => {
    // generateStory()
    const storedData = localStorage.getItem('current_twitter_item')
    if (storedData) {

        data.value = JSON.parse(storedData)
        console.log('data is', data.value)
        // 使用完后可以清除数据
        // localStorage.removeItem('current_twitter_item')
    }
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