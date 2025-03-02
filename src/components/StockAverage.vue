<template>
    <a-card>
        <svg width="400" height="400">
            <!-- 画 AB 线段 -->
            <line :x1="A.x" :y1="A.y" :x2="B.x" :y2="B.y" style="stroke:black;stroke-width:1" />
            <!-- A点标注 -->
            <text :x="A.x - 25" :y="A.y + 10" style="font-size: 12px;">{{ '6:' + aver6 }}</text>
            <!-- B点标注 -->
            <text :x="B.x - 20" :y="B.y - 5" style="font-size: 12px;">{{ '5:' + aver5 }}</text>

            <!-- 画 CD 线段 -->
            <line :x1="C.x" :y1="C.y" :x2="D.x" :y2="D.y" style="stroke:black;stroke-width:1" />
            <!-- C点标注 -->
            <text :x="C.x - 25" :y="C.y + 10" style="font-size: 12px;">{{ '11:' + aver11 }}</text>
            <!-- D点标注 -->
            <text :x="D.x - 20" :y="D.y - 5" style="font-size: 12px;">{{ '10:' + aver10 }}</text>
        </svg>
    </a-card>
</template>

<script setup lang="jsx">
import { h, ref, onMounted } from 'vue'

const loading = ref(false);
const data = ref([]);
// 定义四个点的坐标
const A = ref({ x: 0, y: 0 });
const B = ref({ x: 0, y: 0 });
const C = ref({ x: 0, y: 0 });
const D = ref({ x: 0, y: 0 });

const aver5 = ref(0);
const aver6 = ref(0);
const aver10 = ref(0);
const aver11 = ref(0);

// 将数据点转换为SVG坐标
const updatePoints = (result) => {
    if (!result) return;

    // SVG画布的尺寸
    const svgWidth = 400;
    const svgHeight = 400;
    const padding = 50; // 边距

    // 找出最大最小值以确定缩放比例
    const values = [result.aver5, result.aver6, result.aver10, result.aver11];
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const scale = (svgHeight - 2 * padding) / (maxVal - minVal);

    // 计算y坐标（注意SVG的y轴是向下的，所以需要反转）
    const getY = (val) => svgHeight - padding - (val - minVal) * scale;

    // 设置四个点的坐标
    A.value = { x: padding, y: getY(result.aver6) };
    B.value = { x: svgWidth - padding, y: getY(result.aver5) };
    C.value = { x: padding, y: getY(result.aver11) };
    D.value = { x: svgWidth - padding, y: getY(result.aver10) };

    // 更新均值数据
    aver5.value = result.aver5;
    aver6.value = result.aver6;
    aver10.value = result.aver10;
    aver11.value = result.aver11;
}

const fetchData = async () => {
    loading.value = true;
    try {
        const url = `${import.meta.env.VITE_API_URL}/stock/right`;
        console.log('url:', url);
        const response = await fetch(url);
        const result = await response.json();
        console.log('data:', result);

        // 更新SVG坐标点
        updatePoints(result);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchData();
})
</script>

<style scoped>
:deep(.rise-text) {
    color: #ff4d4f;
}

:deep(.fall-text) {
    color: #52c41a;
}

:deep(.ant-table-thead > tr > th) {
    white-space: normal;
    text-align: center;
}
</style>