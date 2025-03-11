<template>
    <!-- 迷你图表 -->
    <div @click="showModal">
        <a-card style="width: 80px; height: 40px; padding: 0; cursor: pointer">
            <svg width="80" height="40">
                <polyline :points="line5Points" style="fill:none;stroke:#ff4d4f;stroke-width:1" />
                <polyline :points="line20Points" style="fill:none;stroke:#52c41a;stroke-width:1" />
            </svg>
        </a-card>
    </div>

    <!-- 弹窗中的详细图表 -->
    <!-- 使用 ECharts 替换详细图表 -->
    <a-modal v-model:open="modalVisible" :title="`${props.item.name} 均线走势`" centered :footer="null" width="1300px">
        <a-radio-group v-model:value="chartType" style="margin: 8px" @change="handleChartTypeChange">
            <a-radio-button v-for="item in chartArray" :key="item.value" :value="item.value">
                {{ item.label }}
            </a-radio-button>
        </a-radio-group>
        <div ref="chartRef" style="width: 1250px; height: 500px"></div>
    </a-modal>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'


const props = defineProps({
    average: {
        type: Object,
        required: true
    },
    item: {        // 添加 item props
        type: Object,
        required: true
    }
});

const modalVisible = ref(false);
const showModal = () => {
    modalVisible.value = true;
};

const chartType = ref('-2');
//一年的行情只有240个交易日
let chartArray = [
    { value: '240', label: '一年' },
    { value: '120', label: '半年' },
    { value: '-1', label: '今年' },
    { value: '90', label: '3月' },
    { value: '30', label: '1月' },
    { value: '5', label: '一周' },
    { value: '-2', label: '均线' },
    { value: '-3', label: '蜡烛图' }
]

const chartRef = ref(null)
let chart = null
let defaultOption = ref({})

// 初始化 ECharts
const initChart = () => {
    if (chart) {
        chart.dispose()
    }
    chart = echarts.init(chartRef.value)
    defaultOption.value = {
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                return params.map(item => {
                    return `${item.seriesName}: ${item.value.toFixed(2)}`
                }).join('<br/>')
            }
        },
        legend: {
            data: ['5日均线', '20日均线'],
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: props.average.aver5.length }, (_, i) => i + 1)
        },
        yAxis: {
            type: 'value',
            scale: true
        },
        series: [
            {
                name: '5日均线',
                type: 'line',
                smooth: true, // 平滑曲线
                data: props.average.aver5,
                lineStyle: {
                    color: '#ff4d4f'
                },
                itemStyle: {
                    color: '#ff4d4f'
                }
            },
            {
                name: '20日均线',
                type: 'line',
                smooth: true,
                data: props.average.aver20,
                lineStyle: {
                    color: '#52c41a'
                },
                itemStyle: {
                    color: '#52c41a'
                }
            }
        ]
    }
    console.log('init chart')
    updateChart()
}

// 更新图表数据
const updateChart = (option = defaultOption.value) => {
    if (!chart || !props.average?.aver5) return
    console.log('init chart', option)
    if (option !== defaultOption.value) {
        chart.clear()
    }
    chart.setOption(option)
}

const loading = ref(false)
let stockData = ref({})

// 处理图表类型切换
const handleChartTypeChange = async (e) => {
    let days = e.target.value
    if (!props.average?.code) return

    loading.value = true
    try {

        let url = `${import.meta.env.VITE_API_URL}/stock/local/data?code=${props.average.code}`
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        console.log('获得数据：', data)
        stockData.value = data

        if (days == -2) {
            updateChart(defaultOption.value)
            return
        }
        if (days == -3) {
            drawCandleChart(stockData.value)
            return
        }
        if (days == -1) {
            days = 60
        }
        let title = `${days}日走势`
        let length = data.dates.length
        let dates = data.dates.slice(-days)
        let temp = data.price.slice(-days * 4)

        let price = []
        for (let index = 0; index < temp.length - 3; index++) {
            let num = index * 4
            console.log('确定一个价格：', temp[num], temp[num + 3])
            price.push(temp[num] + temp[num + 3]);
        }

        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    return params.map(item => {
                        return `${item.seriesName}: ${item.value.toFixed(2)}`
                    }).join('<br/>')
                }
            },
            legend: {
                data: [title],
                top: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dates
            },
            yAxis: {
                type: 'value',
                scale: true
            },
            series: [
                {
                    name: title,
                    type: 'line',
                    smooth: true, // 平滑曲线
                    data: price,
                    lineStyle: {
                        color: '#ff4d4f'
                    },
                    itemStyle: {
                        color: '#ff4d4f'
                    }
                }
            ]
        }
        // 更新图表数据
        // props.average.aver5 = data.aver5
        // props.average.aver20 = data.aver20

        // 触发图表更新
        updateChart(option)
    } catch (error) {
        console.error('Error fetching data:', error)

    } finally {
        loading.value = false
    }
}

const drawCandleChart = (data) => {
    let { price, dates } = data;
    let size = 240 // 扩大显示范围以便计算均线
    dates = dates.slice(-size)
    price = price.slice(-size * 4)

    // 处理K线数据
    const candleData = price.reduce((acc, val, index) => {
        if (index % 4 === 0) {
            const low = Number((val / 100).toFixed(2));
            const open = Number(((val + price[index + 1]) / 100).toFixed(2));
            const high = Number(((val + price[index + 2]) / 100).toFixed(2));
            const close = Number(((val + price[index + 3]) / 100).toFixed(2));
            acc.push([dates[index / 4], open, close, low, high]);
        }
        return acc;
    }, []);

    // 计算移动平均线
    const calculateMA = (dayCount) => {
        const result = [];
        for (let i = 0; i < candleData.length; i++) {
            if (i < dayCount - 1) {
                result.push('-');
                continue;
            }
            let sum = 0;
            for (let j = 0; j < dayCount; j++) {
                sum += candleData[i - j][2]; // 使用收盘价计算
            }
            result.push(Number((sum / dayCount).toFixed(2)));
        }
        return result;
    };

    const option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: ['K线', '收盘价', 'MA5', 'MA30'],
            top: '30px',
            textStyle: {
                color: '#666'
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '15%'
        },
        xAxis: {
            type: 'category',
            data: candleData.map(item => item[0]),
            axisLine: { lineStyle: { color: '#999' } },
            axisLabel: {
                color: '#666',
                fontSize: 12
            }
        },
        yAxis: {
            type: 'value',
            scale: true,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#eee',
                    type: 'solid'
                }
            },
            axisLine: { lineStyle: { color: '#999' } },
            axisLabel: {
                color: '#666',
                fontSize: 12,
                formatter: '{value}'
            }
        },
        series: [
            {
                name: 'K线',
                type: 'candlestick',
                data: candleData.map(item => [item[1], item[2], item[3], item[4]]),
                itemStyle: {
                    color: '#ef232a',
                    color0: '#14b143',
                    borderColor: '#ef232a',
                    borderColor0: '#14b143',
                },
                barWidth: '60%'
            },
            {
                name: '收盘价',  // 添加收盘价线
                type: 'line',
                data: candleData.map(item => item[2]),  // 使用收盘价数据
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 0.8,
                    color: '#2196F3'  // 使用蓝色来区分其他线
                },
                z: 2  // 确保线在K线上面
            },
            {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5),
                smooth: true,
                symbol: 'none', // 去掉小圆点
                lineStyle: {
                    width: 0.8,
                    color: '#FFB11B'
                }
            },
            {
                name: 'MA30',
                type: 'line',
                data: calculateMA(30),
                smooth: true,
                symbol: 'none', // 去掉小圆点
                lineStyle: {
                    width: 0.8,
                    color: '#8B2671'
                }
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                bottom: '5%',
                start: 0,
                end: 100
            }
        ]
    };

    updateChart(option);
};

// 监听数据变化
watch(() => props.average, () => {
    if (chart) {
        updateChart()
    }
}, { deep: true })

// 监听图表类型变化
watch(() => chartType.value, () => {
    if (chart) {
        updateChart()
    }
})

// 监听弹窗显示状态
watch(() => modalVisible.value, (newVal) => {
    if (newVal) {
        // 弹窗打开时初始化图表
        setTimeout(() => {
            initChart()
        }, 0)
    }
})

// 组件卸载时销毁图表
onUnmounted(() => {
    if (chart) {
        chart.dispose()
        chart = null
    }
})

// 计算Y轴刻度值
const yAxisValues = computed(() => {
    if (!props.average?.aver5) return [];
    const allValues = [...props.average.aver5, ...props.average.aver20];
    const maxVal = Math.max(...allValues);
    const minVal = Math.min(...allValues);
    const step = (maxVal - minVal) / 4;

    return Array.from({ length: 5 }, (_, i) => {
        const value = maxVal - (step * i);
        const y = 50 + ((i * (300 - 100)) / 4);
        return { value, y };
    });
});

const calculatePoints = (data, svgWidth, svgHeight, allValues) => {
    if (!data || data.length === 0) return '';

    const padding = { left: 5, right: 5, top: 5, bottom: 5 };
    const width = svgWidth - padding.left - padding.right;
    const height = svgHeight - padding.top - padding.bottom;

    const maxVal = Math.max(...allValues);
    const minVal = Math.min(...allValues);
    const scale = height / (maxVal - minVal);
    const step = width / (data.length - 1);

    return data.map((val, index) => {
        const x = padding.left + (step * index);
        const y = padding.top + (height - ((val - minVal) * scale));
        return `${x},${y}`;
    }).join(' ');
};

// 详细图表的点计算逻辑
const calculateDetailPoints = (data, svgWidth, svgHeight, allValues) => {
    if (!data || data.length === 0) return '';

    const padding = { left: 50, right: 20, top: 50, bottom: 50 };
    const width = svgWidth - padding.left - padding.right;
    const height = svgHeight - padding.top - padding.bottom;

    const maxVal = Math.max(...allValues);
    const minVal = Math.min(...allValues);
    const scale = height / (maxVal - minVal);
    const step = width / (data.length - 1);

    return data.map((val, index) => {
        const x = padding.left + (step * index);
        const y = padding.top + (height - ((val - minVal) * scale));
        return `${x},${y}`;
    }).join(' ');
};


const line5Points = computed(() => {
    if (!props.average?.aver5) return '';
    const allValues = [...props.average.aver5, ...props.average.aver20];
    return calculatePoints(props.average.aver5, 80, 40, allValues);
});

const line20Points = computed(() => {
    if (!props.average?.aver20) return '';
    const allValues = [...props.average.aver5, ...props.average.aver20];
    return calculatePoints(props.average.aver20, 80, 40, allValues);
});
// 详细图表的点计算
const detailLine5Points = computed(() => {
    if (!props.average?.aver5) return '';
    const allValues = [...props.average.aver5, ...props.average.aver20];
    return calculateDetailPoints(props.average.aver5, 550, 300, allValues);
});

const detailLine20Points = computed(() => {
    if (!props.average?.aver20) return '';
    const allValues = [...props.average.aver5, ...props.average.aver20];
    return calculateDetailPoints(props.average.aver20, 550, 300, allValues);
});

</script>

<style scoped>
.ant-card {
    transition: all 0.3s;
}

.ant-card:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}
</style>