<template>
    <a-descriptions title="User Info">
        <a-descriptions-item label="title">
            <a @click.prevent="openInExistingTab(`https://www.dushu365.com/book/${firstItem.link}`)"
                style="cursor: pointer; text-decoration: underline; color: blue;">
                {{ firstItem.title }}
            </a>
        </a-descriptions-item>
        <a-descriptions-item label="link">{{ firstItem.link }}</a-descriptions-item>
        <a-descriptions-item label="playCount">{{ firstItem.playCount }}</a-descriptions-item>
        <a-descriptions-item label="releaseDate">{{ firstItem.releaseDate }}</a-descriptions-item>
        <a-descriptions-item label="uploaded">{{ firstItem.uploaded }}</a-descriptions-item>
        <a-descriptions-item label="description">
            {{ `No. ${firstItem.index}, ${firstItem.link}` }}
        </a-descriptions-item>
    </a-descriptions>
    <br />
    <a-textarea v-model:value="audioUrl" show-count :maxlength="100000" />
    <br />
    <a-flex :justify="'flex-end'" :align="'flex-start'">
        <a-button shape="circle" :icon="h(RightOutlined)" @click="getInitInfo" />
        <a-button type="primary" :icon="h(CheckOutlined)" @click="setInfo">确认</a-button>
    </a-flex>

</template>
<script setup>

import { ref, onMounted, h } from 'vue';
import { UpOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router'

const firstItem = ref({})
const audioUrl = ref('');
onMounted(() => {
    getInitInfo()
});


//刷新已打开的页面，而不是不断打开新页面
const openInExistingTab = (url) => {
    // 为相同域名的页面创建一个固定的 target 名称
    const targetName = 'dushu365BookTab';

    // 尝试打开页面，如果已存在同名 target 的窗口，则会在该窗口中打开
    const newWindow = window.open(url, targetName);
    if (newWindow) {
        newWindow.focus();
    }
}

const setInfo = async () => {
    try {
        if (audioUrl.value.length < 1) {
            return
        }
        const url = `${import.meta.env.VITE_API_URL}/fandeng/update`

        // 要发送的数据
        const dataToSend = {
            index: firstItem.value.index - 1,
            bookId: firstItem.value.link,
            audioUrl: audioUrl.value
        };


        const response = await fetch(url, {
            method: 'POST', // 指定请求方法为 POST
            headers: {
                'Content-Type': 'application/json', // 设置请求头，指明发送的数据格式
            },
            body: JSON.stringify(dataToSend), // 将数据对象转换为 JSON 字符串
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('magazine result:', result);
        firstItem.value = result
        audioUrl.value = ''
    } catch (error) {
        console.error('Error fetching question details:', error);
    }
}

const setInitInfo = async () => {
    try {
        const url = `${import.meta.env.VITE_API_URL}/fandeng/init`

        // 要发送的数据
        const dataToSend = {
            para: data
        };


        // const response = await fetch(url, {
        //     method: 'POST', // 指定请求方法为 POST
        //     headers: {
        //         'Content-Type': 'application/json', // 设置请求头，指明发送的数据格式
        //     },
        //     body: JSON.stringify(dataToSend), // 将数据对象转换为 JSON 字符串
        // });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('magazine result:', result);

    } catch (error) {
        console.error('Error fetching question details:', error);
    }
}

const getInitInfo = async () => {
    try {
        const url = `${import.meta.env.VITE_API_URL}/fandeng/get`

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('magazine result:', result);

        for (let index = 0; index < result.length; index++) {
            const item = result[index];

            if (!item.uploaded && item.audioUrl.length < 1) {
                item.index = index + 1
                firstItem.value = item
                break
            }

        }

    } catch (error) {
        console.error('Error fetching question details:', error);
    }
};

const data = `[
    {
        "title": "非暴力沟通",
        "description": "高情商聊天术，助你生活事业如鱼得水",
        "releaseDate": "2016.07.30上新",
        "playCount": "播放量10498.9万",
        "link": "/book/331",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/16783263692bf85a05c10118c413c116a1ad478a890mlkcw.mp3?key=b649659bc9cde3b97cfa10d56daed9f6&time=1743070089",
        "uploaded": true
    },
    {
        "title": "正面管教",
        "description": "带娃苦不堪言？黄金育儿法则助你一劳永逸",
        "releaseDate": "2017.03.18上新",
        "playCount": "播放量10223.9万",
        "link": "/book/365",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503280951/9384636b99d7f2732cc61b97ca7e109c/media/audio/16783364799cf777d282bbfb69e2b74731d50ae64c2yuthz.mp3",
        "uploaded": true
    },
    {
        "title": "亲密关系",
        "description": "揭开那些关于亲密关系的秘密、陷阱和技巧",
        "releaseDate": "2017.04.08上新",
        "playCount": "播放量7945.3万",
        "link": "/book/368",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1678336346dfb466163f86b3a37ff16feca69d2a6bu6jiko.mp3?key=7badaa62109168db361f0e21258f0079&time=1743126841",
        "uploaded": true
    },
    {
        "title": "终身成长",
        "description": "成长型思维决定你的人生能走多远",
        "releaseDate": "2018.04.28上新",
        "playCount": "播放量7537.1万",
        "link": "/book/586",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1678330937c7380d5e0e8b74a357fcf8503a4aae9f1k37ji.mp3?key=c5643f3047914aece7dc35380e3cb9c7&time=1743127121",
        "uploaded": true
    },
    {
        "title": "逆商",
        "description": "教你如何淡定应对生活中的坏事件",
        "releaseDate": "2019.03.30上新",
        "playCount": "播放量7326.7万",
        "link": "/book/200000046",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1678338802e58fbdbd20a7ac26edb1b3eb433521036rd9tq.mp3?key=770ee6efb1996fde92b39d650ba9b765&time=1743127228",
        "uploaded": true
    },
    {
        "title": "父母的语言",
        "description": "你的每一句话，都可能激发孩子的学习潜能",
        "releaseDate": "2018.12.15上新",
        "playCount": "播放量6677.7万",
        "link": "/book/200000025",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503271808/28d2fdbc10c655a1572224839d508fc9/media/audio/167878286424123bbc6da4fcd5e5d7f9928051854a7t779z.mp3",
        "uploaded": true
    },
    {
        "title": "关键对话",
        "description": "对话有道，沟通有术，以四两拨千斤的方式解决生活中的难题",
        "releaseDate": "2015.10.24上新",
        "playCount": "播放量6483.0万",
        "link": "/book/102",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/16783363961bb3482feb3c8f48c8072e9605fc707bchp99t.mp3?key=c62fe445be268c55cabd4a765a476caf&time=1743127436",
        "uploaded": true
    },
    {
        "title": "刻意练习",
        "description": "杰出不是一种天赋，而是一种人人都可以学会的技巧",
        "releaseDate": "2016.11.19上新",
        "playCount": "播放量5987.1万",
        "link": "/book/349",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503281013/699094726fe9f0f948766d4b4789433e/media/audio/1709027522019e519cb58daca10d464894b7dfbfe7n6i7fw.mp3",
        "uploaded": true
    },
    {
        "title": "可复制的领导力",
        "description": "轻松掌握领导力，打造核心竞争力",
        "releaseDate": "2017.12.09上新",
        "playCount": "播放量5512.4万",
        "link": "/book/561",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/16781863858087aa8ebc643191a87e98757c750ba3gok7wx.mp3?key=d7ff2d108a9fc60a7e508f94533edde7&time=1743070106",
        "uploaded": true
    },
    {
        "title": "如何让你爱的人爱上你",
        "description": "爱要真心诚意——这我都知道了，但套路和“撩”谁来教我一下",
        "releaseDate": "2017.01.07上新",
        "playCount": "播放量5341.7万",
        "link": "/book/355",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/167877890064dd5021b5f7864c36dc262a7d0b214ewd2qbi.mp3?key=84ff654b5cc9cf182b9a2ffa05de00a8&time=1743128269",
        "uploaded": true
    },
    {
        "title": "自卑与超越",
        "description": "摆脱自卑，有且仅有一种方式",
        "releaseDate": "2017.05.20上新",
        "playCount": "播放量4996.0万",
        "link": "/book/374",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503281018/9f8be66271f8945d40520ccc2e8d9a1b/media/audio/1678330839b3fabda2e77611254b160a46122a4f637nsa9b.mp3",
        "uploaded": true
    },
    {
        "title": "人生只有一件事",
        "description": "你离幸福只差一件事，就是学好“怎么活”",
        "releaseDate": "2021.07.10上新",
        "playCount": "播放量4988.4万",
        "link": "/book/400004632",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1715402752e79d6d37ad2e4015ee7c62af85a15585ioh20j.mp3?key=118a89df310abe4b058bb955a0659c49&time=1743070112",
        "uploaded": true
    },
    {
        "title": "即兴演讲",
        "description": "成为即兴演讲家，用说话影响他人",
        "releaseDate": "2018.06.09上新",
        "playCount": "播放量4754.0万",
        "link": "/book/593",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "如何培养孩子的社会能力",
        "description": "社会能力是孩子人生幸福的基础。教会孩子怎么做，而不是替他做",
        "releaseDate": "2016.01.01上新",
        "playCount": "播放量4595.6万",
        "link": "/book/103",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "你就是孩子最好的玩具",
        "description": "避开育儿误区，建立亲密、健康的亲子关系",
        "releaseDate": "2013.12.03上新",
        "playCount": "播放量4556.8万",
        "link": "/book/19",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "应对焦虑",
        "description": "9种消除焦虑的简单方法",
        "releaseDate": "2019.03.02上新",
        "playCount": "播放量4540.3万",
        "link": "/book/200000042",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "活好",
        "description": "如何活好，此生无憾",
        "releaseDate": "2018.10.27上新",
        "playCount": "播放量4286.5万",
        "link": "/book/200000018",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "感受爱",
        "description": "这本解忧指南，助你在亲密关系中找到生命的甜点时刻",
        "releaseDate": "2019.01.12上新",
        "playCount": "播放量4040.3万",
        "link": "/book/200000034",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "不管教的勇气",
        "description": "如何通过“不管教”培养更独立的孩子",
        "releaseDate": "2019.06.01上新",
        "playCount": "播放量4038.1万",
        "link": "/book/200000056",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "心态",
        "description": "摆正心态指针，开启积极人生",
        "releaseDate": "2021.09.11上新",
        "playCount": "播放量3982.4万",
        "link": "/book/400009396",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "活出心花怒放的人生",
        "description": "清华大学心理学系主任写给你的幸福枕边书",
        "releaseDate": "2020.09.26上新",
        "playCount": "播放量3930.7万",
        "link": "/book/400000056",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/17200680641c82716c8b5446c19b4acffe558a720136a7da.mp3?key=e9cc7b47cff11de32147079ea89a14ca&time=1743070131",
        "uploaded": true
    },
    {
        "title": "掌控习惯",
        "description": "已被超过50万人验证过的好习惯养成法",
        "releaseDate": "2019.07.20上新",
        "playCount": "播放量3930.5万",
        "link": "/book/200000063",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "不吼不叫",
        "description": "破解“父母吼”的「武林秘籍」，让孩子平静地与你合作",
        "releaseDate": "2016.12.10上新",
        "playCount": "播放量3869.5万",
        "link": "/book/352",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "如何说孩子才会听，怎么听孩子才肯说",
        "description": "如何把亲子矛盾化解于无形？这本书教给你一些实用的小技巧",
        "releaseDate": "2016.07.16上新",
        "playCount": "播放量3864.0万",
        "link": "/book/156",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "自驱型成长",
        "description": "从管教到自律，4大理论教你让孩子对学习上瘾",
        "releaseDate": "2020.09.19上新",
        "playCount": "播放量3803.2万",
        "link": "/book/400000050",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "认知天性",
        "description": "11位心理学家耗费10年心血，打破你坚信的学习误区",
        "releaseDate": "2018.11.03上新",
        "playCount": "播放量3733.4万",
        "link": "/book/200000019",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "陪孩子终身成长",
        "description": "如何成为孩子的“神助攻”",
        "releaseDate": "2020.04.18上新",
        "playCount": "播放量3709.2万",
        "link": "/book/200000120",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "幸福的婚姻",
        "description": "没有永不争吵的夫妻，但此书的法则或许可以让你的婚姻双倍和谐",
        "releaseDate": "2015.09.18上新",
        "playCount": "播放量3685.5万",
        "link": "/book/206",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "销售就是要玩转情商",
        "description": "高效拿捏客户心理，情商才是成交关键",
        "releaseDate": "2016.10.15上新",
        "playCount": "播放量3673.1万",
        "link": "/book/343",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我的情绪为何总被他人左右",
        "description": "告别患得患失和左右彷徨，拿回你的“情绪掌控权“",
        "releaseDate": "2016.02.04上新",
        "playCount": "播放量3597.1万",
        "link": "/book/307",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "他人的力量",
        "description": "教你寻求更好的人际关系，让你一生受益",
        "releaseDate": "2018.03.03上新",
        "playCount": "播放量3569.8万",
        "link": "/book/577",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "幸福的方法",
        "description": "幸福不是状态，幸福是一种能力",
        "releaseDate": "2013.11.25上新",
        "playCount": "播放量3569.3万",
        "link": "/book/20",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "能力陷阱",
        "description": "困住你的不是你的短板，而是你的长处",
        "releaseDate": "2019.04.06上新",
        "playCount": "播放量3559.2万",
        "link": "/book/200000047",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "高效休息法",
        "description": "消除大脑疲惫的7个休息法",
        "releaseDate": "2019.06.08上新",
        "playCount": "播放量3524.6万",
        "link": "/book/200000057",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "运动改造大脑",
        "description": "持续运动，让人更聪明、更快乐",
        "releaseDate": "2018.10.06上新",
        "playCount": "播放量3502.2万",
        "link": "/book/200000015",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "列奥纳多·达·芬奇传",
        "description": "带你走近一个好奇了一辈子的老顽童",
        "releaseDate": "2019.03.16上新",
        "playCount": "播放量3480.0万",
        "link": "/book/200000043",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "不妥协的谈判",
        "description": "这5种方式，矫正你的沟通姿势",
        "releaseDate": "2019.10.12上新",
        "playCount": "播放量3471.7万",
        "link": "/book/200000080",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我们都曾受过伤，却有了更好的人生",
        "description": "童年受伤的人，如何走向更好的未来",
        "releaseDate": "2020.01.04上新",
        "playCount": "播放量3434.3万",
        "link": "/book/200000097",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "思辨与立场",
        "description": "助你跳出思维陷阱的出坑指南，让你清醒从容的思维诊断书",
        "releaseDate": "2018.12.08上新",
        "playCount": "播放量3367.6万",
        "link": "/book/200000024",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "洞见",
        "description": "只有真正了解自己，才能掌控自己的人生",
        "releaseDate": "2020.09.12上新",
        "playCount": "播放量3365.8万",
        "link": "/book/400000042",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "低风险创业",
        "description": "樊登创业6大心法，教你降低创业风险",
        "releaseDate": "2019.04.27上新",
        "playCount": "播放量3355.8万",
        "link": "/book/200000051",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1709274725210dae6e6762d25a525e58350794bf185k9zde.mp3?key=65cd318c1eaa4220c6c779a6c01a3d04&time=1743070172",
        "uploaded": true
    },
    {
        "title": "自尊",
        "description": "快速实现自尊的跃迁，练就一颗强韧的心",
        "releaseDate": "2019.06.15上新",
        "playCount": "播放量3294.1万",
        "link": "/book/200000058",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1676282953e783ad72afc9ba8b4270eb0c7be5be34gy4qwa.mp3?key=4fad643588d394a37c35e32b73823224&time=1743070174",
        "uploaded": true
    },
    {
        "title": "事实",
        "description": "不让直觉和情绪左右你的人生决策",
        "releaseDate": "2019.08.03上新",
        "playCount": "播放量3289.2万",
        "link": "/book/200000065",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "被忽视的孩子",
        "description": "深析12类忽视孩子的父母及如何超越原生家庭",
        "releaseDate": "2019.11.09上新",
        "playCount": "播放量3262.9万",
        "link": "/book/200000084",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "思维的囚徒",
        "description": "抓住7项原则，活出生命意义",
        "releaseDate": "2020.02.29上新",
        "playCount": "播放量3177.4万",
        "link": "/book/200000109",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "活法",
        "description": "从迷茫小镇青年到世界500强缔造者，他全力以赴地活出精彩",
        "releaseDate": "2018.07.07上新",
        "playCount": "播放量3146.7万",
        "link": "/book/596",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "反脆弱",
        "description": "真正的英雄主义，是学会从生活的不确定中获益",
        "releaseDate": "2018.01.06上新",
        "playCount": "播放量3118.8万",
        "link": "/book/569",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503271809/82e282c9046ecb0044631d0a151f1253/media/audio/168136002555cef4c8ab8f0f963343fd71a577ad24et2tf9.mp3",
        "uploaded": true
    },
    {
        "title": "解惑：心智模式决定你的一生",
        "description": "四种认知模式助你理解人生真谛",
        "releaseDate": "2021.05.22上新",
        "playCount": "播放量3103.6万",
        "link": "/book/400002338",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "思考，快与慢",
        "description": "了解人类非理性行为的入门书",
        "releaseDate": "2017.11.18上新",
        "playCount": "播放量3094.0万",
        "link": "/book/555",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "坚毅",
        "description": "教你设立目标，再教你实现目标",
        "releaseDate": "2019.05.04上新",
        "playCount": "播放量3078.0万",
        "link": "/book/200000052",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "用事实说话",
        "description": "怎么说人家才愿意听你的？说话要真诚，也需要技巧",
        "releaseDate": "2019.02.16上新",
        "playCount": "播放量3060.9万",
        "link": "/book/200000040",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "第3选择",
        "description": "超越非此即彼，教你陷入两难时找到双赢方案",
        "releaseDate": "2014.01.04上新",
        "playCount": "播放量3054.2万",
        "link": "/book/55",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "曾国藩的正面与侧面",
        "description": "人生五堑，曾国藩如何“脱胎换骨”——可复制的自我成长",
        "releaseDate": "2020.09.05上新",
        "playCount": "播放量2916.4万",
        "link": "/book/200000150",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/167870801599b2747719ae23204f2239cd0f7b1da4htil1u.mp3?key=2f71d0fc27bcb514a12c403371d87de7&time=1743070196",
        "uploaded": true
    },
    {
        "title": "解码青春期",
        "description": "让更多家长读懂孩子的青春期",
        "releaseDate": "2019.08.31上新",
        "playCount": "播放量2909.2万",
        "link": "/book/200000069",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "你要如何衡量你的人生",
        "description": "不喂鸡汤，哈佛教授带你理性看待人生",
        "releaseDate": "2016.06.25上新",
        "playCount": "播放量2897.3万",
        "link": "/book/325",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "爱、金钱和孩子",
        "description": "为什么生活更好了，人们育儿却更愁了",
        "releaseDate": "2020.02.08上新",
        "playCount": "播放量2825.3万",
        "link": "/book/200000102",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "原生家庭",
        "description": "摆脱原生家庭的负能量，重获自由与新生",
        "releaseDate": "2019.05.11上新",
        "playCount": "播放量2787.8万",
        "link": "/book/200000053",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "干法",
        "description": "人人都想活得更好，怎么才能好好活？答案：先得学会好好干",
        "releaseDate": "2016.03.26上新",
        "playCount": "播放量2744.8万",
        "link": "/book/63",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "次第花开",
        "description": "在浮躁的年代，静静等待次第花开",
        "releaseDate": "2015.07.03上新",
        "playCount": "播放量2742.8万",
        "link": "/book/174",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "斯坦福高效睡眠法",
        "description": "一本值得分享的睡眠宝典",
        "releaseDate": "2020.05.23上新",
        "playCount": "播放量2725.5万",
        "link": "/book/200000132",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "苏东坡传",
        "description": "大江东去，老夫犹在你心",
        "releaseDate": "2018.12.01上新",
        "playCount": "播放量2721.8万",
        "link": "/book/200000023",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "掌控谈话",
        "description": "FBI谈判专家解密谈话“独孤九剑”，让你随时随地掌控局面",
        "releaseDate": "2018.10.13上新",
        "playCount": "播放量2712.2万",
        "link": "/book/200000016",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "孔子传",
        "description": "不了解孔子，你会错过什么",
        "releaseDate": "2019.11.23上新",
        "playCount": "播放量2710.3万",
        "link": "/book/200000086",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "王阳明哲学",
        "description": "勾勒王阳明思想历程，阐释心学义理",
        "releaseDate": "2017.01.21上新",
        "playCount": "播放量2701.5万",
        "link": "/book/357",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "意志力",
        "description": "关于自控、专注与效率的心理学",
        "releaseDate": "2020.04.11上新",
        "playCount": "播放量2700.9万",
        "link": "/book/200000118",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "正念饮食（原《学会吃饭》）",
        "description": "吃饭这件事，为什么吃，比吃什么、怎么吃更重要",
        "releaseDate": "2019.07.13上新",
        "playCount": "播放量2621.5万",
        "link": "/book/200000062",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "世界观",
        "description": "如果你每天都读你看得懂的书，你就只知道已知的世界观",
        "releaseDate": "2019.04.20上新",
        "playCount": "播放量2610.1万",
        "link": "/book/200000050",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "少有人走的路",
        "description": "少有人走的路，才通向最美的风景",
        "releaseDate": "2017.08.05上新",
        "playCount": "播放量2589.2万",
        "link": "/book/385",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "顾客为什么购买",
        "description": "没人能逃出的“购物陷阱学”",
        "releaseDate": "2019.08.17上新",
        "playCount": "播放量2572.5万",
        "link": "/book/200000067",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "道德经说什么",
        "description": "樊登对谈韩鹏杰：读得懂，记得住，用得上的经典哲学",
        "releaseDate": "2019.07.27上新",
        "playCount": "播放量2495.3万",
        "link": "/book/200000064",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "内在动机：自主掌控人生的力量",
        "description": "人生幸福的答案之书",
        "releaseDate": "2020.11.28上新",
        "playCount": "播放量2487.5万",
        "link": "/book/400000108",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/16787068966c0da4dc55b6e4cac986d410adeecb2dbuf62a.mp3?key=583a1b3186c84734b5c1501f16f4add9&time=1743070233",
        "uploaded": true
    },
    {
        "title": "热锅上的家庭",
        "description": "爱的本能人人都有，爱的技巧却需要学习",
        "releaseDate": "2018.08.11上新",
        "playCount": "播放量2480.0万",
        "link": "/book/200000006",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "心流",
        "description": "积极心理学奠基作，提升效率和幸福的指南",
        "releaseDate": "2018.03.24上新",
        "playCount": "播放量2476.8万",
        "link": "/book/580",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "掌控",
        "description": "吃最需要的食物，做最舒服的运动，过最带劲儿的人生",
        "releaseDate": "2019.04.13上新",
        "playCount": "播放量2460.5万",
        "link": "/book/200000048",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503271810/08c3e3d7f1fcf6526de34b45b0061c59/media/audio/17413377119116433a89e567c5f14335faff4e94cf8rt4oh.mp3",
        "uploaded": true
    },
    {
        "title": "一平方米的静心",
        "description": "职场人士的必备静谧课，为疲惫心灵降噪",
        "releaseDate": "2018.09.22上新",
        "playCount": "播放量2420.8万",
        "link": "/book/200000013",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "考试脑科学",
        "description": "脑科学博士教你高效记忆，考试事半功倍",
        "releaseDate": "2021.05.15上新",
        "playCount": "播放量2414.1万",
        "link": "/book/400002113",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503271810/e5e796b43f383a28c92ca2f3153742ec/media/audio/1678782405e0da590740a153a5c11495cbeb54d92fvo0v4h.mp3",
        "uploaded": true
    },
    {
        "title": "陌生人效应",
        "description": "如何做社交关系中的聪明人",
        "releaseDate": "2020.08.08上新",
        "playCount": "播放量2382.0万",
        "link": "/book/200000146",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "你好，小孩",
        "description": "做父母，也要60分万岁",
        "releaseDate": "2021.04.17上新",
        "playCount": "播放量2378.4万",
        "link": "/book/400001749",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/167825924544a85d5ee78b5d44c90be0c5c8cda3dd2732lw.mp3?key=035a0f121432c9893bbf97493aab59f4&time=1743070247",
        "uploaded": true
    },
    {
        "title": "如何克服社交焦虑",
        "description": "如何摆脱社恐，把握更多机遇？",
        "releaseDate": "2021.04.24上新",
        "playCount": "播放量2370.0万",
        "link": "/book/400001898",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "瞬变",
        "description": "让改变轻松起来的九个方法",
        "releaseDate": "2015.12.12上新",
        "playCount": "播放量2366.9万",
        "link": "/book/152",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "你要的是幸福，还是对错",
        "description": "婚姻是一场幸福的博弈，需要“斗智斗勇”，更需用心经营",
        "releaseDate": "2019.03.09上新",
        "playCount": "播放量2351.5万",
        "link": "/book/200000044",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "销售洗脑",
        "description": "这是一本教你洞察销售技巧，让销售业绩如火箭般飞升的神奇之书",
        "releaseDate": "2016.12.03上新",
        "playCount": "播放量2351.3万",
        "link": "/book/351",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "扫除道",
        "description": "平凡小事，一旦彻底做好，就能产生非凡的力量",
        "releaseDate": "2018.11.10上新",
        "playCount": "播放量2293.0万",
        "link": "/book/200000020",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/158287595859eccfb01c1322927e854b9e2a42d701p4q2p3.mp3?key=d4a9c77a88a9af587a7bef01d3fe18d6&time=1743070257",
        "uploaded": true
    },
    {
        "title": "与内心的恐惧对话",
        "description": "11个问题识别你身边的情感勒索者",
        "releaseDate": "2020.06.20上新",
        "playCount": "播放量2292.1万",
        "link": "/book/200000136",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "叛逆不是孩子的错",
        "description": "读懂孩子叛逆行为背后的心理需要，让亲子冲突不再是必然结果",
        "releaseDate": "2015.02.06上新",
        "playCount": "播放量2281.3万",
        "link": "/book/153",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "身为职场女性",
        "description": "突破瓶颈期，你有12个进阶的机会",
        "releaseDate": "2019.08.10上新",
        "playCount": "播放量2277.3万",
        "link": "/book/200000066",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "跳出头脑，融入生活",
        "description": "扭转人生的关键，是按下思维暂停键",
        "releaseDate": "2021.08.21上新",
        "playCount": "播放量2273.2万",
        "link": "/book/400007272",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "樊登讲论语：学而",
        "description": "应用《论语》智慧，让为人处世变简单",
        "releaseDate": "2020.12.12上新",
        "playCount": "播放量2272.6万",
        "link": "/book/400000516",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503271811/045c9d80f8912ebf2af14022a8d5e945/media/audio/16784426683df0ce046b0843bc634e3512957c0085qd979l.mp3",
        "uploaded": true
    },
    {
        "title": "欲罢不能",
        "description": "刷屏时代，教你摆脱“行为上瘾”",
        "releaseDate": "2019.03.23上新",
        "playCount": "播放量2268.8万",
        "link": "/book/200000045",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "幸福关系的7段旅程",
        "description": "婚姻进入冷淡期？7个步骤，助感情快速升温",
        "releaseDate": "2021.03.20上新",
        "playCount": "播放量2265.2万",
        "link": "/book/400001511",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "睡眠革命",
        "description": "打破8小时定式，7周彻底改善睡眠质量",
        "releaseDate": "2017.11.25上新",
        "playCount": "播放量2264.7万",
        "link": "/book/556",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "幸福的陷阱",
        "description": "解开你对幸福的误解：过度追求幸福，反而带来痛苦",
        "releaseDate": "2019.12.14上新",
        "playCount": "播放量2262.5万",
        "link": "/book/200000089",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "深度工作",
        "description": "提高专注力，你就是行业尖子。让你的“每一丝”脑力，都有回声",
        "releaseDate": "2018.01.27上新",
        "playCount": "播放量2214.3万",
        "link": "/book/572",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "张爱玲传",
        "description": "像张爱玲一样，看得明白、活得通透",
        "releaseDate": "2021.04.10上新",
        "playCount": "播放量2205.1万",
        "link": "/book/400001656",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "管理十诫",
        "description": "影响你一生的管理哲学",
        "releaseDate": "2014.03.14上新",
        "playCount": "播放量2181.5万",
        "link": "/book/76",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "恰如其分的自尊",
        "description": "带你建立最适合你的自尊体系",
        "releaseDate": "2017.12.02上新",
        "playCount": "播放量2128.2万",
        "link": "/book/558",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1677031673684010039ecb9aa8451c0bf966e1086au7ovdk.mp3?key=2f37d6b7d1d583448dc7af4378521bf1&time=1743070283",
        "uploaded": true
    },
    {
        "title": "目标感",
        "description": "告别迷茫，找到人生真方向",
        "releaseDate": "2022.07.09上新",
        "playCount": "播放量2118.0万",
        "link": "/book/400017975",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "学习的格局",
        "description": "解开让孩子自主学习的5大秘密",
        "releaseDate": "2020.07.25上新",
        "playCount": "播放量2117.4万",
        "link": "/book/200000144",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "清醒地活",
        "description": "超越自我的生命之旅",
        "releaseDate": "2023.08.12上新",
        "playCount": "播放量2113.4万",
        "link": "/book/400071952",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "高能量姿势",
        "description": "两分钟的自信高能量暴增法",
        "releaseDate": "2019.02.23上新",
        "playCount": "播放量2110.3万",
        "link": "/book/200000041",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "养育女孩",
        "description": "女孩应该怎么养？穷养or富养？这本书告诉你答案",
        "releaseDate": "2016.05.06上新",
        "playCount": "播放量2082.5万",
        "link": "/book/320",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "分手后，成为更好的自己",
        "description": "教你避开6种坏感情，经营一段好感情",
        "releaseDate": "2019.09.07上新",
        "playCount": "播放量2081.3万",
        "link": "/book/200000071",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "孩子的品格",
        "description": "7种品格优势，成就孩子一生的幸福",
        "releaseDate": "2021.10.30上新",
        "playCount": "播放量2074.6万",
        "link": "/book/400014349",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "武曌",
        "description": "看武则天如何实现“终身成长”",
        "releaseDate": "2020.05.02上新",
        "playCount": "播放量2072.1万",
        "link": "/book/200000126",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "贫穷的本质",
        "description": "运用经济学思维，跳出“贫穷陷阱”",
        "releaseDate": "2020.10.17上新",
        "playCount": "播放量2071.2万",
        "link": "/book/400000074",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "家庭的觉醒",
        "description": "带父母走出恐惧与担忧",
        "releaseDate": "2022.09.10上新",
        "playCount": "播放量2063.9万",
        "link": "/book/400031557",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "穷查理宝典",
        "description": "源于巴菲特导师的智慧箴言录，查理·芒格教你赚钱和做人",
        "releaseDate": "2017.12.23上新",
        "playCount": "播放量2057.6万",
        "link": "/book/565",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "养育男孩",
        "description": "男孩顽皮，不如女孩省心，真的吗？教会你如何养育一个男孩",
        "releaseDate": "2015.11.07上新",
        "playCount": "播放量2044.6万",
        "link": "/book/160",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "成吉思汗与今日世界之形成",
        "description": "走近真实的草原民族，细说心机权谋背后的深情",
        "releaseDate": "2018.10.20上新",
        "playCount": "播放量2042.0万",
        "link": "/book/200000017",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "终结拖延症",
        "description": "如何告别“拖拉机”称号，实现今日事今日毕？权威专家来拯救你了",
        "releaseDate": "2015.09.26上新",
        "playCount": "播放量2034.0万",
        "link": "/book/180",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "王阳明大传（全三册）",
        "description": "“不朽”也需要有人懂，王阳明的传奇人生等你来发现",
        "releaseDate": "2016.01.30上新",
        "playCount": "播放量2030.8万",
        "link": "/book/305",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "弹性",
        "description": "在极速变化的世界中灵活思考的方法",
        "releaseDate": "2020.03.28上新",
        "playCount": "播放量2030.4万",
        "link": "/book/200000114",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "丝绸之路",
        "description": "从人类的过去，到世界的未来，一部全新的世界史",
        "releaseDate": "2017.02.18上新",
        "playCount": "播放量2026.1万",
        "link": "/book/361",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "童年的秘密",
        "description": "想教育出小天使，父母不得不了解孩子童年的秘密",
        "releaseDate": "2016.10.29上新",
        "playCount": "播放量2016.7万",
        "link": "/book/345",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "心的重建",
        "description": "当你觉得自己“再也走不出来了”的时候，你只是需要这本书",
        "releaseDate": "2017.09.30上新",
        "playCount": "播放量2015.7万",
        "link": "/book/547",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "学习的战争：怎样才是最好的学习",
        "description": "除了玩命补习以外，世界上还有这些令你大开眼界的学习方式",
        "releaseDate": "2014.12.19上新",
        "playCount": "播放量2007.2万",
        "link": "/book/144",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "越过内心那座山",
        "description": "告别精神内耗，让心灵重获自由",
        "releaseDate": "2022.11.12上新",
        "playCount": "播放量1989.7万",
        "link": "/book/400035125",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "准备",
        "description": "教育如何真正改变孩子的人生",
        "releaseDate": "2021.02.06上新",
        "playCount": "播放量1986.6万",
        "link": "/book/400001031",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "读懂一本书",
        "description": "樊登多年选书、读书、讲书心得大公开",
        "releaseDate": "2019.10.26上新",
        "playCount": "播放量1969.9万",
        "link": "/book/200000082",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "刘邦",
        "description": "从草根到帝王，还原刘邦的传奇人生",
        "releaseDate": "2021.11.20上新",
        "playCount": "播放量1969.8万",
        "link": "/book/400014439",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "妈妈知道怎么办",
        "description": "孩子哭闹、不爱学习怎么办？这本书助你摆平亲子之间的“鸡飞狗跳”",
        "releaseDate": "2020.05.09上新",
        "playCount": "播放量1969.3万",
        "link": "/book/200000128",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "拿破仑传",
        "description": "凭借知识和激情，一个人能够达到怎样的高度",
        "releaseDate": "2021.05.08上新",
        "playCount": "播放量1965.6万",
        "link": "/book/400001915",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "你为什么不道歉",
        "description": "7招降低对方的心理防御，让嘴硬的人开口道歉",
        "releaseDate": "2019.11.16上新",
        "playCount": "播放量1965.2万",
        "link": "/book/200000085",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "有限与无限的游戏",
        "description": "开启你的无限游戏——你的人生有什么可能性",
        "releaseDate": "2019.05.18上新",
        "playCount": "播放量1934.4万",
        "link": "/book/200000054",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "善战者说：孙子兵法与取胜法则十二讲",
        "description": "《孙子兵法》中隐藏的处世哲学",
        "releaseDate": "2020.11.21上新",
        "playCount": "播放量1932.3万",
        "link": "/book/400000093",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "授权：如何激发全员领导力",
        "description": "助你摆脱工作中管理人或受制于人的窘境",
        "releaseDate": "2020.05.30上新",
        "playCount": "播放量1923.5万",
        "link": "/book/200000133",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "万古江河",
        "description": "一口气听完中国史，一本书塑造身为中国人的文化自信",
        "releaseDate": "2018.08.04上新",
        "playCount": "播放量1922.0万",
        "link": "/book/200000005",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "走出思维泥潭",
        "description": "把你的旧主意，变成新创意",
        "releaseDate": "2021.10.23上新",
        "playCount": "播放量1920.7万",
        "link": "/book/400014248",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "在远远的背后带领",
        "description": "6个角度，揭秘如何与孩子有效沟通",
        "releaseDate": "2020.10.10上新",
        "playCount": "播放量1919.0万",
        "link": "/book/400000065",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人类简史",
        "description": "从动物到上帝，令人耳目一新的人类进化简史",
        "releaseDate": "2016.08.06上新",
        "playCount": "播放量1916.6万",
        "link": "/book/332",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "OKR工作法",
        "description": "教你如何聚焦核心目标、高效推进工作",
        "releaseDate": "2018.03.31上新",
        "playCount": "播放量1911.4万",
        "link": "/book/581",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "爱因斯坦传",
        "description": "最执著的科研精神，最悲悯的人文情怀",
        "releaseDate": "2019.02.02上新",
        "playCount": "播放量1910.2万",
        "link": "/book/200000037",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "情绪急救",
        "description": "主治孤独、自卑、沮丧与各类精神创伤",
        "releaseDate": "2015.12.26上新",
        "playCount": "播放量1909.7万",
        "link": "/book/302",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "怪诞脑科学",
        "description": "教你战胜焦虑、混乱、拖延的自控术",
        "releaseDate": "2020.02.01上新",
        "playCount": "播放量1904.4万",
        "link": "/book/200000101",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "先发影响力",
        "description": "两大武器，七个要点，只教一件事：让别人赞同你和你说的话",
        "releaseDate": "2018.08.25上新",
        "playCount": "播放量1895.7万",
        "link": "/book/200000009",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "正念的奇迹",
        "description": "用禅思小方法，帮你找寻淡定、宁静的人生心境",
        "releaseDate": "2018.04.23上新",
        "playCount": "播放量1890.8万",
        "link": "/book/200000049",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我们终将遇见爱与孤独",
        "description": "樊登对谈张德芬：不跟自己过不去",
        "releaseDate": "2018.02.10上新",
        "playCount": "播放量1889.3万",
        "link": "/book/574",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "瓦尔登湖 | 上",
        "description": "聪明的人生是只过1%的好生活",
        "releaseDate": "2022.04.23上新",
        "playCount": "播放量1885.5万",
        "link": "/book/400016860",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "未来简史",
        "description": "《人类简史》作者全新大作，为我们揭开关于未来的别样可能",
        "releaseDate": "2017.02.04上新",
        "playCount": "播放量1875.2万",
        "link": "/book/358",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "樊登讲论语：先进",
        "description": "应用《论语》，从传统文化中汲取新力量",
        "releaseDate": "2021.03.13上新",
        "playCount": "播放量1872.4万",
        "link": "/book/400001497",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "如何成为更聪明的人",
        "description": "优秀决策者的行动指南",
        "releaseDate": "2022.01.22上新",
        "playCount": "播放量1838.4万",
        "link": "/book/400015779",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "宋徽宗",
        "description": "是性格决定了悲剧，还是悲剧是艺术家的宿命",
        "releaseDate": "2019.09.21上新",
        "playCount": "播放量1832.8万",
        "link": "/book/200000076",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "狼的智慧",
        "description": "狼是最像人类的动物，从狼身上重新审视人类的成长、责任与爱",
        "releaseDate": "2020.08.15上新",
        "playCount": "播放量1825.8万",
        "link": "/book/200000147",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "这才是心理学",
        "description": "一本书，了解心理学的前世今生",
        "releaseDate": "2021.01.16上新",
        "playCount": "播放量1820.4万",
        "link": "/book/400000829",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "赋能",
        "description": "用美军经验打造超级团队",
        "releaseDate": "2018.02.24上新",
        "playCount": "播放量1800.2万",
        "link": "/book/576",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "寻人不遇",
        "description": "青山绿水间不见诗人踪迹，却留存隽永诗魂",
        "releaseDate": "2018.04.07上新",
        "playCount": "播放量1800.1万",
        "link": "/book/583",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "未来学校",
        "description": "8个问题厘清未来教育的趋势",
        "releaseDate": "2020.03.07上新",
        "playCount": "播放量1797.5万",
        "link": "/book/200000111",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "从0到1",
        "description": "解读商业运行脉络，于意想不到之处发现价值与机遇",
        "releaseDate": "2015.03.06上新",
        "playCount": "播放量1778.5万",
        "link": "/book/157",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人是如何学习的",
        "description": "如何有效学习？你要先懂底层逻辑",
        "releaseDate": "2021.11.06上新",
        "playCount": "播放量1773.6万",
        "link": "/book/400014445",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "身心合一的奇迹力量",
        "description": "高手对决时的致胜秘诀：只有停止攻击自己，才能释放潜能",
        "releaseDate": "2017.08.26上新",
        "playCount": "播放量1773.5万",
        "link": "/book/424",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "少即是多",
        "description": "来自北欧的自由生活意见：真正幸福的人都会做减法",
        "releaseDate": "2016.04.30上新",
        "playCount": "播放量1773.3万",
        "link": "/book/319",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "中国文化的精神",
        "description": "在温情中了解中华文化的点点滴滴",
        "releaseDate": "2020.01.25上新",
        "playCount": "播放量1768.0万",
        "link": "/book/200000100",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "写给年轻人的中国智慧",
        "description": "樊登对谈王蒙：哪些中国智慧你一定得了解",
        "releaseDate": "2020.04.04上新",
        "playCount": "播放量1760.1万",
        "link": "/book/200000115",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "向前一步",
        "description": "来自脸书COO的8个建议，帮职场女性突破性别偏见",
        "releaseDate": "2014.04.07上新",
        "playCount": "播放量1753.1万",
        "link": "/book/91",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "给孩子一生的安全感",
        "description": "你若扬帆起航，孩子何惧风浪",
        "releaseDate": "2023.04.15上新",
        "playCount": "播放量1742.1万",
        "link": "/book/400059077",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "跨越式成长",
        "description": "用思维转换重塑你的工作和生活",
        "releaseDate": "2020.10.24上新",
        "playCount": "播放量1735.5万",
        "link": "/book/400000075",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "你的顾客需要一个好故事",
        "description": "品牌想被看见？7步带你抓住顾客的眼球",
        "releaseDate": "2021.04.03上新",
        "playCount": "播放量1729.2万",
        "link": "/book/400001528",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "清单革命",
        "description": "清单是你的认知防护网。你需要清单，更要知道如何利用好清单",
        "releaseDate": "2017.10.28上新",
        "playCount": "播放量1728.3万",
        "link": "/book/552",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1677032409c76e4e2f06b13086e44d19c0b4280987hspb68.mp3?key=31c54e0056b521813323fa9b30d8186d&time=1743070410",
        "uploaded": true
    },
    {
        "title": "心智力",
        "description": "樊登对谈李中莹：人生可以这样过，轻松→满足→成功→快乐",
        "releaseDate": "2019.05.25上新",
        "playCount": "播放量1717.7万",
        "link": "/book/200000055",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "权力:为什么只为某些人所拥有",
        "description": "权力是“争”来的，不是“等”来的",
        "releaseDate": "2017.01.14上新",
        "playCount": "播放量1713.6万",
        "link": "/book/356",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "混乱",
        "description": "拥抱不确定性，成为失控时代的掌控者",
        "releaseDate": "2020.01.11上新",
        "playCount": "播放量1706.6万",
        "link": "/book/200000098",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我会独立思考",
        "description": "5个步骤助孩子爱上独立思考",
        "releaseDate": "2021.07.24上新",
        "playCount": "播放量1704.0万",
        "link": "/book/400005130",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "始皇帝",
        "description": "《大秦赋》中的秦始皇跟真实的他差距有多大",
        "releaseDate": "2021.01.09上新",
        "playCount": "播放量1696.5万",
        "link": "/book/400000834",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "跨越不可能",
        "description": "4大技能助你发挥自我潜能，达成巅峰表现",
        "releaseDate": "2021.12.25上新",
        "playCount": "播放量1694.3万",
        "link": "/book/400015114",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "茑屋经营哲学",
        "description": "开在“无人区”的现象级网红书店",
        "releaseDate": "2019.09.28上新",
        "playCount": "播放量1693.4万",
        "link": "/book/200000078",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "生活的哲学",
        "description": "在12位杰出哲学家的指引下，发现生活之本，遇见人生之美",
        "releaseDate": "2018.02.17上新",
        "playCount": "播放量1685.9万",
        "link": "/book/575",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "高绩效教练",
        "description": "优秀的领导者都有“教练”特质，会培养他人的觉察力、责任感、自信心",
        "releaseDate": "2016.02.27上新",
        "playCount": "播放量1684.1万",
        "link": "/book/100",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "零售的哲学",
        "description": "消费者最需要什么？铃木敏文用40年销售心得告诉你",
        "releaseDate": "2018.09.08上新",
        "playCount": "播放量1683.1万",
        "link": "/book/200000011",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "责任病毒",
        "description": "合作很难？当心你的组织可能感染“责任病毒”",
        "releaseDate": "2019.11.30上新",
        "playCount": "播放量1681.6万",
        "link": "/book/200000087",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "好妈妈胜过好老师",
        "description": "教育专家的16年教子手记，帮助每一个妈妈成为孩子的好老师",
        "releaseDate": "2017.12.16上新",
        "playCount": "播放量1680.8万",
        "link": "/book/563",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "变好的方法",
        "description": "挖掘内心的伤口与黄金，让你的人生无所畏惧",
        "releaseDate": "2024.03.09上新",
        "playCount": "播放量1680.3万",
        "link": "/book/400103839",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "行为设计学：打造峰值体验",
        "description": "生活很乏味？工作没激情？4个大招教你设计人生惊喜时刻",
        "releaseDate": "2019.01.05上新",
        "playCount": "播放量1653.0万",
        "link": "/book/200000033",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人生的底气",
        "description": "21句《孟子》精华，构建底气，迎人生万变",
        "releaseDate": "2023.03.11上新",
        "playCount": "播放量1645.2万",
        "link": "/book/400055511",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "内向孩子的潜在优势",
        "description": "打破外向理想型偏见，发现内向者无可取代的优势",
        "releaseDate": "2018.02.03上新",
        "playCount": "播放量1640.9万",
        "link": "/book/573",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "不被父母控制的人生",
        "description": "如何与原生家庭和解，拥有自主人生",
        "releaseDate": "2021.06.19上新",
        "playCount": "播放量1634.7万",
        "link": "/book/400003351",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "大脑幸福密码",
        "description": "怎样才能更幸福？脑科学给你答案",
        "releaseDate": "2021.07.31上新",
        "playCount": "播放量1633.8万",
        "link": "/book/400005425",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "博弈论与生活",
        "description": "用博弈论走出生活僵局",
        "releaseDate": "2021.06.12上新",
        "playCount": "播放量1629.3万",
        "link": "/book/400003100",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "无处不在的人格",
        "description": "洞悉不完美的人格，照见自己，接纳他人",
        "releaseDate": "2022.05.07上新",
        "playCount": "播放量1627.1万",
        "link": "/book/400017225",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "一生的旅程",
        "description": "迪士尼CEO教你打造超级IP",
        "releaseDate": "2020.07.04上新",
        "playCount": "播放量1573.2万",
        "link": "/book/200000141",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "复杂",
        "description": "让你脑洞大开，学会用复杂思维过简单生活",
        "releaseDate": "2018.12.22上新",
        "playCount": "播放量1572.8万",
        "link": "/book/200000030",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "活出生命的意义",
        "description": "如果你对生活有疑问，这是一本能让你豁然开朗的书",
        "releaseDate": "2015.01.16上新",
        "playCount": "播放量1571.2万",
        "link": "/book/150",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "身体从未忘记",
        "description": "如果你曾受过伤，这本书告诉你，抱着伤口也能过好这一生",
        "releaseDate": "2018.03.10上新",
        "playCount": "播放量1571.2万",
        "link": "/book/578",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "跑步圣经",
        "description": "德国冠军教练无保留经验分享，金牌教程伴你奔跑一生",
        "releaseDate": "2016.08.13上新",
        "playCount": "播放量1562.8万",
        "link": "/book/333",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "纳瓦尔宝典",
        "description": "普通人如何从白手起家，到财富自由？",
        "releaseDate": "2022.06.25上新",
        "playCount": "播放量1560.7万",
        "link": "/book/400017695",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1678962099b32c78463be10597a69c4f7707ff4967nw4yqn.mp3?key=49485fca8afd1b79901ffb82fdd57e27&time=1743070462",
        "uploaded": true
    },
    {
        "title": "认知盈余",
        "description": "开发8小时之外的自由时间，普通人也能改变世界",
        "releaseDate": "2016.12.31上新",
        "playCount": "播放量1556.0万",
        "link": "/book/354",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "杜甫传",
        "description": "看杜甫如何从“落榜生”成长为“诗圣”",
        "releaseDate": "2021.02.27上新",
        "playCount": "播放量1545.0万",
        "link": "/book/400001208",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "让孩子远离焦虑",
        "description": "孩子要在安全环境中成长起来，不要强迫他们面对恐惧",
        "releaseDate": "2015.06.19上新",
        "playCount": "播放量1540.4万",
        "link": "/book/172",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "给孩子的五顶学习帽",
        "description": "5大关键因素，培养孩子自主学习力",
        "releaseDate": "2022.04.30上新",
        "playCount": "播放量1536.5万",
        "link": "/book/400016858",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "拆掉思维里的墙",
        "description": "转变心智模式，与有趣的人生相遇",
        "releaseDate": "2022.05.21上新",
        "playCount": "播放量1530.5万",
        "link": "/book/400017401",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "论大战略",
        "description": "人人看得懂、用得上的战略思维",
        "releaseDate": "2019.12.28上新",
        "playCount": "播放量1527.4万",
        "link": "/book/200000096",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "减法",
        "description": "做加法是本能，做减法是智慧",
        "releaseDate": "2022.03.05上新",
        "playCount": "播放量1525.5万",
        "link": "/book/400016083",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人生海海",
        "description": "继《谍战》封笔多年之后，麦家再出超越之作",
        "releaseDate": "2019.06.22上新",
        "playCount": "播放量1520.0万",
        "link": "/book/200000059",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "爱有8种习惯",
        "description": "8种爱的习惯破解人生重重谜题，帮你重操生活掌控权，消除不安全感",
        "releaseDate": "2016.03.12上新",
        "playCount": "播放量1512.1万",
        "link": "/book/311",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "硅谷超级家长课",
        "description": "五个简单原则，养育成功孩子",
        "releaseDate": "2021.09.04上新",
        "playCount": "播放量1504.1万",
        "link": "/book/400008296",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人体简史",
        "description": "你的身体已经30亿岁了",
        "releaseDate": "2021.01.23上新",
        "playCount": "播放量1493.3万",
        "link": "/book/400000875",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "哲学的慰藉",
        "description": "人生的诸多困惑，可以从这里找答案",
        "releaseDate": "2021.10.09上新",
        "playCount": "播放量1492.2万",
        "link": "/book/400011320",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "理解未来的7个原则",
        "description": "7个原则，让你的未来变得更有把握",
        "releaseDate": "2020.07.11上新",
        "playCount": "播放量1467.1万",
        "link": "/book/200000142",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "儿童自然法则",
        "description": "尊重孩子的天性，做陪伴-引导型父母",
        "releaseDate": "2022.08.20上新",
        "playCount": "播放量1456.5万",
        "link": "/book/400029325",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "聚会：如何打造高效社交网络",
        "description": "摆脱无效社交，为每一次聚会赋能",
        "releaseDate": "2020.07.18上新",
        "playCount": "播放量1452.5万",
        "link": "/book/200000143",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "危机领导力",
        "description": "掌握10大关键策略，让你的团队抗得过危机",
        "releaseDate": "2017.02.11上新",
        "playCount": "播放量1440.2万",
        "link": "/book/360",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "贪婪的多巴胺",
        "description": "快乐源泉vs欲望深渊，揭开人类行为的奥秘",
        "releaseDate": "2022.03.26上新",
        "playCount": "播放量1429.9万",
        "link": "/book/400016851",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "和繁重的工作一起修行",
        "description": "在办公室就可以完成的心灵放松法",
        "releaseDate": "2016.12.17上新",
        "playCount": "播放量1418.6万",
        "link": "/book/353",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人生效率手册",
        "description": "樊登对谈张萌：提高效率，全在此册",
        "releaseDate": "2018.01.20上新",
        "playCount": "播放量1416.8万",
        "link": "/book/571",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人心红利",
        "description": "手把手教你如何算准人心，销量翻倍",
        "releaseDate": "2021.08.14上新",
        "playCount": "播放量1415.5万",
        "link": "/book/400006832",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "解压全书：压力管理",
        "description": "帮你了解压力，管理压力，给人生添点活力",
        "releaseDate": "2015.06.05上新",
        "playCount": "播放量1410.7万",
        "link": "/book/166",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "为什么我的青春期孩子不和我说话？",
        "description": "孩子的青春期是父母的第二个青春期",
        "releaseDate": "2020.12.19上新",
        "playCount": "播放量1399.9万",
        "link": "/book/400000566",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "高效演讲",
        "description": "斯坦福教授20余年演讲培训经验，帮你摆脱当众讲话的恐惧",
        "releaseDate": "2013.11.02上新",
        "playCount": "播放量1395.1万",
        "link": "/book/22",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "中国文化课",
        "description": "樊登对谈余秋雨：我们的文化底气来自哪儿",
        "releaseDate": "2019.10.05上新",
        "playCount": "播放量1386.8万",
        "link": "/book/200000079",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "欧阳修传",
        "description": "欧阳修如何实现人生的逆风翻盘",
        "releaseDate": "2020.08.01上新",
        "playCount": "播放量1376.7万",
        "link": "/book/200000145",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "为未知而教，为未来而学",
        "description": "传统教育存在哪些致命问题？什么才是真正值得学的？本书给你答案",
        "releaseDate": "2017.08.12上新",
        "playCount": "播放量1376.2万",
        "link": "/book/386",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1676452686809aabaf914a49ab73a9e4c431cc11ed4gxcuq.mp3?key=cb0ec721157d2dc49ac67ad7cdda0efa&time=1743070516",
        "uploaded": true
    },
    {
        "title": "欲望的博弈",
        "description": "跳出欲望陷阱，活好人生每一刻",
        "releaseDate": "2022.08.06上新",
        "playCount": "播放量1354.5万",
        "link": "/book/400024537",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "百岁人生",
        "description": "长寿时代的人生规划参考书",
        "releaseDate": "2020.05.16上新",
        "playCount": "播放量1353.5万",
        "link": "/book/200000131",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "忙碌爸爸也能做好爸爸",
        "description": "“好爸爸养成计划”——再忙也能做好爸爸",
        "releaseDate": "2016.04.09上新",
        "playCount": "播放量1342.3万",
        "link": "/book/315",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "新家庭如何塑造人",
        "description": "和谐夫妻，快乐孩子，家庭实用相处指南",
        "releaseDate": "2022.02.12上新",
        "playCount": "播放量1340.2万",
        "link": "/book/400015906",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "不拘一格",
        "description": "揭秘网飞成功背后的三大逻辑",
        "releaseDate": "2021.01.02上新",
        "playCount": "播放量1324.5万",
        "link": "/book/400000721",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "增长黑客",
        "description": "如何实现低成本爆发式增长？先找到你的北极星",
        "releaseDate": "2018.04.14上新",
        "playCount": "播放量1322.4万",
        "link": "/book/584",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "这不是你的错",
        "description": "放过原生家庭，也就放过了自己",
        "releaseDate": "2018.01.13上新",
        "playCount": "播放量1320.3万",
        "link": "/book/570",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "钝感力",
        "description": "不为小事动摇，才能成为大事的赢家",
        "releaseDate": "2015.02.12上新",
        "playCount": "播放量1319.1万",
        "link": "/book/155",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "第二曲线创新",
        "description": "12种创新思维模型，刹住你的思维惯性",
        "releaseDate": "2019.11.02上新",
        "playCount": "播放量1313.4万",
        "link": "/book/200000083",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "好奇心",
        "description": "7个方法让你保持永不停息的好奇心",
        "releaseDate": "2018.09.29上新",
        "playCount": "播放量1312.0万",
        "link": "/book/200000014",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "生命摆渡人",
        "description": "樊登对谈抗疫英雄汪勇：守护生命，穿越生死线",
        "releaseDate": "2020.11.04上新",
        "playCount": "播放量1309.3万",
        "link": "/book/400000084",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "中国儒学三千年",
        "description": "俯瞰3000年儒学史，读懂中华文明之根",
        "releaseDate": "2022.05.28上新",
        "playCount": "播放量1303.1万",
        "link": "/book/400017505",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "让大象飞",
        "description": "激进创新，让你一飞冲天的创业术",
        "releaseDate": "2017.05.13上新",
        "playCount": "播放量1298.0万",
        "link": "/book/373",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "这书能让你戒烟",
        "description": "一个有33年烟龄，一天100支烟的人发现，戒烟也没有那么难",
        "releaseDate": "2016.05.27上新",
        "playCount": "播放量1296.6万",
        "link": "/book/135",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "减压脑科学",
        "description": "和压力较劲，不如和压力做朋友",
        "releaseDate": "2022.01.01上新",
        "playCount": "播放量1295.9万",
        "link": "/book/400015343",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "万物皆数",
        "description": "从今天起，发现，求知，证明，做一个热爱数学、认真生活的人",
        "releaseDate": "2019.06.29上新",
        "playCount": "播放量1295.2万",
        "link": "/book/200000060",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "原生母爱",
        "description": "因为了解你，所以更爱你",
        "releaseDate": "2022.06.04上新",
        "playCount": "播放量1295.2万",
        "link": "/book/400017564",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "好的教育",
        "description": "回归传统经典，看孔子怎样做教育",
        "releaseDate": "2022.03.19上新",
        "playCount": "播放量1288.0万",
        "link": "/book/400016814",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "巴菲特之道",
        "description": "将巴菲特思想引进中国的第一本书",
        "releaseDate": "2015.05.01上新",
        "playCount": "播放量1285.4万",
        "link": "/book/165",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "商战",
        "description": "“定位之父”教你打赢商战",
        "releaseDate": "2018.06.23上新",
        "playCount": "播放量1280.1万",
        "link": "/book/594",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "哲学起步",
        "description": "樊登对谈邓晓芒：活得怎么样，关键要弄懂这3个问题",
        "releaseDate": "2019.12.21上新",
        "playCount": "播放量1277.0万",
        "link": "/book/200000090",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "穿越寒冬",
        "description": "经济寒冬之下，如何打造商业独角兽",
        "releaseDate": "2020.12.05上新",
        "playCount": "播放量1267.1万",
        "link": "/book/400000348",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "遇见莫扎特",
        "description": "看莫扎特如何震撼人类音乐史",
        "releaseDate": "2019.12.07上新",
        "playCount": "播放量1266.1万",
        "link": "/book/200000088",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "放弃的艺术",
        "description": "别在一件事上钻牛角尖，放弃错的事，才能开启对的事",
        "releaseDate": "2016.10.01上新",
        "playCount": "播放量1265.0万",
        "link": "/book/341",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "一念之差",
        "description": "生活充满未知的风险，带你选择更健康、安全的生活方式",
        "releaseDate": "2017.12.30上新",
        "playCount": "播放量1262.2万",
        "link": "/book/567",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/167635872361b8f6fd1b58d50bb697c7575c7243b4wnawzf.mp3?key=707f9e80956e0b80563ab2b8c09a507f&time=1743070567",
        "uploaded": true
    },
    {
        "title": "传染",
        "description": "从众、特立独行、流行事物……我们的选择如何被他人左右",
        "releaseDate": "2018.11.24上新",
        "playCount": "播放量1261.4万",
        "link": "/book/200000022",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "透过佛法看世界",
        "description": "180个问题，解答你的人生困惑",
        "releaseDate": "2015.04.03上新",
        "playCount": "播放量1260.9万",
        "link": "/book/161",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "商业的本质",
        "description": "致敬工业时代，回归商业本质",
        "releaseDate": "2016.05.21上新",
        "playCount": "播放量1252.8万",
        "link": "/book/321",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "深奥的简洁",
        "description": "每个人都该学会用简单逻辑理解复杂世界",
        "releaseDate": "2020.06.06上新",
        "playCount": "播放量1251.4万",
        "link": "/book/200000134",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "郭德纲讲三国",
        "description": "笑谈三国风云，看透世情人心",
        "releaseDate": "2022.06.18上新",
        "playCount": "播放量1248.9万",
        "link": "/book/400017631",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "南京传",
        "description": "叶兆言四十载写作之大成，看南京人眼中的南京往事",
        "releaseDate": "2020.03.21上新",
        "playCount": "播放量1240.8万",
        "link": "/book/200000113",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "汉武帝和他的时代",
        "description": "樊登对谈姜鹏：还原一个真实的汉武帝",
        "releaseDate": "2020.12.26上新",
        "playCount": "播放量1240.3万",
        "link": "/book/400000570",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "国史讲话：春秋",
        "description": "顾颉刚讲春秋：中华文明是如何形成的，国人必读",
        "releaseDate": "2017.03.25上新",
        "playCount": "播放量1233.6万",
        "link": "/book/366",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "与哲学家谈快乐",
        "description": "让哲学告诉你，快乐的奥秘是什么",
        "releaseDate": "2022.03.12上新",
        "playCount": "播放量1226.9万",
        "link": "/book/400016394",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "疯传",
        "description": "本书助你把产品、思想、行为设计成具有感染力和传播力的内容",
        "releaseDate": "2015.11.13上新",
        "playCount": "播放量1225.6万",
        "link": "/book/148",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "终身学习：哈佛毕业后的六堂课",
        "description": "樊登对谈黄征宇：斯坦福和哈佛都学不到的“人生必修课”",
        "releaseDate": "2018.06.16上新",
        "playCount": "播放量1222.9万",
        "link": "/book/592",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "5%的改变",
        "description": "用最小行动按钮，打开生活新状态",
        "releaseDate": "2022.12.31上新",
        "playCount": "播放量1222.5万",
        "link": "/book/400042332",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我的经济学思维课",
        "description": "衣食住行里的经济学，带你换个角度看世界",
        "releaseDate": "2021.09.18上新",
        "playCount": "播放量1222.1万",
        "link": "/book/400010727",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "寻找健康",
        "description": "一个40多岁的中年男人追求健康的历程",
        "releaseDate": "2017.03.04上新",
        "playCount": "播放量1220.4万",
        "link": "/book/363",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "自造",
        "description": "一路向光而行，自造幸福人生",
        "releaseDate": "2022.07.30上新",
        "playCount": "播放量1214.5万",
        "link": "/book/400022087",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "帝国的崩裂：细说五代十国史",
        "description": "读懂五代十国，才真正读懂古代历史",
        "releaseDate": "2021.12.18上新",
        "playCount": "播放量1210.3万",
        "link": "/book/400015088",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "你好，焦虑分子！",
        "description": "走出情绪内耗，与焦虑化敌为友",
        "releaseDate": "2022.06.11上新",
        "playCount": "播放量1206.7万",
        "link": "/book/400017598",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "宋仁宗：共治时代",
        "description": "平庸之主如何成为千古仁君",
        "releaseDate": "2021.09.25上新",
        "playCount": "播放量1205.3万",
        "link": "/book/400011016",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "古希腊文明的光芒",
        "description": "带你重新认识古希腊众神与哲人",
        "releaseDate": "2021.01.30上新",
        "playCount": "播放量1202.0万",
        "link": "/book/400000994",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "常识工作法",
        "description": "减少“常识性”错误，让工作更高效",
        "releaseDate": "2022.04.09上新",
        "playCount": "播放量1198.2万",
        "link": "/book/400016857",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "匠人精神",
        "description": "人要淬炼心性，唤醒体内的一流精神，才能达到一流的水平",
        "releaseDate": "2016.11.12上新",
        "playCount": "播放量1197.3万",
        "link": "/book/347",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "心力",
        "description": "邓亚萍教你人生制胜秘诀",
        "releaseDate": "2021.11.13上新",
        "playCount": "播放量1181.0万",
        "link": "/book/400014555",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "母爱的羁绊",
        "description": "爱来自父母的同时可能也会夹带一些伤害，别让自恋型母爱毁了你的孩子",
        "releaseDate": "2016.02.20上新",
        "playCount": "播放量1178.3万",
        "link": "/book/309",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "美国四百年",
        "description": "经济视角看历史，读懂美国另类四百年",
        "releaseDate": "2022.07.16上新",
        "playCount": "播放量1174.4万",
        "link": "/book/400021220",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "孔子：人能弘道",
        "description": "带你领略孔子的魅力",
        "releaseDate": "2014.01.21上新",
        "playCount": "播放量1173.1万",
        "link": "/book/65",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503271816/01751dd7d207fd90b74eb1e28fc6c6e7/media/audio/15828616273451db8d20fc836b0f1857ebfeb92339ac9qqt.mp3",
        "uploaded": true
    },
    {
        "title": "火种：寻找中国复兴之路",
        "description": "再现一段荡气回肠的建党历史",
        "releaseDate": "2021.05.29上新",
        "playCount": "播放量1168.1万",
        "link": "/book/400002562",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1679053859483fedc2157037719fe41744d1586d70t64wte.mp3?key=1fd3827115f9be85cdb1abce94250777&time=1743070620",
        "uploaded": true
    },
    {
        "title": "哈佛商学院最受欢迎的领导课",
        "description": "哈佛大佬手把手教你提高领导力",
        "releaseDate": "2016.01.09上新",
        "playCount": "播放量1166.5万",
        "link": "/book/21",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "焦虑自救手册",
        "description": "专注当下，拥抱变化，克服焦虑并不难",
        "releaseDate": "2022.10.22上新",
        "playCount": "播放量1160.8万",
        "link": "/book/400032962",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "正见：佛陀的证悟",
        "description": "解读四大“正见”，阐释佛教智慧",
        "releaseDate": "2016.05.14上新",
        "playCount": "播放量1157.5万",
        "link": "/book/108",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "十分钟冥想",
        "description": "每天十分钟，让心回家",
        "releaseDate": "2023.09.16上新",
        "playCount": "播放量1151.9万",
        "link": "/book/400076146",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "可复制的领导力2",
        "description": "出色领导力，让企业自己“长”出来",
        "releaseDate": "2022.05.14上新",
        "playCount": "播放量1146.2万",
        "link": "/book/400017220",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "每个人的战争",
        "description": "一本有充分科学研究支撑和亲身体验的防癌抗癌指南",
        "releaseDate": "2018.05.19上新",
        "playCount": "播放量1139.1万",
        "link": "/book/589",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "乡土中国",
        "description": "中国社会学奠基人费孝通经典之作",
        "releaseDate": "2020.06.13上新",
        "playCount": "播放量1138.8万",
        "link": "/book/200000135",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "社会性动物",
        "description": "我为何这样做？揭秘非理性行为的核心动机",
        "releaseDate": "2022.04.16上新",
        "playCount": "播放量1136.0万",
        "link": "/book/400016859",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "故事经济学",
        "description": "最会讲故事的人，教你设计大家喜闻乐见的故事",
        "releaseDate": "2018.09.01上新",
        "playCount": "播放量1133.5万",
        "link": "/book/200000010",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "心理医生为什么没有告诉我",
        "description": "中国有57%的人处于焦虑状态，你不是一个人在焦虑",
        "releaseDate": "2017.05.06上新",
        "playCount": "播放量1122.7万",
        "link": "/book/372",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "袁隆平的世界",
        "description": "让世界不再饥饿，袁隆平简朴传奇的一生",
        "releaseDate": "2021.07.17上新",
        "playCount": "播放量1120.7万",
        "link": "/book/400004937",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1678794560d4ad5723d2b8fd9d92111d1322ee9deefg6skh.mp3?key=93e6fbcd038794d60e8b4da964221a48&time=1743070643",
        "uploaded": true
    },
    {
        "title": "东京传",
        "description": "认识日本，从读懂东京开始",
        "releaseDate": "2021.08.07上新",
        "playCount": "播放量1117.1万",
        "link": "/book/400006349",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "悉达多",
        "description": "诺奖得主赫尔曼·黑塞的心灵平静之书",
        "releaseDate": "2022.10.08上新",
        "playCount": "播放量1113.2万",
        "link": "/book/400033419",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "以色列：一个民族的重生",
        "description": "看一个饱经战乱的民族如何走上复兴之路",
        "releaseDate": "2020.10.31上新",
        "playCount": "播放量1104.5万",
        "link": "/book/400000083",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "关键期关键帮助",
        "description": "孩子只有一次成长的机会，如何把握孩子0-7岁的关键期",
        "releaseDate": "2017.07.15上新",
        "playCount": "播放量1101.6万",
        "link": "/book/382",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "当良知沉睡",
        "description": "认出身边的恶魔，远离背叛与伤害，是爱自己的第一步",
        "releaseDate": "2017.07.08上新",
        "playCount": "播放量1095.1万",
        "link": "/book/381",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "机械宇宙",
        "description": "看17世纪科学家如何带人类从愚昧走向科学",
        "releaseDate": "2019.07.06上新",
        "playCount": "播放量1093.2万",
        "link": "/book/200000061",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "光环效应",
        "description": "从职场到生活，别被“成功”迷了眼",
        "releaseDate": "2021.07.03上新",
        "playCount": "播放量1090.4万",
        "link": "/book/400004116",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我们为什么还没有死掉？",
        "description": "免疫系统是如何让我们活下来，又给我们带来麻烦的",
        "releaseDate": "2020.03.14上新",
        "playCount": "播放量1089.5万",
        "link": "/book/200000112",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "关键冲突",
        "description": "在冲突爆发前，巧妙化其为无形，让你在社会交往中无往不利",
        "releaseDate": "2017.04.29上新",
        "playCount": "播放量1087.4万",
        "link": "/book/371",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "存在主义心理学的邀请",
        "description": "深度幸福就是活在此时此刻",
        "releaseDate": "2022.09.03上新",
        "playCount": "播放量1086.3万",
        "link": "/book/400031449",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "商业至简",
        "description": "大道至简，打好商业基本功",
        "releaseDate": "2022.10.01上新",
        "playCount": "播放量1076.9万",
        "link": "/book/400033410",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "翻转式学习",
        "description": "突破传统教育的弊病，让孩子找回学习的激情",
        "releaseDate": "2016.06.10上新",
        "playCount": "播放量1073.6万",
        "link": "/book/141",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "作文六要",
        "description": "唤醒你的写作天赋",
        "releaseDate": "2022.02.19上新",
        "playCount": "播放量1072.6万",
        "link": "/book/400015992",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "中国八大诗人",
        "description": "走近屈原、陶渊明、李白、杜甫、白居易、苏东坡、陆游和王渔洋",
        "releaseDate": "2017.03.11上新",
        "playCount": "播放量1071.0万",
        "link": "/book/364",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "为什么越无知的人越自信？",
        "description": "认识你自己，每个人一生的必修课",
        "releaseDate": "2023.02.18上新",
        "playCount": "播放量1070.0万",
        "link": "/book/400053313",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "李白",
        "description": "寻路长安三万里，李白的诗意与失意",
        "releaseDate": "2023.08.19上新",
        "playCount": "播放量1049.9万",
        "link": "/book/400072319",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "崇祯传",
        "description": "还原崇祯极富争议的一生",
        "releaseDate": "2022.01.15上新",
        "playCount": "播放量1046.6万",
        "link": "/book/400015711",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "中年觉醒",
        "description": "发现人生下半场的幸福",
        "releaseDate": "2024.08.17上新",
        "playCount": "播放量1039.7万",
        "link": "/book/400113889",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "天生有罪",
        "description": "爆笑+催泪！脱口秀主持人崔娃首部个人回忆录",
        "releaseDate": "2020.11.14上新",
        "playCount": "播放量1036.4万",
        "link": "/book/400000085",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "上瘾",
        "description": "让用户对你的产品上瘾的设计秘诀",
        "releaseDate": "2017.09.02上新",
        "playCount": "播放量1035.8万",
        "link": "/book/475",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/167703376492d5f67dd5387e2e77f0606c8336e916d5rq9w.mp3?key=4071e936c0e8b27009eec8e7cbc0f0ae&time=1743070684",
        "uploaded": true
    },
    {
        "title": "魏晋风华",
        "description": "一幅魏晋人物长卷，狂狷邪魅、天真烂漫总有一款适合你",
        "releaseDate": "2017.07.22上新",
        "playCount": "播放量1034.8万",
        "link": "/book/383",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "你的生存本能正在杀死你",
        "description": "焦虑来自原始的生存本能，时代变了，要掌控大脑，善待自己",
        "releaseDate": "2016.09.03上新",
        "playCount": "播放量1031.8万",
        "link": "/book/337",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我有点儿胆怯，但想和你好好说话",
        "description": "用言语治愈彼此，让爱在沟通中流动",
        "releaseDate": "2023.06.03上新",
        "playCount": "播放量1031.5万",
        "link": "/book/400068224",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "搞定",
        "description": "不被事情追着跑，搞定你的工作困扰",
        "releaseDate": "2015.04.17上新",
        "playCount": "播放量1018.7万",
        "link": "/book/163",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我们与生俱来的七情",
        "description": "将情绪转化为积极力量",
        "releaseDate": "2023.01.14上新",
        "playCount": "播放量1014.9万",
        "link": "/book/400045909",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "终结阿尔茨海默病",
        "description": "已帮助200余位患者实现可见逆转的个性化治疗方案",
        "releaseDate": "2019.09.14上新",
        "playCount": "播放量1012.3万",
        "link": "/book/200000074",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "游戏改变世界",
        "description": "未来的商业模式，可能都和游戏有关",
        "releaseDate": "2014.03.31上新",
        "playCount": "播放量1010.5万",
        "link": "/book/84",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "不抢跑也能超越",
        "description": "让孩子像爱玩那样爱学习",
        "releaseDate": "2022.10.29上新",
        "playCount": "播放量1009.6万",
        "link": "/book/400035006",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "浪漫之魂",
        "description": "走近卢梭的荆棘人生",
        "releaseDate": "2021.12.11上新",
        "playCount": "播放量1005.3万",
        "link": "/book/400014977",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "中国哲学简史（上）",
        "description": "畅销全球半世纪的中国哲学入门书",
        "releaseDate": "2017.05.27上新",
        "playCount": "播放量1004.1万",
        "link": "/book/375",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "万历传",
        "description": "20多年不上朝，万历真的是昏君吗？",
        "releaseDate": "2022.08.27上新",
        "playCount": "播放量1001.5万",
        "link": "/book/400031409",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "悲剧的诞生",
        "description": "周国平翻译并导读，领略悲欢离合之上的生活美学",
        "releaseDate": "2019.08.24上新",
        "playCount": "播放量990.2万",
        "link": "/book/200000068",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "轻松主义",
        "description": "拒绝内卷，成功之路本可以更轻松",
        "releaseDate": "2024.11.09上新",
        "playCount": "播放量984.9万",
        "link": "/book/400122524",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "八堂自然课",
        "description": "自然教我们的幸福之道",
        "releaseDate": "2022.07.02上新",
        "playCount": "播放量975.3万",
        "link": "/book/400017862",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人生总会有答案",
        "description": "人生许多事，做了才明白",
        "releaseDate": "2024.04.20上新",
        "playCount": "播放量970.4万",
        "link": "/book/400100810",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人性中的善良天使（全二册）",
        "description": "回顾人类千年的暴力史，告诉你暴力为何日渐减少",
        "releaseDate": "2016.04.15上新",
        "playCount": "播放量967.9万",
        "link": "/book/316",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "隐形冠军",
        "description": "看百年企业如何做小事，成大事",
        "releaseDate": "2021.11.27上新",
        "playCount": "播放量964.4万",
        "link": "/book/400014774",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "思想实验",
        "description": "遇到难题时，那些牛人们都是怎么想的",
        "releaseDate": "2020.10.03上新",
        "playCount": "播放量960.7万",
        "link": "/book/400000055",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "禅的行囊",
        "description": "《寻人不遇》作者比尔·波特又一力作，将禅宗发展的脉络娓娓道来",
        "releaseDate": "2018.05.05上新",
        "playCount": "播放量958.7万",
        "link": "/book/587",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "跃迁：成为高手的技术",
        "description": "方法不对，怎么努力都白费。想要成为高手，你需要明白这些",
        "releaseDate": "2017.10.21上新",
        "playCount": "播放量955.1万",
        "link": "/book/550",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "王立群读《史记》之文景之治",
        "description": "揭秘古代中国第一个盛世背后的故事",
        "releaseDate": "2020.08.22上新",
        "playCount": "播放量952.5万",
        "link": "/book/200000148",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "起源：万物大历史",
        "description": "比尔·盖茨力荐：终身学习者一定会喜欢这部万物大历史",
        "releaseDate": "2022.08.13上新",
        "playCount": "播放量947.0万",
        "link": "/book/400024538",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "升维：不确定时代的决策博弈",
        "description": "不确定时代下，如何成为决策高手？",
        "releaseDate": "2022.09.24上新",
        "playCount": "播放量946.2万",
        "link": "/book/400032926",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "父母的羁绊",
        "description": "把原谅换成爱，才是家庭变好的开始",
        "releaseDate": "2022.11.05上新",
        "playCount": "播放量941.0万",
        "link": "/book/400035079",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "好的经济学",
        "description": "是什么在影响你的工资和就业",
        "releaseDate": "2020.08.29上新",
        "playCount": "播放量937.5万",
        "link": "/book/200000149",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "轻疗愈",
        "description": "@压力值爆棚的你，你有一份“1分钟身心疗愈法”，请注意查收",
        "releaseDate": "2016.04.01上新",
        "playCount": "播放量937.1万",
        "link": "/book/314",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "《山海经》的世界",
        "description": "纳尽上古山川万物，这次真正读懂《山海经》",
        "releaseDate": "2023.01.21上新",
        "playCount": "播放量933.7万",
        "link": "/book/400047302",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "精益创业",
        "description": "风靡全球的创业思潮，李开复作序推荐",
        "releaseDate": "2017.06.24上新",
        "playCount": "播放量932.6万",
        "link": "/book/379",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "心学的诞生",
        "description": "王阳明的行路与心路",
        "releaseDate": "2023.06.24上新",
        "playCount": "播放量924.5万",
        "link": "/book/400069651",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "细节营销",
        "description": "为你揭开细节营销中的16个大智慧",
        "releaseDate": "2014.04.13上新",
        "playCount": "播放量921.6万",
        "link": "/book/92",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "宽恕",
        "description": "当你把悲痛和怨恨留在身后时，你就能卸下重担迈向真正的自由",
        "releaseDate": "2016.09.17上新",
        "playCount": "播放量919.2万",
        "link": "/book/339",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "老子、孔子、墨子及其学派",
        "description": "走近梁启超先生笔下的诸子百家，没想到他们都是各种“老可爱”",
        "releaseDate": "2018.06.30上新",
        "playCount": "播放量915.3万",
        "link": "/book/595",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "减压生活",
        "description": "给神经系统“松松绑”，由内而外，击退压力",
        "releaseDate": "2023.02.25上新",
        "playCount": "播放量915.3万",
        "link": "/book/400053836",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "癌症密码",
        "description": "认识癌症，科学养生",
        "releaseDate": "2023.04.08上新",
        "playCount": "播放量911.0万",
        "link": "/book/400057946",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "中国人的人文精神",
        "description": "中华人文之线，串起千年璀璨文明",
        "releaseDate": "2022.02.05上新",
        "playCount": "播放量909.6万",
        "link": "/book/400015880",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "全球上瘾：咖啡如何搅动人类历史",
        "description": "从也门到巴西，带你漫游「咖啡文化旅程地图」",
        "releaseDate": "2021.02.13上新",
        "playCount": "播放量908.4万",
        "link": "/book/400001045",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "树木与房子",
        "description": "解密木构建筑的前世今生",
        "releaseDate": "2020.02.22上新",
        "playCount": "播放量900.2万",
        "link": "/book/200000104",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "AI·未来",
        "description": "樊登对谈李开复：解析人工智能时代未来十年大趋势",
        "releaseDate": "2019.02.09上新",
        "playCount": "播放量892.0万",
        "link": "/book/200000038",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "巴黎：现代城市的发明",
        "description": "从小镇到世界级都市，看巴黎如何华丽转型",
        "releaseDate": "2021.03.27上新",
        "playCount": "播放量886.9万",
        "link": "/book/400001560",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "四时之诗",
        "description": "樊登对谈蒙曼：从五万余首唐诗中汲取精华，领略诗的四季物候之美",
        "releaseDate": "2018.08.18上新",
        "playCount": "播放量885.4万",
        "link": "/book/200000008",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "大流感——最致命瘟疫的史诗",
        "description": "一部人与疾病斗争的不朽传奇",
        "releaseDate": "2020.04.25上新",
        "playCount": "播放量885.0万",
        "link": "/book/200000123",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "恰如其分的孤独",
        "description": "丰盈自我的内心，活出孤独的勇气",
        "releaseDate": "2023.12.16上新",
        "playCount": "播放量883.4万",
        "link": "/book/400092174",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "瓦尔登湖 | 下",
        "description": "智慧的活法：物质至简，内心丰盈",
        "releaseDate": "2022.04.23上新",
        "playCount": "播放量883.4万",
        "link": "/book/400017193",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "创新者的窘境",
        "description": "如何在创新的路上少跌跟头，少犯错",
        "releaseDate": "2017.11.04上新",
        "playCount": "播放量880.4万",
        "link": "/book/553",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "茶的真实历史",
        "description": "一片来自东方的树叶，如何征服全球味蕾？",
        "releaseDate": "2022.12.17上新",
        "playCount": "播放量879.3万",
        "link": "/book/400038715",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "西南联大求学日记",
        "description": "一生只做热爱的事，走近许渊冲的百岁人生",
        "releaseDate": "2021.06.26上新",
        "playCount": "播放量879.0万",
        "link": "/book/400003744",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "森林帝国",
        "description": "樊登对谈阎崇年：惊心动魄的三千年历史变局",
        "releaseDate": "2020.06.27上新",
        "playCount": "播放量873.9万",
        "link": "/book/200000137",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "反时间管理",
        "description": "学会时间翻转，享受自由人生",
        "releaseDate": "2023.10.21上新",
        "playCount": "播放量873.0万",
        "link": "/book/400076842",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "技术与文明",
        "description": "11个历史大事件，看技术如何改变我们的命运",
        "releaseDate": "2021.05.01上新",
        "playCount": "播放量868.0万",
        "link": "/book/400001918",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "观念的跃升",
        "description": "20万年人类思想史，看思想如何改变世界",
        "releaseDate": "2023.05.13上新",
        "playCount": "播放量866.9万",
        "link": "/book/400064552",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我们如何走到今天",
        "description": "从6项技术创新看文明出人意料的变迁",
        "releaseDate": "2018.06.02上新",
        "playCount": "播放量862.0万",
        "link": "/book/591",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "大学的终结",
        "description": "你的孩子将来要上大学吗？上什么样的大学",
        "releaseDate": "2019.01.26上新",
        "playCount": "播放量860.8万",
        "link": "/book/200000036",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "微积分的力量",
        "description": "被名字耽误的趣味科普，数学原来如此简单",
        "releaseDate": "2021.08.28上新",
        "playCount": "播放量851.2万",
        "link": "/book/400007872",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "有毒",
        "description": "带你探秘有毒动物的神奇世界",
        "releaseDate": "2021.12.04上新",
        "playCount": "播放量849.9万",
        "link": "/book/400014829",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "在世界上找到你的位置",
        "description": "九大成年法则，助你独当一面",
        "releaseDate": "2024.02.10上新",
        "playCount": "播放量843.3万",
        "link": "/book/400096755",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我战胜了抑郁症",
        "description": "9位重度抑郁症患者的康复实录，9次自我拯救的重生之旅",
        "releaseDate": "2016.08.20上新",
        "playCount": "播放量840.0万",
        "link": "/book/334",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "好好恋爱",
        "description": "走出单身陷阱，谈一场双向奔赴的恋爱",
        "releaseDate": "2023.06.17上新",
        "playCount": "播放量839.2万",
        "link": "/book/400068906",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "经营幸福的家",
        "description": "让自己和家人都幸福的相处之道",
        "releaseDate": "2024.11.02上新",
        "playCount": "播放量837.0万",
        "link": "/book/400122082",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "投资的常识",
        "description": "华尔街大师给你的低风险投资指南",
        "releaseDate": "2023.01.07上新",
        "playCount": "播放量836.0万",
        "link": "/book/400044749",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "空谷幽兰",
        "description": "当代陶渊明，精神上的唐朝人，揭秘21世纪的中国隐士",
        "releaseDate": "2019.09.11上新",
        "playCount": "播放量835.3万",
        "link": "/book/200000073",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "硅谷钢铁侠",
        "description": "解密埃隆·马斯克的冒险人生，看他如何一次次惊艳科技世界",
        "releaseDate": "2017.04.22上新",
        "playCount": "播放量816.9万",
        "link": "/book/370",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "谁说商业直觉是天生的",
        "description": "利用“共情”，培养你精准的商业直觉",
        "releaseDate": "2016.01.23上新",
        "playCount": "播放量814.3万",
        "link": "/book/173",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "精神问题有什么可笑的",
        "description": "与世界搏斗前，先与脑袋里的“怪兽”和解",
        "releaseDate": "2015.06.12上新",
        "playCount": "播放量813.8万",
        "link": "/book/171",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "超级大脑在想啥？漫画病菌、人类与历史",
        "description": "樊登对谈张文宏：科学认识传染病",
        "releaseDate": "2021.02.20上新",
        "playCount": "播放量811.2万",
        "link": "/book/400001172",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "修复玻璃心",
        "description": "学会与世界自在相处",
        "releaseDate": "2023.11.18上新",
        "playCount": "播放量808.0万",
        "link": "/book/400082102",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "气候经济与人类未来",
        "description": "气候灾难离我们还远吗？比尔·盖茨这么说",
        "releaseDate": "2021.06.05上新",
        "playCount": "播放量807.6万",
        "link": "/book/400002877",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "知识大迁移",
        "description": "如何成为信息爆炸时代的真赢家",
        "releaseDate": "2018.07.28上新",
        "playCount": "播放量806.9万",
        "link": "/book/200000004",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我的前半生",
        "description": "从皇帝到公民，清朝末帝溥仪传奇一生",
        "releaseDate": "2023.02.11上新",
        "playCount": "播放量802.6万",
        "link": "/book/400052800",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "深度关系",
        "description": "看清全能自恋，建立深度关系",
        "releaseDate": "2024.07.06上新",
        "playCount": "播放量801.2万",
        "link": "/book/400095396",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "成长的觉醒",
        "description": "陪伴孩子终身成长的宝贵一课",
        "releaseDate": "2025.01.04上新",
        "playCount": "播放量795.0万",
        "link": "/book/400127299",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "大国大城",
        "description": "抓住城市发展机遇，读懂大国经济时与势",
        "releaseDate": "2022.10.15上新",
        "playCount": "播放量791.2万",
        "link": "/book/400034635",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "本质",
        "description": "樊登对谈刘东华：40位传奇企业家，和你谈一谈直击本质的诀窍",
        "releaseDate": "2018.12.26上新",
        "playCount": "播放量784.7万",
        "link": "/book/200000031",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "谣言",
        "description": "用科学方法解密谣言的诞生、传播、沉寂和复出",
        "releaseDate": "2018.12.29上新",
        "playCount": "播放量780.2万",
        "link": "/book/200000032",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "韧性",
        "description": "转动“韧性飞轮”，积累小赢，成就大胜",
        "releaseDate": "2023.03.18上新",
        "playCount": "播放量779.5万",
        "link": "/book/400057483",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "指数型组织",
        "description": "打造独角兽公司的11个最强属性",
        "releaseDate": "2017.02.25上新",
        "playCount": "播放量778.9万",
        "link": "/book/362",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503271820/49470085ec38720e842d2f9ed9f3f979/media/audio/1676620306972e4960b3f95647d4a6df4afdcab973i2w7uu.mp3",
        "uploaded": true
    },
    {
        "title": "走出强迫症",
        "description": "是习惯还是疾病？带你科学认识强迫症",
        "releaseDate": "2022.07.23上新",
        "playCount": "播放量774.6万",
        "link": "/book/400022072",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "演讲的力量",
        "description": "指导过上千场演讲的TED掌门人，如今亲自传授公开演讲的秘诀",
        "releaseDate": "2016.07.23上新",
        "playCount": "播放量770.3万",
        "link": "/book/330",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人工智能时代",
        "description": "人机共生下财富、工作与思维的大未来",
        "releaseDate": "2017.04.01上新",
        "playCount": "播放量769.4万",
        "link": "/book/367",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "生命密码：你的第一本基因科普书",
        "description": "基因科学如何影响人类未来？",
        "releaseDate": "2022.11.19上新",
        "playCount": "播放量764.7万",
        "link": "/book/400036112",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "掌控注意力",
        "description": "从焦虑走向专注，数字时代的效率宝典",
        "releaseDate": "2023.11.04上新",
        "playCount": "播放量763.9万",
        "link": "/book/400079226",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "奥格威谈广告",
        "description": "跟奥美创始人学传播，拥抱你的第一桶金",
        "releaseDate": "2021.10.16上新",
        "playCount": "播放量758.7万",
        "link": "/book/400011659",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "拿铁因素",
        "description": "揭开财务自由的三个秘密，离理想生活更近一步",
        "releaseDate": "2023.09.23上新",
        "playCount": "播放量758.7万",
        "link": "/book/400076206",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "饥饿帝国",
        "description": "看美食如何推动大英帝国崛起",
        "releaseDate": "2022.02.26上新",
        "playCount": "播放量754.8万",
        "link": "/book/400016012",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "屏幕时代，重塑孩子的自控力",
        "description": "哈佛医学博士力作，帮孩子克服手机成瘾",
        "releaseDate": "2024.04.13上新",
        "playCount": "播放量753.5万",
        "link": "/book/400100878",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "生命的礼物",
        "description": "在生命和死亡之间，看到存在的终极意义",
        "releaseDate": "2023.10.07上新",
        "playCount": "播放量750.5万",
        "link": "/book/400076261",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "认同",
        "description": "赢取认同的关键，其实是争取更多中立的人",
        "releaseDate": "2015.07.10上新",
        "playCount": "播放量746.5万",
        "link": "/book/175",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "给善恶一个答案",
        "description": "我们该如何理性地做出道德判断？",
        "releaseDate": "2022.12.03上新",
        "playCount": "播放量741.4万",
        "link": "/book/400037519",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "西方美术史话",
        "description": "通俗易懂的美术入门，提升你的审美力",
        "releaseDate": "2021.10.02上新",
        "playCount": "播放量736.6万",
        "link": "/book/400011295",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "史蒂芬·霍金：友谊与物理学的回忆",
        "description": "天才亦凡人，走近霍金尽兴而活的一生",
        "releaseDate": "2022.09.17上新",
        "playCount": "播放量736.5万",
        "link": "/book/400032165",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "沃顿商学院最受欢迎的谈判课",
        "description": "无论什么场景，都能让你赢得更多",
        "releaseDate": "2016.08.27上新",
        "playCount": "播放量735.9万",
        "link": "/book/335",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "己亥",
        "description": "樊登对谈余世存：龚自珍如何用315首诗实现人生逆袭",
        "releaseDate": "2020.01.18上新",
        "playCount": "播放量724.1万",
        "link": "/book/200000099",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人性实验",
        "description": "人性真的经得起检验吗？带你读懂人心，洞察人性！",
        "releaseDate": "2024.03.23上新",
        "playCount": "播放量723.8万",
        "link": "/book/400104494",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "十年一觉电影梦",
        "description": "樊登对谈李安：一个导演的自我修养",
        "releaseDate": "2019.10.19上新",
        "playCount": "播放量723.7万",
        "link": "/book/200000081",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "创始人",
        "description": "升职？跳槽？过好在新岗位的第一个90天，实现过渡时期的高能转变",
        "releaseDate": "2016.12.24上新",
        "playCount": "播放量723.5万",
        "link": "/book/348",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "像绅士淑女一样服务",
        "description": "成就卓越的服务之道",
        "releaseDate": "2023.02.04上新",
        "playCount": "播放量718.6万",
        "link": "/book/400049696",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "正午之魔",
        "description": "揭秘抑郁症真相，学会如何正视抑郁",
        "releaseDate": "2023.05.06上新",
        "playCount": "播放量708.5万",
        "link": "/book/400063634",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "亚马逊编年史",
        "description": "重现亚马逊崛起之路",
        "releaseDate": "2022.01.08上新",
        "playCount": "播放量707.6万",
        "link": "/book/400015608",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "梁漱溟先生讲孔孟（上）",
        "description": "“中国最后一位大儒”梁漱溟先生用14个词讲透《论语》",
        "releaseDate": "2016.07.02上新",
        "playCount": "播放量706.4万",
        "link": "/book/327",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "规模",
        "description": "跳脱线性思维，用规模重审世界",
        "releaseDate": "2023.04.22上新",
        "playCount": "播放量705.2万",
        "link": "/book/400060187",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "联盟",
        "description": "让你的员工成为你的联盟伙伴，开启互联网时代的人才革命",
        "releaseDate": "2015.04.10上新",
        "playCount": "播放量704.7万",
        "link": "/book/162",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "怕死：人类行为的驱动力",
        "description": "揭开忧愁、不安和欲望的根源",
        "releaseDate": "2017.10.14上新",
        "playCount": "播放量703.6万",
        "link": "/book/549",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503271821/e5ca8edff884eddb2aed8cb54b622e60/media/audio/16770324595e39f98316bd0ba36d779080c4ff13efynalq7.mp3",
        "uploaded": true
    },
    {
        "title": "谢谢你迟到",
        "description": "如何在疯狂加速时代中抓住要点，破题未来",
        "releaseDate": "2018.05.12上新",
        "playCount": "播放量701.7万",
        "link": "/book/588",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "世说新语别裁详解",
        "description": "真性情，还是假潇洒？还原真实的魏晋名士",
        "releaseDate": "2023.04.29上新",
        "playCount": "播放量695.9万",
        "link": "/book/400063578",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "重塑杏仁核",
        "description": "与内心的焦虑对话，重获情绪的掌控权",
        "releaseDate": "2024.11.16上新",
        "playCount": "播放量695.5万",
        "link": "/book/400119016",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "得民心得天下：王蒙说《孟子》",
        "description": "重温儒家经典，打开孟子世界的大门，感悟伟大智慧，培养浩然之气",
        "releaseDate": "2017.09.16上新",
        "playCount": "播放量694.2万",
        "link": "/book/495",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/16770336935decb2024aa97fb0beca8dfda9a145c02n1q8c.mp3?key=a4d9df6746928ab2e8ea3948b4b4ab62&time=1743070900",
        "uploaded": true
    },
    {
        "title": "生活的陷阱",
        "description": "如何应对人生中的至暗时刻",
        "releaseDate": "2024.08.31上新",
        "playCount": "播放量691.3万",
        "link": "/book/400118808",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "一如既往",
        "description": "看透慌慌张张的世界，过上从从容容的人生",
        "releaseDate": "2024.08.03上新",
        "playCount": "播放量686.1万",
        "link": "/book/400117820",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "翻转课堂的可汗学院",
        "description": "突破传统教育的桎梏，实现教学统一，培养孩子的创造力，翻转未来",
        "releaseDate": "2016.09.24上新",
        "playCount": "播放量684.9万",
        "link": "/book/340",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "岁月凶猛",
        "description": "樊登对谈冯仑：商界思想家传授处世智慧，教你从容应对人生",
        "releaseDate": "2018.09.15上新",
        "playCount": "播放量683.6万",
        "link": "/book/200000012",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "离经叛道",
        "description": "不按常理出牌的人如何改变世界",
        "releaseDate": "2016.10.22上新",
        "playCount": "播放量682.5万",
        "link": "/book/344",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "创新与企业家精神",
        "description": "管理学大师彼得·德鲁克经典作品",
        "releaseDate": "2017.09.23上新",
        "playCount": "播放量680.8万",
        "link": "/book/521",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "园丁与木匠",
        "description": "解密孩子自然学习之路",
        "releaseDate": "2023.12.09上新",
        "playCount": "播放量679.5万",
        "link": "/book/400090915",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "相信",
        "description": "一位渐冻症患者向死而生的创业",
        "releaseDate": "2023.07.29上新",
        "playCount": "播放量677.0万",
        "link": "/book/400071263",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "奇观",
        "description": "八个奇观串联起我们和宇宙的故事",
        "releaseDate": "2022.12.24上新",
        "playCount": "播放量670.5万",
        "link": "/book/400040620",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "科学营销",
        "description": "至简三步法，讲透科特勒营销体系",
        "releaseDate": "2023.05.20上新",
        "playCount": "播放量669.8万",
        "link": "/book/400066859",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "信念",
        "description": "十年徒步，解锁大美中国",
        "releaseDate": "2024.06.01上新",
        "playCount": "播放量669.5万",
        "link": "/book/400095395",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "这是真的吗",
        "description": "明辨真伪的批判性思维工具",
        "releaseDate": "2023.04.01上新",
        "playCount": "播放量669.2万",
        "link": "/book/400057592",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "少年发声",
        "description": "你真的知道，你的孩子在想什么吗？",
        "releaseDate": "2024.09.07上新",
        "playCount": "播放量669.1万",
        "link": "/book/400113890",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "世界如锦心如梭",
        "description": "旅行所见的美好，盛在眼中，更织在心中",
        "releaseDate": "2017.09.09上新",
        "playCount": "播放量668.5万",
        "link": "/book/492",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "帮孩子摆脱焦虑",
        "description": "看见孩子小烦恼，预防成长大问题",
        "releaseDate": "2023.03.25上新",
        "playCount": "播放量662.3万",
        "link": "/book/400057532",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "善终守护师",
        "description": "学会好好告别，一堂关于临终的必修课",
        "releaseDate": "2022.04.02上新",
        "playCount": "播放量657.9万",
        "link": "/book/400016856",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我们仨",
        "description": "杨绛暮年回忆录，书写文人半生滋味",
        "releaseDate": "2023.09.09上新",
        "playCount": "播放量656.0万",
        "link": "/book/400075387",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "不安的哲学",
        "description": "岸见一郎写给你的宽心之书",
        "releaseDate": "2023.12.30上新",
        "playCount": "播放量652.5万",
        "link": "/book/400094394",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "弃长安",
        "description": "穿越长安盛衰，追寻安史之乱的真相",
        "releaseDate": "2023.11.11上新",
        "playCount": "播放量646.6万",
        "link": "/book/400081641",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "广告说服力",
        "description": "揭开好广告赚钱的秘密",
        "releaseDate": "2022.01.29上新",
        "playCount": "播放量644.0万",
        "link": "/book/400015814",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "叶檀理财课",
        "description": "不会理财，怕亏了？来听叶老师的理财入门课",
        "releaseDate": "2017.10.24上新",
        "playCount": "播放量643.2万",
        "link": "/book/551",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "最好的告别",
        "description": "徒劳地挽留，不如优雅地告别，白宫健康顾问带你探索生命之道",
        "releaseDate": "2015.12.04上新",
        "playCount": "播放量637.1万",
        "link": "/book/297",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "荒野上的大师",
        "description": "致敬中国考古先行者，回望百年考古之路",
        "releaseDate": "2022.11.26上新",
        "playCount": "播放量634.7万",
        "link": "/book/400036640",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "原生家庭木马快筛",
        "description": "清除家庭负向印记，让人生自己说了算",
        "releaseDate": "2023.08.26上新",
        "playCount": "播放量633.6万",
        "link": "/book/400074236",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "潜能觉醒",
        "description": "被保护的人，才能勇敢向前",
        "releaseDate": "2025.02.15上新",
        "playCount": "播放量629.2万",
        "link": "/book/400130642",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "你能写出好故事",
        "description": "结合心理学知识的故事创作指南，可操作性极强",
        "releaseDate": "2016.09.10上新",
        "playCount": "播放量628.1万",
        "link": "/book/338",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "陈志武金融通识课",
        "description": "樊登对谈陈志武：耶鲁教授帮你读懂金融，成为复杂世界的人生赢家",
        "releaseDate": "2018.12.19上新",
        "playCount": "播放量626.3万",
        "link": "/book/200000029",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "抱怨的艺术",
        "description": "让不满，变圆满",
        "releaseDate": "2024.09.21上新",
        "playCount": "播放量626.1万",
        "link": "/book/400113891",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "共享经济",
        "description": "重构未来商业新模式",
        "releaseDate": "2016.03.18上新",
        "playCount": "播放量623.6万",
        "link": "/book/312",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "创业维艰",
        "description": "没有固定的解决套路可循，但有智慧的技巧可借鉴",
        "releaseDate": "2015.05.29上新",
        "playCount": "播放量620.4万",
        "link": "/book/170",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "现金为王",
        "description": "有收入不等于有钱赚，利润才是创业王道",
        "releaseDate": "2024.06.08上新",
        "playCount": "播放量619.8万",
        "link": "/book/400109589",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/1717404965f66a54d42a3f50e821d82c39da656bf0dgjwgv.mp3?key=1aac827b272e3e35b33b9c2411471687&time=1743070964",
        "uploaded": true
    },
    {
        "title": "新零售的未来",
        "description": "零售连锁巨头的进化之道",
        "releaseDate": "2018.03.17上新",
        "playCount": "播放量618.8万",
        "link": "/book/579",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "大汗之国",
        "description": "这是一本旁观之书，记录了700年间西方人眼中的中国的变迁历史",
        "releaseDate": "2015.11.21上新",
        "playCount": "播放量616.2万",
        "link": "/book/69",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "医生的修炼",
        "description": "没有人可以做到完美，但我们不能因此放弃对完美的追求",
        "releaseDate": "2016.11.05上新",
        "playCount": "播放量615.7万",
        "link": "/book/346",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "为什么有的人特别招蚊子",
        "description": "爸妈也能秒懂的微生物科普，原来它才是威胁健康的终极杀手",
        "releaseDate": "2017.07.01上新",
        "playCount": "播放量610.2万",
        "link": "/book/380",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "感官品牌",
        "description": "当品牌融入了感官，你的公司也就走向了世界",
        "releaseDate": "2016.11.26上新",
        "playCount": "播放量609.6万",
        "link": "/book/350",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "教育的减法",
        "description": "把握未来教育方向",
        "releaseDate": "2023.09.02上新",
        "playCount": "播放量609.4万",
        "link": "/book/400074881",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "流放的老国王",
        "description": "如果家里有了阿尔茨海默症患者，我们可以做什么",
        "releaseDate": "2017.04.15上新",
        "playCount": "播放量605.0万",
        "link": "/book/369",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "中国哲学简史（下）",
        "description": "读懂儒释道思想精髓与变迁",
        "releaseDate": "2017.06.03上新",
        "playCount": "播放量601.3万",
        "link": "/book/376",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "斯坦福大学最受欢迎的创意课",
        "description": "让你的工作和生活充满创新方法的一本书",
        "releaseDate": "2013.12.18上新",
        "playCount": "播放量599.0万",
        "link": "/book/18",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "翦商",
        "description": "从新石器时代末期到商周易代时期，一千年的变革过程",
        "releaseDate": "2023.08.05上新",
        "playCount": "播放量596.3万",
        "link": "/book/400071880",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "数据思维",
        "description": "樊登对谈王汉生：大数据，从精准投放到预测未来",
        "releaseDate": "2018.04.21上新",
        "playCount": "播放量594.7万",
        "link": "/book/585",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/16769486921ba9b7f7a5deda7c98ae039c63d712e4p1cape.mp3?key=f1301729d96225e2276ded723d965e9c&time=1743070987",
        "uploaded": true
    },
    {
        "title": "爸爸军团",
        "description": "当死亡来临，放心不下女儿的好爸爸，为她们安排了六位新“爸爸”",
        "releaseDate": "2017.06.17上新",
        "playCount": "播放量594.0万",
        "link": "/book/378",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/16766126774f8cd0e1424286e966cea40e77fde28d35ljlu.mp3?key=83d28172dbd964682d4fbd22f557c683&time=1743070989",
        "uploaded": true
    },
    {
        "title": "楼船铁马刘寄奴",
        "description": "从一介布衣到乱世天子，走近战神刘裕的传奇生涯",
        "releaseDate": "2023.06.10上新",
        "playCount": "播放量593.9万",
        "link": "/book/400068722",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "布鲁克林有棵树",
        "description": "困住人生步伐的，从来不是贫穷",
        "releaseDate": "2024.05.18上新",
        "playCount": "播放量590.3万",
        "link": "/book/400108231",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "幸福的种子",
        "description": "探索更科学的心理学",
        "releaseDate": "2024.12.28上新",
        "playCount": "播放量590.1万",
        "link": "/book/400125334",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "为什么我们总是在防御",
        "description": "真正的勇士敢于卸下盔甲，直面真我",
        "releaseDate": "2024.01.13上新",
        "playCount": "播放量589.2万",
        "link": "/book/400095205",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "点亮黑夜",
        "description": "爱迪生的传奇人生",
        "releaseDate": "2023.12.02上新",
        "playCount": "播放量587.8万",
        "link": "/book/400087162",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "浪花淘尽英雄",
        "description": "揭开三国乱世序幕，风云变幻，谁主沉浮？",
        "releaseDate": "2024.12.07上新",
        "playCount": "播放量585.9万",
        "link": "/book/400123747",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "经纬华夏",
        "description": "欧洲因何分裂，中国因何统一？",
        "releaseDate": "2023.10.14上新",
        "playCount": "播放量585.0万",
        "link": "/book/400076596",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/169684135086909f8338c8ac444ebc7ff4e0807f71f4p0jp.mp3?key=127994da3f4efb11f67edb65bd2d8ebd&time=1743071003",
        "uploaded": true
    },
    {
        "title": "金钱不能买什么",
        "description": "在几乎一切都可买卖的时代，如何划定金钱的界限",
        "releaseDate": "2014.02.28上新",
        "playCount": "播放量582.6万",
        "link": "/book/72",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "促销",
        "description": "即学即用的促销创意",
        "releaseDate": "2022.12.10上新",
        "playCount": "播放量582.1万",
        "link": "/book/400037655",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "洪业",
        "description": "从森林走出的部落，如何建立近300年洪业？",
        "releaseDate": "2023.05.27上新",
        "playCount": "播放量576.4万",
        "link": "/book/400067331",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "善意的魔力",
        "description": "每天一个小改变，用善意成就更好的你",
        "releaseDate": "2025.01.18上新",
        "playCount": "播放量575.9万",
        "link": "/book/400128744",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "怎样做成大事",
        "description": "慢思考、快行动，大项目的成功秘诀",
        "releaseDate": "2024.05.11上新",
        "playCount": "播放量575.7万",
        "link": "/book/400108146",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "为什么是足球？",
        "description": "人类为什么爱足球，这里有关于足球的一切",
        "releaseDate": "2018.07.14上新",
        "playCount": "播放量571.3万",
        "link": "/book/597",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "孔子如来",
        "description": "孔子言行的客观解读笔记，鲍鹏山为我们还原一个真实鲜活的孔子",
        "releaseDate": "2015.11.28上新",
        "playCount": "播放量566.3万",
        "link": "/book/294",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "藏在成语中的心理学",
        "description": "洞察日常行为背后隐藏的心理动机",
        "releaseDate": "2024.02.24上新",
        "playCount": "播放量563.9万",
        "link": "/book/400095394",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "战安庆：曾国藩的中年突围",
        "description": "“古今第一完人”曾国藩如何应对中年危机",
        "releaseDate": "2024.01.06上新",
        "playCount": "播放量554.7万",
        "link": "/book/400094536",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "大英帝国3000年",
        "description": "3000年英国历史全貌，详解帝国崛起的秘密",
        "releaseDate": "2023.07.15上新",
        "playCount": "播放量553.4万",
        "link": "/book/400070836",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "一个世纪的人生课",
        "description": "一位百岁老人亲身践行的人生课",
        "releaseDate": "2024.10.19上新",
        "playCount": "播放量553.3万",
        "link": "/book/400119574",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "让顾客自己来定价",
        "description": "沃顿商学院教授深度剖析创新定价策略，传授最盈利公司的致富真经",
        "releaseDate": "2015.12.18上新",
        "playCount": "播放量552.3万",
        "link": "/book/116",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我想飞进天空",
        "description": "自闭症儿童——来自星星的孩子，请你多多关照",
        "releaseDate": "2016.10.08上新",
        "playCount": "播放量551.5万",
        "link": "/book/342",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "吃茶趣",
        "description": "品味杯盏佳茗，趣话名茶沉浮",
        "releaseDate": "2024.10.26上新",
        "playCount": "播放量547.2万",
        "link": "/book/400107838",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "理性的边界",
        "description": "打破思维限制，重新认识世界",
        "releaseDate": "2024.03.02上新",
        "playCount": "播放量545.4万",
        "link": "/book/400100458",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "捉弄人的大脑",
        "description": "看清世界，先看清大脑",
        "releaseDate": "2024.05.25上新",
        "playCount": "播放量533.9万",
        "link": "/book/400100877",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "破解欺凌的游戏",
        "description": "走出欺凌困境 ，做“内核稳定”的成年人!",
        "releaseDate": "2024.12.14上新",
        "playCount": "播放量530.4万",
        "link": "/book/400124092",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "疯狂的尿酸",
        "description": "降尿酸，不止要控嘌呤！降尿酸，不止为防痛风！",
        "releaseDate": "2024.06.15上新",
        "playCount": "播放量523.1万",
        "link": "/book/400107842",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "为什么伟大不能被计划",
        "description": "没有目标的人生，更可能成就伟大",
        "releaseDate": "2024.11.23上新",
        "playCount": "播放量508.4万",
        "link": "/book/400123338",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "忽必烈",
        "description": "创业难，守业更难，忽必烈如何破旧立新？",
        "releaseDate": "2024.03.16上新",
        "playCount": "播放量507.0万",
        "link": "/book/400104246",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "转折",
        "description": "解码转折伟业，开启变局新篇",
        "releaseDate": "2023.12.23上新",
        "playCount": "播放量506.1万",
        "link": "/book/400093961",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "零边际成本社会",
        "description": "带你走进一个物联网、合作共赢的新经济时代",
        "releaseDate": "2015.07.17上新",
        "playCount": "播放量504.2万",
        "link": "/book/176",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "跨越鸿沟",
        "description": "从小众到主流，成功营销的攻守之道",
        "releaseDate": "2023.07.22上新",
        "playCount": "播放量503.4万",
        "link": "/book/400070837",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "隔代养育",
        "description": "给新一代祖父母的科学育儿指南",
        "releaseDate": "2023.07.08上新",
        "playCount": "播放量502.6万",
        "link": "/book/400070483",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人人能懂的相对论",
        "description": "用中学物理读懂相对论，一堂课重构时空观",
        "releaseDate": "2023.07.01上新",
        "playCount": "播放量502.1万",
        "link": "/book/400070398",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "花开与敦煌",
        "description": "你不得不了解的敦煌故事",
        "releaseDate": "2023.11.25上新",
        "playCount": "播放量498.5万",
        "link": "/book/400086578",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人口创新力",
        "description": "樊登对谈梁建章：人口才是创新的潜力股",
        "releaseDate": "2019.01.19上新",
        "playCount": "播放量490.9万",
        "link": "/book/200000035",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "嘉庆传",
        "description": "站在清朝转折路口，看太平皇帝嘉庆",
        "releaseDate": "2024.04.27上新",
        "playCount": "播放量488.2万",
        "link": "/book/400105870",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "超越好奇",
        "description": "一本书读懂互联网大佬和他所在的江湖",
        "releaseDate": "2017.11.11上新",
        "playCount": "播放量487.6万",
        "link": "/book/554",
        "audioUrl": "https://jq-cdn-hs-dest.dushu365.com/202503271824/6ed356e99b5ad7ae0df1e37e33d2d84d/media/audio/169588077924412f01f8ce522c574158a936256291vpkbao.mp3",
        "uploaded": true
    },
    {
        "title": "不被定义的年龄",
        "description": "诚邀你重新思考年龄到底意味着什么",
        "releaseDate": "2024.10.12上新",
        "playCount": "播放量477.2万",
        "link": "/book/400119011",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "智人之上",
        "description": "智人之上是人类，还是智能？",
        "releaseDate": "2025.03.01上新",
        "playCount": "播放量477.0万",
        "link": "/book/400131349",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "极简法则",
        "description": "给企业做减法，让收益做加法！",
        "releaseDate": "2024.02.17上新",
        "playCount": "播放量466.7万",
        "link": "/book/400098310",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "梁漱溟先生讲孔孟（下）",
        "description": "“中国最后一位大儒”梁漱溟先生用14个词讲透《论语》",
        "releaseDate": "2016.07.09上新",
        "playCount": "播放量466.2万",
        "link": "/book/328",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "人口战略",
        "description": "纵览中国人口变局，读懂生存、生育、生活",
        "releaseDate": "2023.09.30上新",
        "playCount": "播放量461.7万",
        "link": "/book/400076213",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "古罗马帝国的辉煌",
        "description": "“条条大路通罗马”还有这样的深意？！",
        "releaseDate": "2024.01.20上新",
        "playCount": "播放量459.6万",
        "link": "/book/400095447",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "一生一事",
        "description": "四十年编辑生涯苦与乐，一个人就是一部出版史",
        "releaseDate": "2024.08.10上新",
        "playCount": "播放量451.2万",
        "link": "/book/400117830",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "名创优品没有秘密",
        "description": "零售业出奇制胜的秘诀",
        "releaseDate": "2017.08.19上新",
        "playCount": "播放量450.6万",
        "link": "/book/388",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "最富足的投资",
        "description": "投资大师写给孩子的成长之书",
        "releaseDate": "2025.03.15上新",
        "playCount": "播放量448.1万",
        "link": "/book/400131774",
        "audioUrl": "https://jq-cdn-ws-dest.dushu365.com/media/audio/17415930967f28be92c36a1682fd233fa5eb1f020c31stn6.mp3?key=79691b15dbf02e0c757786733d768eff&time=1743071080",
        "uploaded": true
    },
    {
        "title": "裂变式创业",
        "description": "帮助传统企业找到通往财富之路",
        "releaseDate": "2017.06.10上新",
        "playCount": "播放量445.5万",
        "link": "/book/377",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "为什么你的学生不思考？",
        "description": "深度揭秘课堂逻辑，助你成为学习高手",
        "releaseDate": "2023.10.28上新",
        "playCount": "播放量438.4万",
        "link": "/book/400077118",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "维特根斯坦十讲",
        "description": "终结哲学的天纵之才，颠覆你对语言的认知",
        "releaseDate": "2024.11.30上新",
        "playCount": "播放量433.3万",
        "link": "/book/400123635",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "超越巴菲特的伯克希尔",
        "description": "绝不仅是股神！揭开巴菲特的另一面",
        "releaseDate": "2024.04.06上新",
        "playCount": "播放量426.8万",
        "link": "/book/400104499",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "流量池",
        "description": "网红小蓝杯营销操盘者杨飞亲授刷屏级流量留存的实战打法",
        "releaseDate": "2018.07.21上新",
        "playCount": "播放量426.4万",
        "link": "/book/200000003",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "拥抱那只黑狗",
        "description": "面对抑郁，你从来不是一个人",
        "releaseDate": "2025.03.08上新",
        "playCount": "播放量421.4万",
        "link": "/book/400123853",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "四大圣哲",
        "description": "傅佩荣亲译、许倬云力荐的哲学经典",
        "releaseDate": "2025.02.08上新",
        "playCount": "播放量415.8万",
        "link": "/book/400130467",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "时间的秩序",
        "description": "跳进未知之海，追问时间本质",
        "releaseDate": "2024.07.13上新",
        "playCount": "播放量414.9万",
        "link": "/book/400113888",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "玄机设计学",
        "description": "大开脑洞的设计，不知不觉改变你的行为",
        "releaseDate": "2023.03.04上新",
        "playCount": "播放量412.0万",
        "link": "/book/400053920",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我需要去看心理医生吗？",
        "description": "心理治疗能帮我们改变什么？",
        "releaseDate": "2024.06.22上新",
        "playCount": "播放量411.1万",
        "link": "/book/400111631",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "尽忠报国：岳飞新传",
        "description": "直击岳母刺字现场，还原历史真相",
        "releaseDate": "2025.01.11上新",
        "playCount": "播放量408.8万",
        "link": "/book/400128567",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "爆款",
        "description": "哈佛教授解读“爆款”背后的逻辑、秘密和未来",
        "releaseDate": "2016.06.18上新",
        "playCount": "播放量408.4万",
        "link": "/book/67",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "永远的女儿",
        "description": "是谁无声“杀死”孩子？",
        "releaseDate": "2024.07.27上新",
        "playCount": "播放量405.6万",
        "link": "/book/400114785",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "阅读手册",
        "description": "学会自主阅读，让孩子受益终生",
        "releaseDate": "2025.02.22上新",
        "playCount": "播放量405.0万",
        "link": "/book/400123848",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "康熙的红票",
        "description": "透过康熙的神秘谕令，揭开中西交流往事",
        "releaseDate": "2024.07.20上新",
        "playCount": "播放量398.2万",
        "link": "/book/400114201",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "银元时代生活史",
        "description": "看老上海世态百相",
        "releaseDate": "2025.02.01上新",
        "playCount": "播放量398.2万",
        "link": "/book/400129992",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "五代九章",
        "description": "有趣、有料、有温度，中国人不该忽略这段历史",
        "releaseDate": "2024.09.14上新",
        "playCount": "播放量390.6万",
        "link": "/book/400119107",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "就业赛道怎么选",
        "description": "经济学家解读就业新趋势",
        "releaseDate": "2024.03.30上新",
        "playCount": "播放量387.5万",
        "link": "/book/400104990",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "漫威",
        "description": "一本书，读透漫威的前世今生",
        "releaseDate": "2024.12.21上新",
        "playCount": "播放量387.3万",
        "link": "/book/400124483",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "达摩流浪者",
        "description": "始于背包漫游，抵达心灵自由",
        "releaseDate": "2024.08.24上新",
        "playCount": "播放量381.2万",
        "link": "/book/400107837",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "重新定义公司",
        "description": "如何充分发挥员工的潜能和创造力，满足客户需求，让企业脱颖而出",
        "releaseDate": "2015.10.16上新",
        "playCount": "播放量380.9万",
        "link": "/book/272",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "支付战争",
        "description": "“支付改变世界”——ebay&PayPal创始人的创业故事",
        "releaseDate": "2015.07.31上新",
        "playCount": "播放量375.6万",
        "link": "/book/178",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "命悬一线，我不放手",
        "description": "感人肺腑的ICU实录，带你触摸生命的温度",
        "releaseDate": "2024.05.04上新",
        "playCount": "播放量368.6万",
        "link": "/book/400108137",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "吸金广告",
        "description": "纵横广告界30年，奥美、麦肯等国际知名广告公司的培训教材",
        "releaseDate": "2015.01.09上新",
        "playCount": "播放量363.2万",
        "link": "/book/147",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "极致",
        "description": "在互联网时代，我们该如何设计“极致”产品",
        "releaseDate": "2017.07.29上新",
        "playCount": "播放量362.5万",
        "link": "/book/384",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "一切从广告开始",
        "description": "别让好产品输给烂广告",
        "releaseDate": "2024.01.27上新",
        "playCount": "播放量361.6万",
        "link": "/book/400095590",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "刀锋上的行走",
        "description": "雕塑刀与地平线的舞蹈——赏读艺术家刘洋的千面人生",
        "releaseDate": "2015.09.04上新",
        "playCount": "播放量359.4万",
        "link": "/book/183",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "波伏瓦传",
        "description": "独立女性的自由宣言，读懂波伏瓦的激荡人生",
        "releaseDate": "2024.02.03上新",
        "playCount": "播放量356.4万",
        "link": "/book/400096754",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "在云端",
        "description": "从踏入机场到飞机着陆，一场关于飞行的发现之旅",
        "releaseDate": "2024.09.28上新",
        "playCount": "播放量351.8万",
        "link": "/book/400107839",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "哥伦布与大航海时代",
        "description": "改变世界的航海传奇",
        "releaseDate": "2024.06.29上新",
        "playCount": "播放量347.8万",
        "link": "/book/400099366",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "量子传",
        "description": "究竟什么才是现实？",
        "releaseDate": "2024.10.05上新",
        "playCount": "播放量346.4万",
        "link": "/book/400105084",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "什么是科学",
        "description": "一部开启心智、激发思考的科学哲学作品",
        "releaseDate": "2025.01.25上新",
        "playCount": "播放量340.3万",
        "link": "/book/400130152",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "视觉锤",
        "description": "构建品牌，定位为先；10把大锤，用视觉形象，把你的语言钉子植入消费者的心智中",
        "releaseDate": "2016.01.15上新",
        "playCount": "播放量328.2万",
        "link": "/book/128",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "创客",
        "description": "什么是创客精神？如何成为创客？和本书一起颠覆式创业吧",
        "releaseDate": "2015.05.08上新",
        "playCount": "播放量327.4万",
        "link": "/book/167",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "颠覆性医疗革命",
        "description": "22种趋势预测描绘科幻般的医疗未来",
        "releaseDate": "2016.03.05上新",
        "playCount": "播放量304.5万",
        "link": "/book/310",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "浪潮式发售",
        "description": "贝佐斯的创业教练教你如何用10天时间，4种发售路径让产品热销",
        "releaseDate": "2016.06.04上新",
        "playCount": "播放量291.5万",
        "link": "/book/146",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "我好，你好",
        "description": "了解自我、改变人生的人际沟通分析",
        "releaseDate": "2025.03.22上新",
        "playCount": "播放量290.9万",
        "link": "/book/400123851",
        "audioUrl": "",
        "uploaded": false
    },
    {
        "title": "一个广告人的自白",
        "description": "了解广告业及广告人必读的一本书",
        "releaseDate": "2015.07.24上新",
        "playCount": "播放量287.0万",
        "link": "/book/177",
        "audioUrl": "",
        "uploaded": false
    }
]`
</script>
<style scoped></style>