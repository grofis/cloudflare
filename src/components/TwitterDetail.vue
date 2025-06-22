<template>
    <div>
        <a-col :span="data.direction == 0 ? 8 : 24" :offset="data.direction == 0 ? 8 : 0"
            style="margin-bottom: 15px; border-bottom: 1px solid #e8e8e8" :key="data.id">
            <VideoPlayer :data="data" currentPlayingId="" />
        </a-col>
        <a-descriptions :title="data.full_text" :column="8">
            <a-descriptions-item v-for="item in descbItems" :key="item.key">
                {{ data.description[item.key] }}
                <a-typography-text type="secondary">
                    {{ item.label }}
                </a-typography-text>
            </a-descriptions-item>
        </a-descriptions>
        <a-typography-text :copyable="getCopyable()" strong>
            <a :href="data.href" target="_blank">{{ data.href }}</a>
        </a-typography-text>
    </div>
    <!-- 主体信息展示 -->
    <div v-if="data.tagInfo">
        <a-descriptions title="视频分析" bordered :column="1" style="margin-top: 20px">
            <template v-for="(label, key) in mainFields" :key="key">
                <a-descriptions-item v-if="data.tagInfo[key]" :label="label">
                    <a-typography-paragraph>
                        <a-typography-text strong>{{
                            data.tagInfo[key]
                            }}</a-typography-text>
                    </a-typography-paragraph>
                </a-descriptions-item>
            </template>
        </a-descriptions>

        <!-- 评论列表 -->
        <a-divider v-if="data.tagInfo?.comments?.length" orientation="left">用户评论</a-divider>
        <a-comment v-for="(comment, index) in data.tagInfo?.comments" :key="index" style="margin-bottom: 0px">
            <template #content>
                <a-typography-paragraph>
                    <a target="_blank" :href="comment.url">{{ comment.text }}</a>
                    <a-typography-text type="secondary" style="display: block; margin-top: 2px">
                        {{ comment.translate }}
                    </a-typography-text>
                    <a-typography-text type="secondary">
                        <a-tag v-if="comment.type !== 'text'" color="blue">
                            {{ comment.type }}
                        </a-tag>
                        {{ comment.feedback }}
                    </a-typography-text>
                </a-typography-paragraph>
            </template>
        </a-comment>
        <button @click="addText" size="small" type="text" class="search-btn">
            提交
        </button>
    </div>

    <a-textarea v-model:value="inputText" placeholder="请输入Tag信息" auto-size allow-clear :rows="4" @paste="handlePaste" />
</template>

<script setup>
import { formatTimeAgo } from "@/utils/timeUtils";
import { ref, onMounted, reactive, computed } from "vue";
import moment from "moment";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { GoogleOutlined } from "@ant-design/icons-vue";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ExpandText from "./child/ExpandText.vue";
import { createFromIconfontCN } from "@ant-design/icons-vue";
const IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4603537_0l6ll6wkpcx.js",
});

const router = useRouter();
const data = ref({
    sender: {
        name: "",
        screen_name: "",
        description: "",
        created_at: "",
        statuses_count: 0,
        followers_count: 0,
    },
});

const form = reactive({
    title: "",
    author: "",
    date: "",
    source: "",
});
const inputText = ref("");
const judgment = ref("");

async function generateStory(text) {
    try {
        console.log("generateStory:", import.meta.env.VITE_GOOGLE_API_KEY);

        // Initialize the GoogleGenerativeAI with your API key
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY); // Replace with your actual API key

        // Define the model and prompt
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // const prompt = "Write a story about a magic backpack.";

        console.log("addText:", text);

        // 判断是否包含中文字符
        const containsChinese = /[\u4e00-\u9fa5]/.test(text);
        console.log("addText:", text, "isChinese:", containsChinese);
        let prompt = "";
        if (containsChinese) {
            prompt = "Translate the following content to English:" + text;
        } else {
            prompt =
                "Translate the following content to Chinese.In the translation results, keep the line breaks as in English<br>:" +
                text;
        }

        // Generate content
        const result = await model.generateContent(prompt);
        let temp = result.response.text();
        console.log("temp:", temp);
        return temp;
    } catch (error) {
        console.error("Error generating story:", error);
        return "";
    }
}

async function saveData(item) {
    const url = `${import.meta.env.VITE_API_URL}/translate/set`;
    let para = {
        key: new Date().getTime(),
        value: item,
    };
    let options = {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json", // 设置请求头，指明发送的数据格式
        },
        body: JSON.stringify(para), // 将数据对象转换为 JSON 字符串
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
}

async function getData() {
    // const url = `${import.meta.env.VITE_API_URL}/x/get`;
    const url = `http://localhost:1097/x/get`;
    let para = {
        id: data.value.id,
        type: "key",
    };
    let options = {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json", // 设置请求头，指明发送的数据格式
        },
        body: JSON.stringify(para), // 将数据对象转换为 JSON 字符串
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    let res = await response.json();
    console.log("getData:", res);

}

async function updateHnList() {
    const url = `${import.meta.env.VITE_API_URL}`;

    let options = {
        method: "POST", // 指定请求方法为 POST
        headers: {
            "Content-Type": "application/json", // 设置请求头，指明发送的数据格式
        },
        body: JSON.stringify({}), // 将数据对象转换为 JSON 字符串
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    let res = await response.json();
    console.log("updateHnList:", res);
    generateStory(res).then((temp) => {
        console.log("temp:", temp);
    });
}

// 复制提示词
const getCopyable = () => {
    let promt = `
规则说明：
视频主体信息，详细描述视频主体在干什么事情，反映出一种什么样的情绪，便于后期检索视频冗余信息.

反馈信息则说明帖子截止目前，从x.com上获得的反馈数量(包含评论，转发，点赞等)。
反馈信息模板为：发布多长时间后(截止当前时间的间隔，比如天数，小时数和分钟数和秒数，按照取大不取小的形式来，比如超过24小时就是1天，超过120分钟就是2小时…)后，获得了XX回复，XX赞，XX收藏，XX转发。
综合指数公式为：综合指数 = 点赞数 + 回复数*3 + 转发数*1.5。

return back data with JSON format。

针对这条帖子中的视频，返回如下的模板信息:
原文：帖子的原文信息（如果full_text不为空的话）。
翻译：如果原文不为中文的话，返回中文翻译结果。
水印：视频中是否有水印，比如视频的作者信息等。0表示没有，1表示有水印。 
文字：视频中是否有字幕或后期输入的文字，区分水印和文字。文字是视频中后期添加的字幕或情景的文字描述信息。
主体：视频中的主体，比如人物，宠物，猫，狗，蛇等等。
事件：视频(或图片)中的主人公在干什么？
环境：发生的地点，比如是在屋内还是在户外，天气状况怎么样？车流人流多不多等。清晰描述视频中事件发生的环境状况。
情绪：视频中发生的事件主要透露出什么样的情绪，比如快乐，悲伤，震惊，有趣，猎奇，偶然等，可以使用多种情绪的组合。
反馈：发布多长时间后(截止当前时间的间隔，比如天数，小时数和分钟数和秒数，按照取大不取小的形式来，比如超过24小时就是1天，超过120分钟就是2小时…)后，获得了XX回复，XX赞，XX收藏，XX转发。
槽点：为什么这条推文在平台上大量传播，深受推友喜爱？评论区讨论的焦点集中在哪些主题上？
300个关键词：提炼出关于这条视频的300个关键词，主要是视频中出现的名词，动作，情绪，表情等。
100个关键词：把以上300个关键词按重要性浓缩为100个关键词。
30个关键词：把以上100个关键词按照重要性进一步压缩为30个关键词。

评论列表：
列出其中的5条评论。根据综合指数对原贴的评论进行排序，综合指数越高排序越靠前，列出排名前5的评论。
综合指数的计算公式是：综合指数=点赞数+回复数*3+转发数*1.5，也就是回复数量权重较高。
评论的模板为：
原文：如果有文字的话，把文字翻译成中文。
翻译：原文非中文语言，需提供原文的中文翻译。
类型：文字，图片，视频, 或者三者之间的组合，比如文字+图片，文字+图片+视频等
反馈：发布多长时间后(截止当前时间的间隔，比如天数，小时数和分钟数和秒数，按照取大不取小的形式来，比如超过24小时就是1天，超过120分钟就是2小时…)后，获得了XX赞，XX回复，XX收藏，XX转发(评论的赞靠前)。
url：回复帖子的链接，也就是点击这个链接可以看到这条回复内容。

返回示例：
{
  "full_text":"The sum of a triangle’s three interior angles is always 180 degrees",
  "translate":"三角形三个内角之和始终为 180 度",
  "is_watermark":0,
  "is_added_text":0,
  "subject": "女性歌手，视频中的主体是一位女性歌手，她是画面中的主要人物，吸引了观众的注意力。",
  "event": "女性歌手正在舞台上表演，她手持麦克风，穿着黑色背心和一条高开衩的牛仔裙，裙子的设计使得她在移动时不经意间露出大腿部分，疑似发生了轻微的‘走光’事件。她身后有乐队成员正在演奏乐器，包括一名吉他手。歌手在表演过程中似乎并未因此受到太大影响，继续专注于演唱。",
  "environment": "事件发生在户外的一个大型音乐会舞台上，背景显示为夜晚，舞台灯光以紫色为主，营造出音乐会的热烈氛围。舞台下方有大量观众，人流密集，观众中有穿着红色制服的工作人员，表明现场有一定的组织和安保措施。由于是夜晚，无法判断天气状况，但观众的穿着和现场气氛表明可能是一个温暖的夏夜。",
  "emotion": "视频中透露出的情绪主要是有趣、猎奇和偶然的组合。有趣情绪来源于歌手裙子的高开衩设计和不经意露出的画面为视频增添了轻松幽默的元素，观众可能会觉得这一幕既意外又好笑。猎奇情绪来源于这种‘走光’事件在公众场合较为少见，尤其是对于一位正在表演的歌手，满足了观众对意外事件的好奇心。偶然情绪来源于这一事件显然不是刻意安排的，属于意外情况，增加了视频的真实感和传播力。",
  "virality_factors": "高情绪唤起：根据相关研究（如《The Emotions that Drive Viral Video》），高唤起情绪（如惊讶、猎奇）是视频传播的主要驱动力。这条视频中的‘走光’事件恰好引发了观众的惊讶和好奇，促使他们分享。娱乐性与意外性：视频捕捉到了一位歌手在舞台上的尴尬瞬间，这种意外事件具有很强的娱乐性，容易吸引观众的注意力。社交媒体传播特性：视频发布在TikTok并被转发到X平台，标题‘I am confused YES or NO?’制造了悬念，激发了用户的讨论欲望，增加了互动性。名人效应：结合相关背景信息，这位歌手可能是Maren Morris（根据网页信息），她是一位有一定知名度的歌手，此前也因类似事件（如2024年7月的表演）受到关注，名人效应进一步助推了视频的传播。",
  "feedback": "视频发布于2025年6月5日11:29 UTC，当前时间为2025年6月7日12:50 +08（即04:50 UTC），计算时间间隔：1天17小时21分钟，时间间隔约为2天。获得了1,200+回复，12,000+赞，3,500+收藏，8,000+转发。",
  "300_keywords": [
    "汽车", "车窗", "司机", "手势", "手", "纹身", "手臂", "手指", "中指", "和平手势", "微笑", "笑", "幽默", "互动", "回应", "表情", "脸", "眼睛", "嘴", "头", "头发", "眼镜", "衬衫", "紫色衬衫", "黑色衬衫", "红色汽车", "白色汽车", "灰色汽车", "阳光", "天空", "云", "电线杆", "道路", "得来速", "停车场", "车辆", "后视镜", "反射", "玻璃", "车窗膜", "座位", "仪表盘", "车门", "门把手", "轮子", "方向盘", "乘客", "驾驶座", "后座", "移动", "挥手", "指点", "点头", "摇晃", "转动", "看", "盯着看", "瞥一眼", "眨眼", "露齿笑", "皱眉", "惊讶", " amusement", "困惑", "理解", "同意", "不同意", "顽皮", "严肃", "放松", "紧张", "兴奋", "平静", "焦虑", "快乐", "幸福", "悲伤", "愤怒", "恐惧", "尴尬", "骄傲", "自信", "不安全", "好奇", "兴趣", "无聊", "疲劳", "能量", "专注", "分心", "集中", "意识", "反应", "反作用", "交流", "非言语", "沉默", "噪音", "背景", "前景", "视角", "角度", "缩放", "平移", "倾斜", "特写", "广角镜头", "中景", "框架", "序列", "持续时间", "时间", "瞬间", "片刻", "秒", "分钟", "小时", "天", "夜", "早上", "下午", "晚上", "天气", "温度", "热", "冷", "风", "雨", "雪", "雾", "晴朗", "明亮", "黑暗", "光", "阴影", "对比", "颜色", "黑色", "白色", "灰色", "红色", "蓝色", "绿色", "黄色", "紫色", "棕色", "橙色", "粉红色", "质地", "光滑", "粗糙", "柔软", "硬", "金属", "塑料", "织物", "皮革", "木头", "玻璃", "橡胶", "油漆", "锈", "干净", "脏", "新", "旧", "用过的", "闪亮", "暗淡", "湿", "干", "热", "冷", "温暖", "凉爽", "快", "慢", "快速", "逐渐", "突然", "连续", "断续", "规律", "不规律", "模式", "节奏", "节拍", "脉搏", "流动", "溪流", "电流", "波浪", "潮汐", "涌动", "冲", "漂移", "漂浮", "下沉", "上升", "下降", "跳", "跃", "步", "走", "跑", "冲刺", "慢跑", "爬", "爬升", "下降", "上升", "滑动", "滑倒", "绊倒", "跌倒", "恢复", "平衡", "稳定性", "不稳定性", "平衡", "不平衡", "和谐", "不和谐", "统一", "分裂", "连接", "分离", "纽带", "断裂", "加入", "分裂", "合并", "分歧", "汇聚", "见面", "分开", "问候", "告别", "你好", "再见", "欢迎", "解雇", "邀请", "排除", "包括", "接受", "拒绝", "批准", "不批准", "同意", "不同意", "确认", "否认", "承认", "拒绝", "提供", "要求", "请求", "命令", "指令", "指导", "领导", "跟随", "追逐", "逃跑", "捕获", "释放", "握住", "放手", "保留", "失去", "找到", "搜索", "发现", "揭示", "隐藏", "展示", "告诉", "听", "听到", "说话", "交谈", "低语", "喊", "尖叫", "哭", "笑", "咯咯笑", " chuckle", "窃笑", "咆哮", "嚎叫", " yelp", "吠", "喵", "叽叽喳喳", "唱歌"
  ],
  "100_keywords": [
    "汽车", "车窗", "司机", "手势", "手", "纹身", "手臂", "手指", "中指", "和平手势", "微笑", "笑", "幽默", "互动", "回应", "表情", "脸", "眼睛", "嘴", "头", "头发", "眼镜", "衬衫", "紫色衬衫", "黑色衬衫", "红色汽车", "白色汽车", "灰色汽车", "阳光", "天空", "云", "电线杆", "道路", "得来速", "停车场", "车辆", "后视镜", "反射", "玻璃", "车窗膜", "座位", "仪表盘", "车门", "门把手", "轮子", "方向盘", "乘客", "驾驶座", "后座", "移动", "挥手", "指点", "点头", "摇晃", "转动", "看", "盯着看", "瞥一眼", "眨眼", "露齿笑", "皱眉", "惊讶", " amusement", "困惑", "理解", "同意", "不同意", "顽皮", "严肃", "放松", "紧张", "兴奋", "平静", "焦虑", "快乐", "幸福", "悲伤", "愤怒", "恐惧", "尴尬", "骄傲", "自信", "不安全", "好奇", "兴趣", "无聊", "疲劳", "能量", "专注", "分心", "集中", "意识", "反应", "反作用", "交流", "非言语", "沉默", "噪音", "背景", "前景"
  ],
  "30_keywords": [
    "汽车", "车窗", "司机", "手势", "手", "纹身", "手指", "微笑", "笑", "幽默", "互动", "表情", "脸", "眼睛", "头", "衬衫", "红色汽车", "阳光", "道路", "得来速", "后视镜", "玻璃", "移动", "挥手", "指点", "点头", "惊讶", " amusement", "顽皮", "交流"
  ],
  "comments": [
    {
      "text": "Haha, this skirt is so dangerous! She's quite calm and professional!",
      "translate": "哈哈，这裙子也太危险了吧！她还挺淡定，专业！",
      "type": "text",
      "feedback": "发布2天后，获得了3,500赞，150回复，1,200转发。综合指数 = 3,500 + 150*3 + 1,200*1.5 = 3,500 + 450 + 1,800 = 5,750",
      "url":"https://x.com/Mojo_Doughjo/status/1935792504823337072"
    },
    {
      "text": "Whoa, what is this? The skirt is way too high! [Face with Tears of Joy emoji]",
      "translate": "我去，这是什么操作？裙子开衩也太高了吧！[笑哭表情]",
      "type": "text",
      "feedback": "发布2天后，获得了3,000赞，120回复，1,000转发。综合指数 = 3,000 + 120*3 + 1,000*1.5 = 3,000 + 360 + 1,500 = 4,860",
      "url":"https://x.com/Mojo_Doughjo/status/1935792504823337072"
    },
    {
      "text": "This video is so funny, I can't help but watch it several times!",
      "translate": "这视频太搞笑了，忍不住多看几遍！",
      "type": "text",
      "feedback": "发布2天后，获得了2,800赞，100回复，900转发。综合指数 = 2,800 + 100*3 + 900*1.5 = 2,800 + 300 + 1,350 = 4,450",
      "url":"https://x.com/Mojo_Doughjo/status/1935792504823337072"
    },
    {
      "text": "Her expression is so calm, haha, it's killing me with laughter! [Video clip of the singer calmly continuing her performance]",
      "translate": "她的表情好淡定，哈哈哈，给我笑死了！[视频：歌手淡定继续表演的片段]",
      "type": "text+video",
      "feedback": "发布2天后，获得了2,500赞，90回复，800转发。综合指数 = 2,500 + 90*3 + 800*1.5 = 2,500 + 270 + 1,200 = 3,970",
      "url":"https://x.com/Mojo_Doughjo/status/1935792504823337072"
    },
    {
      "text": "There's something wrong with this skirt design, the designer should be here to take a beating! [Close-up photo of the skirt slit]",
      "translate": "这裙子设计有问题吧，设计师出来挨打！[图片：裙子开衩的特写]",
      "type": "text+image",
      "feedback": "发布2天后，获得了2,200赞，80回复，700转发。综合指数 = 2,200 + 80*3 + 700*1.5 = 2,200 + 240 + 1,050 = 3,490",
      "url":"https://x.com/ShaunMooreUK/status/1935792111187861861"
    }
  ]
}
}

    `;

    let url = `https://x.com/${data.value.sender.screen_name}/status/${data.value.id}`;

    return {
        text: url + "\n" + promt,
        tooltips: ["复制链接", "复制成功"],
        onCopy: () => {
            message.success("链接已复制到剪贴板");
        },
    };
};

// 中文标签映射配置
const labelMap = {
    created_at: "发布",
    bookmark_count: "收藏",
    quote_count: "引用",
    favorite_count: "喜欢",
    reply_count: "回复",
    retweet_count: "转发",
};

// 动态生成描述项配置
const descbItems = computed(() => {
    return Object.keys(data.value.description || {})
        .filter((key) => key !== "full_text") // 排除标题字段
        .map((key) => ({
            key,
            label: labelMap[key],
        }));
});

// 需要展示的主要字段配置（移入组件顶层）
const mainFields = {
    subject: "主体",
    event: "事件",
    environment: "环境",
    emotion: "情感",
    virality_factors: "槽点",
    feedback: "反馈",
};

//tag信息粘贴之后识别
function handlePaste(e) {
    try {
        e.preventDefault(); // 阻止默认粘贴行为
        // 获取粘贴的文本内容
        const pastedText = e.clipboardData.getData("text/plain");

        // 尝试解析JSON
        const json = JSON.parse(pastedText);
        console.log("json", json);
        data.value.tagInfo = {
            ...json,
            // 对virality_factors添加换行符增强可读性
            virality_factors:
                json.virality_factors?.replace(/。/g, "。\n") || json.virality_factors,
        };
        localStorage.setItem(`tag_${data.value.id}`, pastedText);

        inputText.value = "";
        addText().then(() => {
            message.success("JSON解析成功");
        })
    } catch (error) {
        message.error("粘贴的内容不是有效的JSON格式");
        console.error("JSON解析错误:", error);
    }
}

async function addText() {
    const url = `${import.meta.env.VITE_API_URL}/x/save`;
    // const url = `http://localhost:1097/x/save`;
    console.log("url is:", data.value);
    let tagInfo = { ...data.value.tagInfo }
    delete tagInfo['300_keywords']
    delete tagInfo['100_keywords']
    tagInfo['keywords'] = [...tagInfo['30_keywords']]
    delete tagInfo['30_keywords']
    delete tagInfo['full_text']
    for (const key in tagInfo) {
        if (typeof tagInfo[key] === 'object' && tagInfo[key] !== null) {
            tagInfo[key] = JSON.stringify(tagInfo[key])
        }
    }
    let para = { id: data.value.id, tag_info: tagInfo }

    // 使用 try-catch 处理超时错误
    try {
        let options = {
            method: "POST", // 指定请求方法为 POST
            headers: {
                "Content-Type": "application/json", // 设置请求头，指明发送的数据格式
            },
            body: JSON.stringify(para), // 将数据对象转换为 JSON 字符串
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const resData = await response.json();

        console.log("return data:", resData);
        // 处理数据...
    } catch (error) {
        if (error.name === "TimeoutError") {
            console.error("请求超时");
            // 处理超时错误...
        } else {
            console.error("请求失败:", error);
            // 处理其他错误...
        }
    }
}

onMounted(async () => {
    // generateStory()
    const storedData = localStorage.getItem("current_twitter_item");
    if (storedData) {
        let obj = JSON.parse(storedData);
        let description = {
            created_at: obj.created_at,
            full_text: obj.full_text,
            bookmark_count: obj.bookmark_count,
            quote_count: obj.quote_count,
            favorite_count: obj.favorite_count,
            reply_count: obj.reply_count,
            retweet_count: obj.retweet_count,
        };

        data.value = { ...obj, description };
        console.log("data is", data.value);

        let oriInfo = obj.extended_entities?.media[0]?.original_info
        if (oriInfo.height > oriInfo.width) {
            data.value.direction = 0  //竖屏
        } else if (oriInfo.width > oriInfo.height) {
            data.value.direction = 1
        } else {
            data.value.direction = 0
        }
        // 从本地查询数据
        let tag = localStorage.getItem(`tag_${data.value.id}`)
        console.log('tag:', tag)
        if (tag) {
            data.value.tagInfo = JSON.parse(tag)
        } else {
            
        }
        await getData()
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

:deep(.ant-comment-inner) {
    padding: 5px 10px 0px 0px;
}
</style>
