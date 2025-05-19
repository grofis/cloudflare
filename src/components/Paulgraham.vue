<template>
    <div>
        <div id="action_panel">
            <a-checkbox-group v-model:value="selectedRows" @change="rowChange">
                <a-checkbox value="0">第1栏</a-checkbox>
                <a-checkbox value="1">第2栏</a-checkbox>
                <a-checkbox value="2">第3栏</a-checkbox>
                <a-checkbox value="4">笔记</a-checkbox>
                <a-checkbox value="3">数据</a-checkbox>
            </a-checkbox-group>
            <a-button size="small" @click="setContent">确认</a-button>
            <a-button size="small" @click="scrollToIndex">阅读</a-button>
        </div>
        <div class="responsive-container">
            <context-holder />
            <br />
            <a-textarea v-model:value="mainInput" show-count :maxlength="1000000" style="flex: 1; margin-right: 0px;" />

            <br />
            <a-row>
                <a-col v-for="(column, index) in splitArticles" :key="index" v-if="rowsShow[0]" :span="rowsSpan[0]">
                    <a-list item-layout="horizontal" :data-source="column">
                        <template #renderItem="{ item }">
                            <a-list-item @click="handleItemClick(item)">
                                <a-list-item-meta>
                                    <template #title>
                                        <a target="_blank" :href="`https://paulgraham.com/${item.file}.html`">
                                            {{ `${item.index}. ${item.title}` }}
                                        </a>
                                    </template>
                                    <template #description>
                                        <span>
                                            <component :is="item.icon" :style="{ color: item.color }" />
                                            {{ `${item.file} ${item.translate}` }}
                                        </span>
                                    </template>
                                </a-list-item-meta>
                            </a-list-item>
                        </template>
                    </a-list>
                </a-col>
                <a-col :span="rowsSpan[1]">
                    <a-row>
                        <a-col :span="rowsSpan[2]" v-if="rowsShow[1]">
                            <a-typography-title :level="4">{{ articleData.title }}</a-typography-title>
                        </a-col>
                        <a-col :span="rowsSpan[3]" :offset="!rowsShow[0] && rowsSpan[3] == 15 ? offset[2] : 0"
                            v-if="rowsShow[2]">
                            <a-typography-paragraph :level="4">{{ articleData.date }}</a-typography-paragraph>
                        </a-col>
                    </a-row>
                    <a-row v-for="(item, index) in content" :key="index">
                        <a-col :span="rowsSpan[2]" v-if="rowsShow[1]" :style="{ order: colOrder[1] }">
                            <a-typography-paragraph lang="en" class="big-font">
                                {{ item }}
                            </a-typography-paragraph>

                        </a-col>
                        <a-col :span="rowsSpan[3]" :offset="!rowsShow[0] && rowsSpan[3] == 15 ? offset[2] : 0"
                            v-if="rowsShow[2]" :style="{ order: colOrder[2] }">
                            <template v-if="tooltips.find(tooltip => tooltip.index == index)">
                                <a-tooltip :title="tooltips.find(tooltip => tooltip.index == index).content"
                                    :overlay-style="{ color: 'red' }">

                                    <template v-if="links.find(link => link.index == index)">
                                        <a-tooltip :title="links.find(link => link.index == index).href"
                                            :overlay-style="{ color: 'red' }">
                                            <a-textarea lang="zh" :placeholder="item"
                                                :style="!rowsShow[1] && rowsShow[2] ? { fontSize: '20px' } : { fontSize: '18px' }"
                                                :value="textareaValues[index]"
                                                @update:value="value => updateTextarea(index, value)" auto-size>
                                            </a-textarea>
                                        </a-tooltip>
                                    </template>
                                    <template v-else>
                                        <a-textarea lang="zh" :placeholder="item"
                                            :style="!rowsShow[1] && rowsShow[2] ? { fontSize: '20px' } : { fontSize: '18px' }"
                                            :value="textareaValues[index]"
                                            @update:value="value => updateTextarea(index, value)" auto-size>
                                        </a-textarea>
                                    </template>

                                </a-tooltip>
                            </template>
                            <template v-else>
                                <template v-if="links.find(link => link.index == index)">
                                    <a-tooltip :title="`<a href='${links.find(link => link.index == index).href}'>${links.find(link => link.index == index).href}</a>`"
                                        :overlay-style="{ color: 'red' }">
                                        <a-textarea lang="zh" :placeholder="item"
                                            :style="!rowsShow[1] && rowsShow[2] ? { fontSize: '20px' } : { fontSize: '18px' }"
                                            :value="textareaValues[index]"
                                            @update:value="value => updateTextarea(index, value)" auto-size>
                                        </a-textarea>
                                    </a-tooltip>
                                </template>
                                <template v-else>
                                    <a-textarea lang="zh" :placeholder="item"
                                        :style="!rowsShow[1] && rowsShow[2] ? { fontSize: '20px' } : { fontSize: '18px' }"
                                        :value="textareaValues[index]"
                                        @update:value="value => updateTextarea(index, value)" auto-size>
                                    </a-textarea>
                                </template>
                            </template>
                        </a-col>
                        <a-col :span="rowsSpan[4]" v-if="rowsShow[4]" :style="{ order: colOrder[2] }">
                            <a-textarea lang="zh" :placeholder="textareaValues[index]"
                                :style="!rowsShow[1] && rowsShow[2] ? { fontSize: '20px' } : { fontSize: '18px' }"
                                @update:value="value => updateNoteTextarea(index, value)" auto-size>
                            </a-textarea>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
    </div>

</template>
<script setup>

import { ref, reactive, onMounted, h, defineComponent, computed, onUnmounted, nextTick } from 'vue';
import { UpOutlined, RightOutlined, CheckOutlined, StarOutlined } from '@ant-design/icons-vue';

import { message } from 'ant-design-vue';
const [messageApi, contextHolder] = message.useMessage();


const articles = ref([])
const articleData = ref({})
const remark = ref('')
const content = ref([]);
const textareaValues = ref([]);
const mainInput = ref('')

const icons = ref({}); // 用于存储导入的图标
onMounted(() => {
    // getLocalData()
    // getWebInfo()


    getTitles().then(() => {
        getHistory()
    });

    // 添加滚动事件监听
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    // 初始加载时也执行一次，获取初始中心索引
    nextTick(() => {
        getCenterIndex()
        handleScroll();
    });
})

// 在beforeUnmount中移除滚动监听
onUnmounted(() => {
    window.removeEventListener('scroll', throttledScrollHandler);

    // 保存最终的中心索引
    if (articleData.value && articleData.value.title) {
        const key = `scroll_${articleData.value.title.replace(/\s+/g, '_')}`;
        localStorage.setItem(key, currentCenterIndex.value.toString());
    }
});

const getFileFromUrl = () => {
    //从浏览器中获得文章参数
    const url = window.location.href;
    const urlObj = new URL(url); // 创建 URL 对象
    const params = new URLSearchParams(urlObj.search); // 获取查询参数

    // 从浏览器地址中组装参数
    // file的优先级高于index
    const file = params.get('file'); // 获取 param1 的值
    const index = params.get('index'); // 获取 param2 的值

    let para = { title: 'Writes and Write-Nots', index: index, file: file, type: 'content' }
    if (file && file.length > 0) {
        articles.value.forEach(item => {
            if (item.file === file) {
                para = item
            }
        })
    } else if (index && index.length > 0) {
        articles.value.forEach(item => {
            if (item.index === index) {
                para = item
            }
        })
    } else {
        para = { title: 'How to Do Great Work', isLocal: true, index: 1, file: 'greatwork', type: 'content' }
    }
    console.log('para is:', JSON.stringify(para))
    //通过isLocal判断文章是否需要从网络中获取
    if (para.isLocal) {
        para.type = 'content'
        getArticleContent(para)
    } else {
        para.full_title = para.title
        getWebInfo(para)
    }
}

//栏目数量变化
const selectedRows = ref(['0', '1', '2', '3', '4'])
const rowsShow = reactive([true, true, true, true, false])
const rowsSpan = reactive([6, 18, 12, 12, 0])
const offset = reactive([0, 0, 4])
const rowChange = () => {
    // 根据选中的值更新显示状态
    for (let i = 0; i < 5; i++) {
        rowsShow[i] = selectedRows.value.includes(i.toString())
    }
    //标题栏是否选中，影响第二和第三栏
    if (!rowsShow[0]) {
        rowsSpan[1] = 24
    } else {
        rowsSpan[1] = 18
    }
    console.log('rows show:', rowsShow)
    // 更新宽度占比
    if (rowsShow[1] && !rowsShow[2]) {
        // rowsSpan[0] = 6
        rowsSpan[2] = 24
        rowsSpan[3] = 0
        rowsShow[3] = false
    } else if (!rowsShow[1] && rowsShow[2]) {
        // rowsSpan[0] = 0
        rowsSpan[2] = 0
        rowsSpan[3] = 24
        rowsSpan[4] = 24
        rowsShow[3] = true
    } else {
        // rowsSpan[0] = 6
        rowsSpan[2] = 12
        rowsSpan[3] = 12
    }

    if (!rowsShow[1] && !rowsShow[2] && rowsShow[0]) {
        rowsSpan[0] = 8
    }

    if (rowsShow[1] || rowsShow[2]) {
        rowsSpan[0] = 6
    }

    if (!rowsShow[0] && !rowsShow[1] && rowsShow[3]) {
        rowsSpan[0] = 8
    }
}

//用于动态地拆分三列
const splitArticles = computed(() => {
    if (rowsShow[0] && !rowsShow[1] && !rowsShow[2]) {
        // 将 articles 拆分成三列
        const chunkSize = Math.ceil(articles.value.length / 3);
        return [
            articles.value.slice(0, chunkSize), // 第一列
            articles.value.slice(chunkSize, chunkSize * 2), // 第二列
            articles.value.slice(chunkSize * 2) // 第三列
        ];
    }
    return [articles.value]; // 默认返回原始数据
});

const setHistory = async (para) => {
    const url = `${import.meta.env.VITE_API_URL}/paul/history/set`
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

    // 使用 DOM API 解析 HTML
    const result = await response.json();
    console.log('result is:', result)
    return result
}

const setInfo = async (para) => {
    const url = `${import.meta.env.VITE_API_URL}/paul/set`
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

    // 使用 DOM API 解析 HTML
    const result = await response.json();
    console.log('result is:', result)
    return result
}

//获取侧边栏的标题
const getTitles = async () => {
    const url = `${import.meta.env.VITE_API_URL}/paul/get`
    // 要发送的数据
    const para = {
        key: 'titles'
    };
    let result = await getData(para)
    result = result.map((item, index) => {

        return {
            index: index + 1,
            title: item[0], translate: item[1], file: item[2], isLocal: item.length > 2 ? item[3] : false,
            isTranslated: item.length > 3 ? item[4] : false,
            icon: item.length > 5 ? item[5] : 'RightOutlined', color: item.length > 6 ? item[6] : '#4CAF50'
        }
    })
    console.log('titles:', result)
    articles.value = result
}

// 在 script 部分添加
const updateTextarea = (index, value) => {
    const newValues = [...textareaValues.value];
    newValues[index] = value;
    textareaValues.value = newValues;
};

const noteTextareaValues = ref([])
const updateNoteTextarea = (index, value) => {
    const newValues = [...noteTextareaValues.value];
    newValues[index] = value;
    noteTextareaValues.value = newValues;
};

const setContent = async () => {
    if (mainInput.value.length > 1) {
        // 检查 value="3" 的复选框是否被选中
        // const isDataSelected = selectedRows.value.includes('3');
        // if (isDataSelected) {
        //     setData()
        //     return
        // }
        try {
            //先设置输入框的格式
            let temp = JSON.parse(mainInput.value)
            articleData.value = { title: temp.title, date: temp.date }
            // 设置到组件状态
            content.value = temp.content;
            console.log('paul result:', articleData);
            textareaValues.value = temp.translate;
            mainInput.value = ''
        } catch (error) {
            messageApi.error('输入框中的内容格式不正确!');
        }
        return
    }

    try {
        // 检查 textareaValues 是否有内容
        console.log('textareaValues:', textareaValues.value); // 先打印看看值

        if (!textareaValues.value || textareaValues.value.length === 0 ||
            textareaValues.value.every(val => !val)) {
            console.warn('No textarea values found');
            // return;
        }

        // 确保 articleData.value 是一个对象
        if (!articleData.value) {
            articleData.value = {};
        }

        articleData.value.remark = remark.value;
        articleData.value.content = content.value;
        articleData.value.translate = [...textareaValues.value]; // 使用展开运算符创建一个新数组

        console.log('articleData to be sent:', JSON.stringify(articleData.value));
        let para = {
            title: articleData.value.title,
            type: 'content',
            isLocal: true,
            isTranslated: false,
            value: articleData.value
        }
        console.log('para is:', para)
        if (mainInput.value.length < 1) {
            articleData.value.file_name = articleData.value.title.replace(/ /g, '_') + '.json'
            mainInput.value = JSON.stringify(articleData.value)
        }
        const result = await setInfo(para);
        console.log('translate saved result:', result);

    } catch (error) {
        console.error('Error fetching question details:', error);
    }
}

const setData = async () => {
    try {
        // 尝试将输入转换为有效的 JSON 格式
        let input = mainInput.value.trim();

        // 检查输入是否是有效的 JSON 格式
        // if (input.startsWith('{') && input.endsWith('}')) {
        //     // 替换单引号为双引号，并将 key 转换为双引号格式
        //     input = input
        //         .replace(/(\w+):/g, '"$1":') // 将 key 转换为双引号格式
        //         .replace(/'/g, '"'); // 将所有单引号替换为双引号
        // } else {
        //     throw new Error('Invalid JSON format');
        // }

        let para = JSON.parse(input);
        let value = para['value']

        let temp = []
        value.forEach(item => {
            if (item['icon'].startsWith('#')) {
                item['icon'] = 'WarningOutlined'
                item['color'] = '#FFA500'
                temp.push(item)
            }
        })
        console.log('icon is not icon:', temp)

        value = value.map(item => {
            return [
                item.title,
                item.translate,
                item.file,
                item.isLocal ? item.isLocal : false,
                item.isTranslated ? item.isTranslated : false,
                item.icon,
                item.color
            ]
        })
        para['value'] = value

        // 检查 key 和 value 的长度
        if (para['key'] && para['value'] && para['key'].length > 1 && para['value'].length > 1) {
            console.log('para is:', para)
            const result = await setInfo(para);
            console.log('translate saved result:', result);
            messageApi.info(result.message);
        } else {
            messageApi.info('输入框中的内容格式不正确!');
        }
    } catch (error) {
        console.error('Error fetching question details:', error);
    }
}

let tooltips = ref([])
let links = ref([])
//从kv中获取文章详情
const getArticleContent = async (para) => {
    para.type = 'content'
    console.log('para is:', para)
    let result = await getData(para)
    articleData.value = { title: result.title, date: result.date, file: para.file }
    // 设置到组件状态
    content.value = result.content;
    console.log('paul result:', articleData);
    textareaValues.value = result.translate;
    tooltips.value = []
    // 提取脚注
    result.translate.forEach((item, index) => {
        // 查找脚注标记，例如 [5] 或 [4]
        const markerRegex = /\[(\d+)\]/g;
        const matches = [...item.matchAll(markerRegex)];

        if (matches.length > 0) {
            // 获取每个脚注标记
            for (const match of matches) {
                const footnoteMarker = match[0]; // 例如 [5]

                // 查找对应的脚注文本
                let footnoteText = null;
                for (let i = result.translate.length - 1; i >= 0; i--) {
                    if (result.translate[i].startsWith(footnoteMarker)) {
                        footnoteText = result.translate[i];
                        break;
                    }
                }

                if (footnoteText) {
                    let tooltip = {
                        index: index,
                        marker: footnoteMarker,
                        content: footnoteText,
                        position: match.index
                    };

                    tooltips.value.push(tooltip);
                }
            }
        }

        // 新增：查找 (X.html) 结构
        const htmlRegex = /\(([^)]+\.html)\)/g;
        const htmlMatches = [...item.matchAll(htmlRegex)];

        if (htmlMatches.length > 0) {
            for (const match of htmlMatches) {
                const htmlFile = match[1]; // 提取 X.html
                console.log(`Found HTML file: ${htmlFile}`);
                // 这里可以对 htmlFile 进行进一步处理
                let temp = {
                    index: index,
                    href: htmlFile.replace('.html', ''),
                    position: match.index
                }
                links.value.push(temp)
            }
        }

    });

    console.log('links is:', links.value)
}

//获取数据的网络请求包装
const getData = async (para) => {
    try {
        const url = `${import.meta.env.VITE_API_URL}/paul/get`

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

        // 使用 DOM API 解析 HTML
        const result = await response.json();
        console.log('result is:', result)

        return result
    } catch (error) {
        console.error('Error fetching question details:', error);
    }
};

//本地没有存储时从网络中获取内容
const getWebInfo = async (para) => {
    try {
        // para = { title: 'notnot', full_title: 'notnot' }
        const url = `${import.meta.env.VITE_API_URL}/paul/web`
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

        // 使用 DOM API 解析 HTML
        const result = await response.text();
        console.log('result is:', result)

        // 清理多余的转义字符
        const cleanedResult = result.replace(/\\\"/g, '"'); // 替换 \" 为 "

        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanedResult, 'text/html');

        // 首先获取tbody元素作为查询范围
        const tbodyElement = doc.querySelector('body > table > tbody > tr > td:nth-child(3) > table:nth-child(4) > tbody');
        if (!tbodyElement) {
            console.error('找不到tbody元素');
            return;
        }

        // 获取tbody中的最后一个td元素
        const lastTdElement = tbodyElement.querySelector('td:last-of-type');
        if (!lastTdElement) {
            console.error('找不到tbody中的最后一个td元素');
            return;
        }
        console.log('lastTdElement is:', lastTdElement)


        // 在tbody范围内获取标题
        // const titleElement = lastTdElement.querySelector('img');
        // const title = titleElement ? titleElement.getAttribute('alt') : '';
        // console.log('title is:', titleElement, title);

        // 在最后一个td元素下查找font元素
        let fontElement = lastTdElement.querySelector('font');
        if (!fontElement) {
            console.error('找不到font元素');
            return;
        }

        // 获取日期 - 通常是font标签内的第一个文本节点
        let fontContent = fontElement.innerHTML;
        console.log('fontContent length is:', fontContent.length)
        if (fontContent.length < 500) {

            fontElement = lastTdElement.querySelector('p>font')
            fontContent = fontElement.innerHTML
            message.info('内容太少，重新获取' + fontContent.length)
        }
        const dateMatch = fontContent.match(/^([A-Za-z]+\s+\d{4})<br><br>/);
        const date = dateMatch ? dateMatch[1] : '';

        // 分割段落
        const paragraphs = fontContent
            .replace(/^[A-Za-z]+\s+\d{4}<br><br>/, '') // 移除日期部分
            .split('<br><br>')
            .map(p => {
                // 替换内容中的\n为空格
                p = p.replace(/\\n/g, ' '); // 替换 \n 为一个空格

                // 保留链接但清理HTML标签
                return p.replace(/<a\s+href="([^"]+)">\s*<u>([^<]+)<\/u>\s*<\/a>/g, '$2 ($1)')
                    .replace(/<[^>]+>/g, '')
                    .trim();
            })
            .filter(p => p.length > 0); // 过滤空段落

        // 创建结果对象
        articleData.value = {
            title: para.full_title.trim(),
            date: date
        };

        // 设置到组件状态
        content.value = paragraphs;
        console.log('paul result:', articleData);
        textareaValues.value = paragraphs.map(() => '');
    } catch (error) {
        console.error('Error fetching question details:', error);
    }
};

const handleItemClick = (item) => {
    // 处理点击事件
    console.log('Clicked item:', item);

    if (item.isLocal) {
        let para = item
        para.type = 'content'
        getArticleContent(para)
    } else {
        let para = item
        para.full_title = item.title
        getWebInfo(para)
    }
}

/**
 * 获取当前屏幕中垂直居中的 a-textarea 索引
 * @returns {Number} 居中的 textarea 索引
 */
const getCenterIndex = () => {
    // 获取视口高度和中心点位置
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    console.log('视口信息:', { 高度: viewportHeight, 中心点: viewportCenter });

    let closestIndex = 0;
    let minDistance = Infinity;

    // 获取所有 a-textarea 元素
    const textareas = document.querySelectorAll('textarea');
    console.log('找到textarea元素数量:', textareas.length);

    // 检查选择器是否正确
    const allTextareas = document.querySelectorAll('textarea');
    console.log('所有textarea标签数量:', allTextareas.length);

    const antTextareas = document.querySelectorAll('.ant-input');
    console.log('ant-input类的元素数量:', antTextareas.length);

    // 如果没有找到元素，提前返回
    if (textareas.length === 0) {
        console.error('没有找到.textarea元素，请检查选择器');
        return 0;
    }

    // 遍历并详细打印每个元素的位置信息
    textareas.forEach((textarea, index) => {
        // 获取元素的位置信息
        const rect = textarea.getBoundingClientRect();
        // 计算元素中心点
        const elementCenter = rect.top + (rect.height / 2);
        // 计算与视口中心的距离
        const distance = Math.abs(elementCenter - viewportCenter);

        // 更新最近的元素
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    console.log('最终确定的中心元素索引:', closestIndex, '最小距离:', minDistance);

    // 从数据中获取相应索引的内容
    let centerText = '';
    // 如果在textareaValues中有值，优先使用它
    if (textareaValues.value && textareaValues.value[closestIndex]) {
        centerText = textareaValues.value[closestIndex];
    }
    console.log('中心元素文本内容:', centerText ? centerText.substring(0, 30) + '...' : '无内容');
    let para = {
        title: articleData.value.title,
        type: 'history',
        file: articleData.value.file,
        index: closestIndex
    }
    // const result = await setInfo(para);
    // setHistory(para).then(result => {
    //     console.log('history result:', result);
    // })
    console.log('history para:', para);

    return closestIndex;
};

// 添加节流函数
const throttle = (fn, delay) => {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
};

// 保存当前中心索引的变量
const currentCenterIndex = ref(0);
// 定义滚动监听函数
const handleScroll = () => {
    const index = getCenterIndex();
    // if (index !== currentCenterIndex.value) {
    //     currentCenterIndex.value = index;
    //     console.log('滚动监测 - 当前中心索引变化为:', index);

    //     // 可以在这里添加其他操作，比如保存到localStorage
    //     const key = `scroll_${articleData.value.title?.replace(/\s+/g, '_') || 'current'}`;
    //     localStorage.setItem(key, index.toString());
    // }
};

// 创建节流版本的滚动监听函数 (每200ms最多执行一次)
const throttledScrollHandler = throttle(handleScroll, 60000);
// 滚动到指定索引的函数
const scrollToIndex = () => {
    try {

        // 使用示例
        // fetchData(url, options)
        //     .then(data => {
        //         // 在这里处理返回的数据
        //         console.log('Fetched data:', data);
        //         let index = data.index
        //         if (index >= 0) {
        //             // rowsShow[0] = false
        //             // rowsShow[1] = false
        //             // rowsShow[2] = false
        //             // rowsShow[3] = true

        //             // 获取所有textarea元素
        //             const textareas = document.querySelectorAll('textarea');  // 确保使用正确的选择器
        //             console.log('textareas is:', textareas.length);
        //             if (index < textareas.length) {
        //                 // 滚动到目标元素位置
        //                 textareas[index].scrollIntoView({
        //                     behavior: 'smooth',
        //                     block: 'center'
        //                 });
        //                 console.log(`已滚动到索引 ${index} 位置`);
        //             } else {
        //                 console.warn(`索引 ${index} 超出范围，最大索引为 ${textareas.length - 1}`);
        //             }
        //         }
        //     });

    } catch (error) {
        console.error('Error fetching question details:', error);
    }


};

const getHistory = async () => {
    const url = `${import.meta.env.VITE_API_URL}/paul/history`
    let para = { file: 'greatwork' }
    let options = {
        method: 'POST', // 指定请求方法为 POST
        headers: {
            'Content-Type': 'application/json', // 设置请求头，指明发送的数据格式
        },
        body: JSON.stringify(para), // 将数据对象转换为 JSON 字符串
    }
    //获取历史的函数
    const fetchData = (url, options) => {
        return fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                console.log('result is:', result);
                return result;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // 可以在这里处理错误，比如显示错误信息
            });
    };
    fetchData(url, options)
        .then(data => {
            console.log('history result:', data);
            let last = data.pop()
            console.log('last is:', last)
            getArticleContent(last)
        })
}

//列顺序
const colOrder = reactive([0, 1, 2])

</script>
<style scoped>
:deep(.ant-input) {
    padding: 0px;
    margin-bottom: 0.9em;
    border-width: 0.5px;
    border-style: dashed;
    border-color: #A9d9d9;
    border-radius: 2px;
    background-color: transparent;
}

:deep(.ant-list .ant-list-item) {
    padding: 2px 2px;
}

.fixed-button {
    position: fixed;
    bottom: 20px;
    /* 距离底部20px */
    right: 20px;
    /* 距离右侧20px */
    z-index: 1000;
    /* 确保按钮在其他内容之上 */
}

.big-font[lang="en"] {
    font-size: 18px;
}

.big-font[lang="zh"] {
    font-size: 16px;
}

.responsive-container {
    position: absolute;
    /* 或者使用 fixed，根据需求选择 */
    left: 50%;
    /* 将左边距设置为 50% */
    transform: translateX(-50%);
    /* 向左移动自身宽度的一半，实现居中 */
    padding: 0 20px;
    /* 两侧填充 */
    box-sizing: border-box;
    background: #F3E9D4;


    /* 默认宽度（小屏幕） */
    width: 100%;
    max-width: 1000px;
}

#action_panel {
    position: fixed;
    left: 0;
    top: 50vh;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    z-index: 1000;
    max-width: 120px;
    /* 使用 clip-path 创建梯形效果 */
    clip-path: polygon(0 0, 80% 0, 100% 10%, 100% 90%, 80% 100%, 0 100%);
}

/* 针对复选框和按钮的样式 */
#action_panel .ant-checkbox-wrapper,
#action_panel .ant-btn {
    margin-bottom: 8px;
    /* 元素之间的间距 */
}

#action_panel .ant-btn {
    width: 100%;
    /* 按钮宽度占满容器 */
}

/* 复选框组垂直排列 */
#action_panel .ant-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* 中等屏幕 */
@media screen and (min-width: 168px) {
    .responsive-container {
        width: 100%;
    }
}

/* 超大屏幕 */
@media screen and (min-width: 800px) {
    .responsive-container {
        width: 800px;
        max-width: 800px;
    }
}
</style>