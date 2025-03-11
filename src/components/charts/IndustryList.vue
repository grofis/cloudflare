<template>
    <div class="industry-container">
        <a-space direction="vertical" style="width: 100%" :size="16">
            <!-- 最近浏览 -->
            <div class="recent-view">
                <span class="label">最近浏览：</span>
                <a-space>
                    <a-tag v-for="item in recentViews" :key="item.id" color="blue" style="cursor: pointer">
                        {{ item.name }}
                    </a-tag>
                </a-space>
            </div>

            <!-- 筛选条件 - 改为纵向排列 -->
            <div class="filter-section">
                <a-space direction="vertical" style="width: 100%">
                    <div class="filter-item">
                        <span class="filter-label">板块类别：</span>
                        <a-radio-group v-model:value="category" @change="handleFilterChange">
                            <a-radio-button value="0">全部</a-radio-button>
                            <a-radio-button value="001002">行业</a-radio-button>
                            <a-radio-button value="001003">概念</a-radio-button>
                        </a-radio-group>
                    </div>

                    <div class="filter-item">
                        <span class="filter-label">排序类别：</span>
                        <a-radio-group v-model:value="sortType" @change="handleFilterChange">
                            <a-radio-button value="syl">按涨幅</a-radio-button>
                            <a-radio-button value="zjlr">按资金流入</a-radio-button>
                        </a-radio-group>
                    </div>

                    <div class="filter-item">
                        <span class="filter-label">阶段：</span>
                        <a-radio-group v-model:value="timeRange" @change="handleFilterChange">
                            <a-radio-button value="D">实时</a-radio-button>
                            <a-radio-button value="W">近1周</a-radio-button>
                            <a-radio-button value="M">近1月</a-radio-button>
                            <a-radio-button value="Q">近3月</a-radio-button>
                            <a-radio-button value="Y">近1年</a-radio-button>
                            <a-radio-button value="SY">今年来</a-radio-button>
                        </a-radio-group>
                    </div>
                </a-space>
            </div>

            <!-- 行业列表 - 改为网格布局 -->
            <div class="industry-grid">
                <a-card v-for="(industry, index) in industries" :key="industry.id" :class="'industry-card'" @click="handleIndustryClick(industry)"
                    :style="getCardStyle(industry.rate, index)" hoverable>
                    <div class="industry-card-title">{{ industry.name }}</div>
                    <span>{{ industry.rate }}%</span>
                </a-card>
            </div>
        </a-space>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const category = ref('0');
const sortType = ref('syl');
const timeRange = ref('Y');

const recentViews = ref([
    { id: 'BK000161', name: '军工电子' },
    { id: 'BK000054', name: '半导体' },
    { id: 'BK000373', name: 'Chiplet' },
    { id: 'BK000164', name: 'IT服务' },
    { id: 'BK000291', name: '5G' },
]);

const industries = ref([]);

const handleFilterChange = () => {
    fetchIndustryData();
};

const getColorClass = (rate) => {
    return rate >= 0 ? 'increase' : 'decrease';
};

let date = ref('')
const fetchIndustryData = async () => {
    let url = `${import.meta.env.VITE_API_URL}/fund/industry/keys`;
    let response = await fetch(url);
    let result = await response.json();
    date.value = result.data


    url = `${import.meta.env.VITE_API_URL}/fund/industry/data?date=${date.value}&type=${timeRange.value}`;
    console.log(date.value, url)
    response = await fetch(url);
    result = await response.json();

    let arr = result.map(item => {
        return {
            id: item[0],
            name: item[1],
            rate: item[2]
        }
    }).sort((a, b) => b.rate - a.rate)
    industries.value = arr
    console.log(arr)
    
};

onMounted(() => {
    fetchIndustryData();
});

const getCardStyle = (rate, index) => {
    const totalItems = industries.value.length;
    const positiveCount = industries.value.filter(item => item.rate >= 0).length;
    

    if (rate >= 0) {
        // 涨幅部分保持不变
        const position = index / positiveCount; // 在正值区间内的相对位置
        // 涨幅：从深红(fe3b3d)到浅红(ffd7d8)
        let r, g, b;
        
        // 将红色分成4个阶梯 (0-0.1, 0.1-0.3, 0.3-0.6, 0.6-1.0)
        if (position <= 0.1) {  // 最深红区间
            const p = position / 0.1;
            r = 254;
            g = Math.floor(59 + (80 - 59) * p);
            b = Math.floor(61 + (82 - 61) * p);
        } else if (position <= 0.3) {  // 次深红区间
            const p = (position - 0.1) / 0.2;
            r = 254;
            g = Math.floor(80 + (120 - 80) * p);
            b = Math.floor(82 + (122 - 82) * p);
        } else if (position <= 0.6) {  // 次浅红区间
            const p = (position - 0.3) / 0.3;
            r = 254;
            g = Math.floor(120 + (170 - 120) * p);
            b = Math.floor(122 + (172 - 122) * p);
        } else {  // 最浅红区间
            const p = (position - 0.6) / 0.4;
            r = 255;
            g = Math.floor(170 + (215 - 170) * p);
            b = Math.floor(172 + (216 - 172) * p);
        }

        return {
            backgroundColor: `rgb(${r}, ${g}, ${b})`,
            color: position <= 0.1 ? '#fff' : '#000',
            border: 'none'
        };
    } else {
        // 跌幅：从浅绿(cbe8d2)到深绿(008d25)
        // 计算在负值区间内的相对位置
        const negativeIndex = index - positiveCount;
        const negativeCount = totalItems - positiveCount;
        const position = negativeIndex / negativeCount; // 在负值区间内的相对位置
        
        let r, g, b;
        
        // 将绿色分成4个阶梯 (0-0.4, 0.4-0.7, 0.7-0.9, 0.9-1.0)
        if (position <= 0.4) {  // 最浅绿区间
            const p = position / 0.4;
            r = Math.floor(203 - (203 - 150) * p);
            g = Math.floor(232 - (232 - 220) * p);
            b = Math.floor(210 - (210 - 180) * p);
        } else if (position <= 0.7) {  // 次浅绿区间
            const p = (position - 0.4) / 0.3;
            r = Math.floor(150 - (150 - 100) * p);
            g = Math.floor(220 - (220 - 190) * p);
            b = Math.floor(180 - (180 - 120) * p);
        } else if (position <= 0.9) {  // 次深绿区间
            const p = (position - 0.7) / 0.2;
            r = Math.floor(100 - (100 - 50) * p);
            g = Math.floor(190 - (190 - 160) * p);
            b = Math.floor(120 - (120 - 80) * p);
        } else {  // 最深绿区间
            const p = (position - 0.9) / 0.1;
            r = Math.floor(50 - (50 - 0) * p);
            g = Math.floor(160 - (160 - 141) * p);
            b = Math.floor(80 - (80 - 37) * p);
        }

        return {
            backgroundColor: `rgb(${r}, ${g}, ${b})`,
            color: position >= 0.9 ? '#fff' : '#000',
            border: 'none'
        };
    }
};

const handleIndustryClick = (industry) => {
    console.log(industry)
    let url = `https://fund.eastmoney.com/ztjj/#!syl/${timeRange.value}/curr/${industry.id}-${industry.name}/fst/DESC`
    window.open(url, '_blank')
}
</script>

<style scoped>
.industry-container {
    padding: 24px;
}

.filter-section {
    background: #fafafa;
    padding: 16px;
    border-radius: 4px;
}

.filter-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.filter-item:last-child {
    margin-bottom: 0;
}

.filter-label {
    min-width: 80px;
    color: rgba(0, 0, 0, 0.85);
}

.industry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
}

:deep(.ant-card) {
    border-radius: 2.5px;
}

.industry-card {
    text-align: center;
}

:deep(.ant-card .ant-card-head) {
    min-height: 30px;
}

:deep(.ant-card .ant-card-body) {
    padding: 0px;
    border-radius: 0 0 0px 0px;
}

:deep(.ant-card-head-title) {
    text-align: center;
    padding: 8px 0;
}

.card-extra {
    display: block;
}

@media (min-width: 1600px) {
    .industry-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 1599px) and (min-width: 1200px) {
    .industry-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 1199px) and (min-width: 992px) {
    .industry-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 991px) and (min-width: 768px) {
    .industry-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 767px) {
    .industry-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>