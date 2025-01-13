<!-- ChartjsLine.vue -->
<template>
    <div class="radio-group-container">
        <a-radio-group v-model:value="timeValue" button-style="solid" size="small" @change="changeTime">
            <a-radio-button value="utc">UTC</a-radio-button>
            <a-radio-button value="bj">北京</a-radio-button>
            <a-radio-button value="us">美东</a-radio-button>
        </a-radio-group>
    </div>
    <div class="chart-container">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
const timeValue = ref('a');
const loading = ref(false)
// const chartData = ref({
//     columns: ['时间', '最高价', '最低价', '最活跃', '最不活跃'],
//     rows: []
// })


const chartData = ref({
    labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
    datasets: [
        {
            label: '最高价',
            backgroundColor: '#f87979',
            data: []
        },
        {
            label: '最低价',
            backgroundColor: '#f87979',
            data: []
        },
        {
            label: '最活跃',
            backgroundColor: '#f87979',
            data: []
        },
        {
            label: '最冷静',
            backgroundColor: '#f87979',
            data: []
        },
    ]
})
const defaultData = ref({}), BJData = ref({}), USData = ref({})

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
            text: '月度销售趋势'
        }
    }
})

function changeTime() {

    switch (timeValue.value) {
        case 'bj':
            setChartData(BJData.value);
            break;
        case 'us':
            setChartData(USData.value);
            break;
        default: // utc
            setChartData(defaultData.value); // 使用原始 UTC 数据
            break;
    }

}

// 初始化24小时的统计数据
function initHourlyStats() {
    const stats = {}
    for (let i = 0; i < 24; i++) {
        const hour = String(i).padStart(2, '0')
        stats[hour] = {
            highest: 0,
            lowest: 0,
            mostActive: 0,
            leastActive: 0
        }
    }
    return stats
}

// 统计数据
function processData(data) {
    const hourlyStats = initHourlyStats()

    data.forEach(dayData => {
        // 统计最高价出现时间
        const highestHour = dayData.highest.time.split(':')[0]  // 只取小时部分
        hourlyStats[highestHour].highest++

        // 统计最低价出现时间
        const lowestHour = dayData.lowest.time.split(':')[0]
        hourlyStats[lowestHour].lowest++

        // 统计最活跃时间
        const mostActiveHour = dayData.mostActive.time.split(':')[0]
        hourlyStats[mostActiveHour].mostActive++

        // 统计最不活跃时间
        const leastActiveHour = dayData.leastActive.time.split(':')[0]
        hourlyStats[leastActiveHour].leastActive++
    })
    console.log('hourlyStats:', hourlyStats)
    
    for (let hour in hourlyStats) {
        defaultData.value[hour] = hourlyStats[hour]
        // 转换为北京时间（UTC+8）
        let BJTime = String((parseInt(hour) + 8) % 24).padStart(2, '0')
        BJData.value[BJTime] = hourlyStats[hour]

        // 转换为美东时间（UTC-4）
        let USTime = String((parseInt(hour) + 20) % 24).padStart(2, '0') // (24 - 4)
        USData.value[USTime] = hourlyStats[hour]
    }

    setChartData(hourlyStats)
    console.log('Updated chartData:', chartData.value) // 添加日志查看数据更新
}

function setChartData(hourlyStats) {
    // 更新图表数据
    const newChartData = {
        labels: [...chartData.value.labels],
        datasets: [
            {
                label: '最高价',
                backgroundColor: '#f87979',
                data: Array(24).fill(0).map((_, i) => {
                    const hour = String(i).padStart(2, '0')
                    return hourlyStats[hour].highest
                })
            },
            {
                label: '最低价',
                backgroundColor: '#4CAF50',
                data: Array(24).fill(0).map((_, i) => {
                    const hour = String(i).padStart(2, '0')
                    return hourlyStats[hour].lowest
                })
            },
            {
                label: '最活跃',
                backgroundColor: '#2196F3',
                data: Array(24).fill(0).map((_, i) => {
                    const hour = String(i).padStart(2, '0')
                    return hourlyStats[hour].mostActive
                })
            },
            {
                label: '最冷静',
                backgroundColor: '#FFC107',
                data: Array(24).fill(0).map((_, i) => {
                    const hour = String(i).padStart(2, '0')
                    return hourlyStats[hour].leastActive
                })
            },
        ]
    }
    // 整体替换 chartData 的值
    chartData.value = newChartData
}

// 修改图表配置
const chartSettings = {
    yAxisName: ['次数'],
    smooth: true
}

const chartExtend = {
    series: {
        label: {
            normal: {
                show: true
            }
        }
    },
    xAxis: {
        axisLabel: {
            rotate: 45
        }
    }
}

// 获取数据并处理
const fetchData = async () => {
    loading.value = true
    try {
        const url = `${import.meta.env.VITE_API_URL}/btc/data`
        console.log('url:', url)

        const response = await fetch(url)
        const data = await response.json()
        console.log('data:', data)
        processData(data.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchData()
})
</script>

<style>
.chart-container {
    height: 400px;
}

.radio-group-container {
    display: flex;
    justify-content: center;
    margin: 10px 0;
    /* 可选：添加上下间距 */
}
</style>