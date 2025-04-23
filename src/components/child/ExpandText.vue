<template>
    <div>
        <span>

            <a-typography-text style="font-size: 16px;" @dblclick="toggleExpand"  :content="!isExpanded?text.slice(0, 195):text" />
            <!-- 统一的切换按钮 -->
            <a-typography-text v-if="text.length > 200" @click="toggleExpand" style="cursor: pointer; color: #1890ff">
                {{ isExpanded ? '收起' : '展开' }}
            </a-typography-text>
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
});

const isExpanded = ref(false);

function toggleExpand() {
    isExpanded.value = !isExpanded.value;
}
</script>