<template>
    <div>
        <a-typography>
            <a-typography-text  strong :style="{ fontSize: '1.2em' }">{{ questionData?.question?.title }}</a-typography-text>
            <a-typography-paragraph>
                {{ questionData?.reaction?.answer_num }} 
                <a-typography-text type="secondary">个回答·</a-typography-text>
                
                {{ formatNumber(questionData?.reaction?.pv) }} 
                <a-typography-text type="secondary">浏览</a-typography-text>
            </a-typography-paragraph>
        </a-typography>

        <a-list item-layout="horizontal" size="large" :pagination="pagination" :data-source="listData">

            <template #renderItem="{ item }">
                <a-list-item key="item.title">
                    <template #actions>
                        <span v-for="{ icon, text } in item.actions" :key="icon">
                            <component :is="icon" style="margin-right: 8px" />
                            {{ text }}
                        </span>
                    </template>
                    <template #extra v-if="item.thumbnail_info.count > 0">
                        <img width="272" alt="logo" :src="item.thumbnail_info.thumbnails[0]" />
                    </template>
                    <a-list-item-meta :description="item.author ? item.author.headline : ''">
                        <template #title>
                            <a :href="item.name">{{ item.author.name }}</a>
                        </template>
                        <template #avatar><a-avatar :src="item.author.avatar_url" /></template>
                    </a-list-item-meta>
                    {{ item.excerpt.length > 150 ? item.excerpt.substring(0, 150) + '...' : item.excerpt }}
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';

let listData = reactive([]);
// for (let i = 0; i < 3; i++) {
//     listData.push({
//         href: 'https://www.antdv.com/',
//         title: `ant design vue part ${i}`,
//         author: { avatar_url: 'https://joeschmoe.io/api/v1/random' },
//         description:
//             'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//         content:
//             'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
//     });
// }
const pagination = {
    onChange: page => {
        console.log(page);
    },
    pageSize: 100,
};
const actions = [
    {
        icon: StarOutlined,
        text: '156',
    },
    {
        icon: LikeOutlined,
        text: '156',
    },
    {
        icon: MessageOutlined,
        text: '2',
    },
];

const route = useRoute();
const questionId = route.params.id;
const questionData = ref(null);

onMounted(() => {
    // 从 localStorage 获取数据
    const storedData = localStorage.getItem('questionData');
    if (storedData) {
        questionData.value = JSON.parse(storedData);
        // 获取数据后清除 localStorage，避免数据残留
        localStorage.removeItem('questionData');
    }
    // startGetData()
    fetchQuestionData();

    console.log('data is', questionId, questionData.value);
});

const startGetData = async () => {
    // initLoading.value = true; // Set loading state
    try {
        //http://localhost:8787/answer?id=633538248
        const response = await fetch('http://localhost:8787/question?id=' + questionId); // Replace with your API URL
        const data = await response.json();
        console.log('length:', data)
        data.map(item => {
            // let temp = item.reaction.new_pv+item.reaction.new_follow_num*1.5+item.reaction.new_upvote_num*1.2
            // let num = 0
            // if(item.reaction.new_answer_num>0){
            //     num = temp/item.reaction.new_answer_num
            // }
            // item.reaction.num = num
            // return item
        })
        // Assuming the data structure matches the expected format

    } catch (error) {
        console.error('Error fetching questions:', error);
    } finally {
        // initLoading.value = false; // Reset loading state
    }
};

const fetchQuestionData = async () => {
    // initLoading.value = true; // Set loading state
    try {
        //http://localhost:8787/answer?id=633538248
        const response = await fetch('http://localhost:8787/answer?id=' + questionId); // Replace with your API URL
        const data = await response.json();

        data.map(item => {
            let reaction = JSON.parse(item.reaction)
            let length = JSON.parse(item.reactions).length
            // console.log(reaction, length)
            Object.assign(item, reaction);

            let actions = [
                {
                    icon: StarOutlined,
                    text: item.thanks_count,
                },
                {
                    icon: LikeOutlined,
                    text: item.voteup_count,
                },
                {
                    icon: MessageOutlined,
                    text: item.comment_count,
                },
            ];
            item.actions = actions


            // let temp = item.reaction.new_pv+item.reaction.new_follow_num*1.5+item.reaction.new_upvote_num*1.2
            // let num = 0
            // if(item.reaction.new_answer_num>0){
            //     num = temp/item.reaction.new_answer_num
            // }
            // item.reaction.num = num
            // return item
        })
        // Assuming the data structure matches the expected format
        listData.length = 0
        listData.push(...data)
        console.log('listData', listData)
    } catch (error) {
        console.error('Error fetching questions:', error);
    } finally {
        // initLoading.value = false; // Reset loading state
    }
};

const formatNumber = (num) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num;
};
</script>