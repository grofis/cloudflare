<template>
    <a-typography-title :level="3">{{ title }}</a-typography-title>
    <a-typography-paragraph v-for="item in text" :key="item">{{ item }}</a-typography-paragraph>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, reactive, watch } from 'vue';

const route = useRoute();
const item = ref({});
const title = ref('');
const text = reactive([]);

onMounted(() => {
    const storedItem = localStorage.getItem('item');
    console.log('storedItem:', storedItem)
    if (storedItem) {
        let temp = JSON.parse(storedItem); // 解析JSON字符串为对象
        title.value = temp.value.title
        let source = temp.value.source
        if (source) {
            // 将所有的<br><br>替换为一个<br>
            source = source.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>');

            // 使用<br>分割字符串成数组
            const parts = source.split(/<br\s*\/?>/i);

            console.log(parts); // 输出分割后的数组

            text.push(...parts.map(part => part.trim()));
        }
    }
});


</script>