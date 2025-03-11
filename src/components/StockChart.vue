<template>
    <div class="market-dashboard">
        <!-- 第一排 -->
        <a-row :gutter="0" class="mb-4">
            <a-col :span="24">
                <a-card title="A股市场" :bodyStyle="{ padding: '12px' }">
                    <div class="market-content">
                        <!-- 左侧标签页 -->
                        <div class="market-tabs">
                            <div v-for="tab in marketTabs" :key="tab.key"
                                :class="['tab-item', { active: activeTab === tab.key }]" @click="activeTab = tab.key">
                                <h3>{{ tab.title }}</h3>
                                <div class="stat-container">
                                    <span v-for="stat in tab.stats" :key="stat.text" :class="stat.type">
                                        {{ stat.text }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- 右侧图表 -->
                        <div class="chart-container">
                            <BarChart :data="chartData" />
                        </div>
                    </div>
                </a-card>
            </a-col>
        </a-row>

        <!-- 第二排 -->
        <a-row :gutter="16">
            <a-col :span="6" v-for="chart in bottomCharts" :key="chart.title">
                <a-card>
                    <template #title>
                        <div class="chart-header">
                            <span>{{ chart.title }}</span>
                            <span class="price" :class="chart.trend">{{ chart.price }}</span>
                            <span class="change" :class="chart.trend">{{ chart.change }}</span>
                        </div>
                    </template>
                    <LineChart :data="chart.data" />
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BarChart from '@/components/charts/BarChart.vue';
import LineChart from '@/components/charts/LineChart.vue';

const activeTab = ref('1');

const marketTabs = [
    {
        key: '1',
        title: '大盘综述',
        stats: [
            { text: '3223涨', type: 'rise' },
            { text: '1966跌', type: 'fall' }
        ]
    },
    {
        key: '2',
        title: '涨跌分布',
        stats: [
            { text: '涨停：70只', type: 'rise' },
            { text: '跌停：34只', type: 'fall' }
        ]
    },
    {
        key: '3',
        title: '行业情况',
        stats: [
            { text: '今收益：0.89%', type: 'rise' }
        ]
    },
    {
        key: '4',
        title: '昨日复盘',
        stats: [
            { text: '上涨：23个', type: 'rise' },
            { text: '下跌：16个', type: 'fall' }
        ]
    },
    {
        key: '5',
        title: '市场资金',
        stats: [
            { text: '23.5亿流入', type: 'rise' },
            { text: '16.8亿流出', type: 'fall' }
        ]
    }
];

const chartData = ref([
    { value: 68, range: '跌停' },
    { value: 42, range: '-8%' },
    { value: 117, range: '-6%' },
    { value: 330, range: '-4%' },
    { value: 1409, range: '-2%' },
    { value: 2339, range: '0' },
    { value: 595, range: '2%' },
    { value: 256, range: '4%' },
    { value: 88, range: '6%' },
    { value: 137, range: '8%' },
    { value: 70, range: '涨停' }
]);

const lineChartData = ref([2196, 2180, 2175, 2170, 2168, 2172, 2174, 2176, 2174]);


const bottomCharts = ref([
    {
        title: '北证50(899050)',
        price: '1345.55',
        change: '+0.66%',
        trend: 'rise',
        data: []
    },
    // ... 其他图表数据
]);
</script>

<style scoped>
.market-dashboard {
    padding: 5px 0;
}

.mb-4 {
    margin-bottom: 16px;
}

.market-content {
    display: flex;
    gap: 16px;
    height: 240px;
}

.market-tabs {
    width: 180px;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.tab-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s;
    height: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.tab-item:hover {
    background: #f5f5f5;
}

.tab-item.active {
    background: #e6f7ff;
}

.tab-item h3 {
    margin: 0 0 4px;
    font-size: 13px;
    line-height: 1.2;
}

.stat-container {
    display: flex;
    gap: 8px;
    font-size: 12px;
}

.chart-container {
    flex: 1;
    height: 100%;
}

.chart-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.price {
    font-weight: bold;
}

.rise {
    color: #59b881;
}

.fall {
    color: #d75442;
}

.change.rise {
    color: #59b881;
}

.change.fall {
    color: #d75442;
}
</style>