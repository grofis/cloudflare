<template>
    <div>
        <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
                {{ selectedCoin ? selectedCoin.name : 'Select Coin' }}
                <DownOutlined />
            </a>
            <template #overlay>
                <a-menu @click="handleMenuClick">
                    <a-menu-item v-for="coin in topCoins" :key="coin.id">
                        <div class="coin-item">
                            <img width="10px" :src="coin.image" :alt="coin.name" class="coin-icon" />
                            <span>{{ coin.name }}</span>
                            <span class="coin-symbol">({{ coin.symbol.toUpperCase() }})</span>
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
            {{ selectedDays ? `${selectedDays} 天` : '选择时间范围' }}
            <DownOutlined />
        </a>
        <template #overlay>
            <a-menu @click="handleDaysChange">
                <a-menu-item v-for="option in timeOptions" :key="option.value">
                    <span>{{ option.label }}</span>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
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
import { DownOutlined } from '@ant-design/icons-vue';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

let chartData = ref({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 39, 10, 40, 39, 80, 40]
        }
    ]
})
let chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false
})

let selectedTime = ref('24')
const loading = ref(false)
// 存储币种列表和选中的币种
const topCoins = ref([])
const selectedCoin = ref(null)

// 获取市值排名前10的币种数据
async function fetchTopCoinsData() {
    loading.value = true
    try {
        const hours = parseInt(selectedTime.value)
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?` +
            new URLSearchParams({
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: '10',
                page: '1',
                sparkline: 'true',
                price_change_percentage: `${hours}h`
            })
        )
        const data = await response.json()
        console.log('fetchTopCoinsData data', data)

        // 更新币种列表
        topCoins.value = data.map(coin => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image,
            sparkline: coin.sparkline_in_7d.price
        }))

        // 如果还没有选择币种，默认选择第一个（比特币）
        if (!selectedCoin.value && topCoins.value.length > 0) {
            selectedCoin.value = topCoins.value[0]
            updateChartData(selectedCoin.value.sparkline)
        }
    } catch (error) {
        console.error('Failed to fetch data:', error)
    } finally {
        loading.value = false
    }
}

// 处理菜单点击事件
function handleMenuClick(e) {
    const selected = topCoins.value.find(coin => coin.id === e.key)
    if (selected) {
        selectedCoin.value = selected
        updateChartData(selected.sparkline)
    }
}

// 时间选项
const timeOptions = [
    { label: '1 天', value: '1' },
    { label: '7 天', value: '7' },
    { label: '14 天', value: '14' },
    { label: '30 天', value: '30' },
    { label: '90 天', value: '90' },
    { label: '180 天', value: '180' },
    { label: '365 天', value: '365' },
    { label: '最大范围', value: 'max' }
]

const selectedDays = ref('1') // 默认选择1天

// 处理时间间隔变化
async function handleDaysChange(e) {
    selectedDays.value = e.key
    // 使用选中的币种ID和新的时间间隔获取数据
    if (selectedCoin.value) {
        await get1Day30MinData(selectedCoin.value.id, selectedDays.value)
    }
}

// 修改获取OHLC数据的函数，添加days参数
async function get1Day30MinData(id = 'bitcoin', days = '1') {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${id}/ohlc?` +
            new URLSearchParams({
                vs_currency: 'usd',
                days: days  // 使用传入的天数
            })
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log(`get${days}DayOHLCData data`, data)

        const processedData = data.map(([timestamp, open, high, low, close]) => ({
            time: new Date(timestamp),
            open,
            high,
            low,
            close
        }))

        set30MinData(processedData)
    } catch (error) {
        console.error('Failed to fetch OHLC data:', error)
        return []
    }
}

function set30MinData(ohlcData) {
    // 更新响应式数据
    chartData.value = {
        // 使用每个数据点的时间作为标签
        labels: ohlcData.map(item =>
            item.time.toLocaleString('zh', {
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'  // 添加分钟显示，因为是30分钟间隔
            })
        ),
        datasets: [
            {
                label: 'BTC Open Price (USD)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointRadius: 1,  // 显示数据点，因为30分钟间隔的点数较少
                data: ohlcData.map(item => item.open)  // 使用开盘价
            }
        ]
    }
}


function updateChartData(sparklineData) {
    // 获取当前时间
    const now = new Date()

    // 创建过去7天每小时的时间标签
    const labels = Array.from({ length: 168 }, (_, i) => {
        const time = new Date(now - (167 - i) * 3600 * 1000)
        return time.toLocaleString('zh', {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric'
        })
    })

    // 更新响应式数据
    chartData.value = {
        labels,
        datasets: [
            {
                label: 'BTC Price (USD)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointRadius: 0,
                data: sparklineData
            }
        ]
    }
}



// 组件挂载时初始化
onMounted(() => {
    fetchTopCoinsData()
    // get1Day30MinData()
})
</script>

<style scoped>
.gecko-container {
    padding: 20px;
}

.time-selector {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
}

.chart-container {
    height: 400px;
    margin-bottom: 20px;
}

.volatility-table {
    margin-top: 20px;
}
</style>