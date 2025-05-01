<template>
    <a-typography-title :level="3">{{ title }}</a-typography-title>

    <div style="display: flex; align-items: center;">
        <a-checkbox v-model:checked="showEnglish">英</a-checkbox>
        <a-checkbox v-model:checked="showChinese">中</a-checkbox>
        <a-typography-paragraph type="secondary" style="margin-left: 5px;margin-bottom: 0px;">
            {{ item?.value?.time ? item.value.time : '' }}
        </a-typography-paragraph>
    </div>
    <a-typography-paragraph v-for="(item, index) in text" :key="index">
        <a-typography-text style="font-size: 16px;" v-if="!showEnglish">{{ item }}</a-typography-text>
        <br>
        <a-typography-text style="font-size: 18px;" v-if="!showChinese">{{ trans[index] }}</a-typography-text>
    </a-typography-paragraph>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, reactive, watch } from 'vue';

const route = useRoute();
const item = ref({});
const title = ref('');
const text = reactive([]);
const trans = reactive([]);
const showEnglish = ref(false);
const showChinese = ref(false);
onMounted(() => {
    const storedItem = localStorage.getItem('item');
    // console.log('storedItem:', storedItem)
    if (storedItem) {
        let temp = JSON.parse(storedItem); // 解析JSON字符串为对象
        item.value = temp
        title.value = temp.value.title
        let source = temp.value.source
        if (source) {
            console.log('source:', typeof source)
            if (typeof source === 'string') {
                // 将所有的<br><br>替换为一个<br>
                source = source.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>');
            } else {
                source = source.join('<br>')
            }

            // 使用<br>分割字符串成数组
            const parts = source.split(/<br\s*\/?>/i);

            // console.log(parts); // 输出分割后的数组

            text.push(...parts.map(part => part.trim()));
        }

        let translated = temp.value.translated
        if (translated) {
            translated = translated.replace(/\n/g, '<br>');
            // 将所有的<br><br>替换为一个<br>
            translated = translated.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>');
            const parts = translated.split(/<br\s*\/?>/i);

            // console.log(parts); // 输出分割后的数组

            trans.push(...parts.map(part => part.trim()));
        }
    }
});


</script>