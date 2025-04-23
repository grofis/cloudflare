<template>
    <a-input-search v-model:value="inputText" placeholder="I Sell Onions on the Internet" allowClear enter-button
        @search="onSearch" @change="onSearchChange" />
    <a-list item-layout="vertical" :dataSource="listData" :pagination="pagination">
        <template #renderItem="{ item, index }">
            <a-list-item @dblclick="editItem(index)">
                <a-list-item-meta id="hacker-news-list-item-meta" style="margin-block-end: 2px;">
                    <template #title>
                        <div>
                            <a :href="item.href" target="_blank">{{ item.title }}</a>
                            <a-typography-paragraph type="secondary" v-if="editingIndex === index"
                                v-model:content="item.translated" :editable="{ tooltip: false }" />
                            <a-typography-paragraph type="secondary" v-else>
                                {{ item.translated }}
                            </a-typography-paragraph>
                        </div>
                    </template>
                    <template #description>
                        <div>
                            <span>
                                {{ item.points + ' 分 ' + item.author + ' 于 ' + item.created_at +
                                    ' 创建 ' }}
                                <a :href="`https://news.ycombinator.com/item?id=${item.story_id}`" target="_blank">{{
                                    item.num_comments }}</a> 评论
                            </span>
                            <div>
                                <a-typography-paragraph type="secondary" v-if="editingIndex === index"
                                    v-model:content="listData[index].tags" :editable="{
                                        tooltip: false,
                                        onEnd: () => onTagsChange(index)
                                    }" />
                                <span v-else>{{ item.tags }}</span>
                            </div>
                        </div>
                    </template>
                </a-list-item-meta>
            </a-list-item>
        </template>
        <template #footer>
            <div>
                <b>ant design vue</b>
                footer part
            </div>
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

const editingIndex = ref(-1)

onMounted(() => {
    getData()
})

const titles = ["I Sell Onions on the Internet",
    "My YouTube earnings",
    "Thank HN: My bootstrapped startup got acquired today",
    "The unreasonable effectiveness of just showing up everyday",
    "Bye, Amazon",
    "I tried creating a web browser, and Google blocked me",
    "Launch HN: 70MillionJobs (YC S17) – Job board for people with criminal records",
    "My experience at Apple",
    "Silicon Valley's best kept secret: Founder liquidity",
    "The architecture behind a one-person Internet company",
    "I Just Hit $100k/year On GitHub Sponsors",
    "How I cut GTA Online loading times by 70%",
    "Show HN: I made a site where you practice typing by retyping entire novels",
    "I've built my first successful side project, and I hate it",
    "I started a paper website business",
    "Reflecting on My Failure to Build a Billion-Dollar Company",
    "I got laid off from Meta and created a minor hit on Steam",
    "I made a smart watch from scratch",
    "I bought 300 emoji domain names from Kazakhstan and built an email service",
    "I got pwned by my cloud costs",
    "Started a stupid company. Failed.",
    "The boring technology behind a one-person Internet company (2018)",
    "Stoop Coffee: A simple idea transformed my neighborhood",
    "No meetings, no deadlines, no full-time employees",
    "After self-hosting my email for twenty-three years I have thrown in the towel",
    "Why I Quit Google to Work for Myself",
    "Show HN: Non.io, a Reddit-like platform I've been working on for the last 4 years",
    "Show HN: I'm building an open-source Amazon",
    "Show HN: Can't afford Bloomberg Terminal? No prob, I built the next best thing",
    "I'm basically giving myself a permanent vacation from being BDFL",
    "My productivity app for the past 12 years has been a single .txt file",
    "Otonomo, with nearly $55M in funding, is cloning our product",
    "I may have created a new type of puzzle",
    "I'm learning to code by building 180 websites in 180 days. Today is day 115",
    "What I Wish I'd Known About Equity Before Joining a Unicorn",
    "Uber discovered they'd been defrauded out of 2/3 of their ad spend",
    "How to succeed in MrBeast production (Leaked PDF)",
    "We're dropping Google Ads",
    "I've acquired a new superpower"]

const pagination = {
    onChange: page => {
        console.log(page);
    },
    pageSize: 10,
};

const inputText = ref('')
const inputPlaceholder = ref('I Sell Onions on the Internet'); // 定义 placeholder
const onSearch = searchValue => {
    if (!searchValue) {
        // 如果没有输入，使用 placeholder 赋值给 inputText.value
        inputText.value = inputPlaceholder.value; // 使用 placeholder 的值
        listData.length = 0
        titles.forEach(title => {
            srcData.forEach(item => {
                if (item.title === title) {
                    listData.push(item)
                }
            })
        })
    } else {
        console.log('or use this.value', inputText.value);
        listData.length = 0
        srcData.forEach(item => {
            if (item.title === inputText.value.trim()) {
                // console.log('item:', item)
                // item.tags = item.tags.join(', ')
                listData.push(item)
            }
        })
    }


};

const onSearchChange = () => {
    console.log('onSearchChange:', inputText.value)
    if (inputText.value.trim() == '') {
        listData.length = 0
        listData.push(...srcData)
    }
}

const srcData = reactive([
    {
        title: "Stephen Hawking has died",
        translated: "斯蒂芬·霍金已经去世",
        href: "http://www.bbc.com/news/uk-43396008",
        author: "Cogito",
        points: 6015,
        num_comments: 436,
        story_id: 16582136,
        created_at_i: 1520999430,
        created_at: "2018-03-14T03:50:30Z",
        updated_at: "2025-04-14T21:19:25Z",
        tags: ["story", "author_Cogito", "story_16582136"]
    },
    // … 其余项
])
const listData = reactive([])

onMounted(() => {
    getData()
})

async function getData() {
    const url = `${import.meta.env.VITE_API_URL}/hn/get`
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
    srcData.length = 0
    let num = 0
    res.forEach(item => {
        item.created_at = moment(item.created_at).format('MM-DD-YY HH:mm:ss')
        let title = item.title.trim()
        if (title.endsWith('died') || title.includes('passed away')) {
            item.tags.push('讣告')
            item.tags = item.tags.join(', ')
            num++
        } else {
            item.tags = item.tags.join(', ')
            // console.log('item:', item)
            srcData.push(item)
        }
    })
    listData.length = 0
    listData.push(...srcData)
    console.log('num:', num)
}


/** 双击行进入编辑 */
function editItem(idx) {
    editingIndex.value = idx
    // 获取要拷贝的项
    const itemToCopy = listData[idx];

    // 将要拷贝的内容格式化为字符串
    const textToCopy = `title: "${itemToCopy.title}",\n` +
        `from: 'https://news.ycombinator.com/item?id=${itemToCopy.story_id}',\n` +
        `href: '${itemToCopy.href}',\n` +
        `tags: ${JSON.stringify(itemToCopy.tags)}`;

    // 使用 Clipboard API 拷贝到剪贴板
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            console.log('Item copied to clipboard:', textToCopy);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

/** 标签编辑完成后，把逗号分隔的字符串拆回数组，并同步 tagsText */
function onTagsChange(idx) {
    // 此时listData[idx].tags已经是最新值
    const text = listData[idx].tags;
    if (typeof text === 'string') {
        //转成数组
        const arr = text.split(',').map(s => s.trim()).filter(Boolean);

        let item = { ...listData[idx] }
        item.tags = arr
        // tagsText.value.splice(idx, 1, arr.join(', '))
        console.log('item:', item)
        console.log('Updated item:', listData[idx]);
        updateTagsOrTranslated(item);
    }

}

function updateTagsOrTranslated(item) {
    const url = `${import.meta.env.VITE_API_URL}/hn/set`
    let para = {
        type: 'info',
        key: item.story_id,
        story_id: item.story_id,
        translated: item.translated,
        tags: item.tags
    }
    let options = {
        method: 'POST', // 指定请求方法为 POST
        headers: {
            'Content-Type': 'application/json', // 设置请求头，指明发送的数据格式
        },
        body: JSON.stringify(para), // 将数据对象转换为 JSON 字符串
    }

    fetch(url, options)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json(); // 解析 JSON 数据
        })
        .then(data => {
            console.log('updateTagsOrTranslated:', data); // 处理解析后的数据
            srcData.length = 0
            data.forEach(item => {
                item.created_at = moment(item.created_at).format('MM-DD-YY HH:mm:ss')
                let title = item.title.trim()
                if (title.endsWith('died') || title.includes('passed away')) {
                    item.tags.push('讣告')
                    item.tags = item.tags.join(', ')
                    num++
                } else {
                    item.tags = item.tags.join(', ')
                    // console.log('item:', item)
                    srcData.push(item)
                }
            })
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error); // 处理错误
        });
}
</script>

<style>
.demo-loadmore-list .ant-list-item {
    cursor: pointer;
}

:deep(.ant-list-item-meta),
:deep(.ant-list-item-meta-title) {
    margin-block-end: 2px;
}
</style>
