<template>
    <stock-chart />
    <a-space :size="[0, 8]" wrap style="margin: 10px 0">
        <a-checkable-tag v-for="tag in tagsData" :key="tag.code" :checked="selectedTag === tag.code"
            @change="checked => handleChange(tag.code, checked)">
            {{ tag.title }}
        </a-checkable-tag>
    </a-space>
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1000 }" :loading="loading" :pagination="{
        pageSize: 100,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['50', '100', '200', '500']
    }" />
</template>

<script setup lang="jsx">
import { h, ref, reactive, onMounted } from 'vue'

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 70,  // 序号列稍微宽一点
        fixed: 'left',  // 固定在左侧
        customRender: ({ text }) => text
    },
    {
        title: '股票代码',
        dataIndex: 'code',
        key: 'code',
        width: 90,  // 代码需要6位数字加链接
        fixed: 'left',  // 固定在左侧
        customRender: ({ text }) => (
            <a href={`https://quote.eastmoney.com/${text}.html`}
                target="_blank"
                className="stock-link">
                {text}
            </a>
        )
    },
    {
        title: '股票简称',
        dataIndex: 'name',
        key: 'name',
        width: 100,  // 保持不变
        fixed: 'left',  // 固定在左侧
        customRender: ({ text, record }) => (
            <a href={`https://stockpage.10jqka.com.cn/${record.code}/`}
                target="_blank"
                className="stock-link">
                {text}
            </a>
        )
    },
    {
        title: '最新价',
        dataIndex: 'price',
        key: 'price',
        width: 85,  // 价格列稍宽，考虑小数点
        align: 'right',  // 数字右对齐
        sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
        customRender: ({ text }) => formatNumber(text)
    },
    {
        title: '涨跌幅',
        dataIndex: 'change_percent',
        key: 'change_percent',
        width: 85,  // 百分比需要考虑符号和小数点
        align: 'right',
        sorter: (a, b) => parseFloat(a.change_percent) - parseFloat(b.change_percent),
        customRender: ({ text }) => (
            <span className={parseFloat(text) >= 0 ? 'rise-text' : 'fall-text'}>
                {text}%
            </span>
        )
    },
    {
        title: '振幅',
        dataIndex: 'amplitude',
        key: 'amplitude',
        width: 80,
        align: 'right',
        customRender: ({ text }) => `${text}%`
    },
    {
        title: '换手率',
        dataIndex: 'turnover',
        key: 'turnover',
        width: 85,
        align: 'right',
        customRender: ({ text }) => `${text}%`
    },
    {
        title: '成交额',
        dataIndex: 'amount',
        key: 'amount',
        width: 110,  // 成交额列要宽一些，因为有单位
        align: 'right',
        customRender: ({ text }) => formatNumber(text)
    },
    {
        title: '均线走势',
        dataIndex: 'average',
        key: 'average',
        width: 80,  // 调整宽度以适应图表
        customRender: ({ text, record }) => {  // 添加 record 参数
            if (!text) return '-';
            return <StockAverage average={text} item={record} />;  // 传递整个 record
        }
    }

];

const loading = ref(false);
const originalData = ref([]); // 保存原始数据
const data = ref([]);

const formatNumber = (text) => {
    const num = parseFloat(text);
    if (Math.abs(num) >= 100000000) { // 9位数以上用亿
        return (num / 100000000).toFixed(2) + '亿';
    } else if (Math.abs(num) >= 10000) { // 5位数以上用万
        return (num / 10000).toFixed(2) + '万';
    }
    return text;
};

// 获取数据并处理
// 修改 fetchData 中的数据处理
const fetchData = async () => {
    loading.value = true;
    try {
        const url = `${import.meta.env.VITE_API_URL}/stock/list`;
        const response = await fetch(url);
        const result = await response.json();
        console.log('result:', result)

        // 转换数据格式
        const formattedData = result.map(item => ({
            ...item.date_data,
            average: item.average
        }));

        originalData.value = formattedData; // 保存原始数据
        data.value = formattedData; // 初始显示所有数据
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false;
    }
};

let tags = [{ code: 1, title: '连续上涨' }, { code: 2, title: '频繁波动' }, { code: 3, title: '昨日上榜' }]
const tagsData = reactive(tags);
const selectedTag = ref(''); // 用单个变量记录选中的tag

const handleChange = (code, checked) => {
    selectedTag.value = checked ? code : null;

    if (!checked) {
        // 如果取消选中，显示所有数据
        data.value = originalData.value;
        return;
    }

    // 根据选中的标签代码筛选数据
    switch (code) {
        case 1: // 连续上涨
            data.value = originalData.value.filter(item => {
                const filter = item.average?.filter;
                if (!filter) return false;

                // 检查 filter 对象中除了 code 以外的所有字段是否都为 1
                return Object.entries(filter)
                    .filter(([key]) => key !== 'is_high_active') // 排除 code 字段
                    .every(([_, value]) => value === 1);
            });
            break;
        case 2: // 频繁波动
            data.value = [...originalData.value]
                .sort((a, b) => b.average?.filter?.is_high_active - a.average?.filter?.is_high_active)
                .filter(item => item.average?.filter?.is_high_active >= 0.6)
            console.log('high', data.value)
            break;
        case 3: // 昨日上榜
            const filterYesterdayUp = () => {
                return originalData.value.filter(item => {
                    const price = item.average?.data?.price
                    // 确保至少有4个数据点
                    if (!price || price.length < 4) {
                        return false
                    }

                    const close = price[price.length - 1]  // 最新收盘价
                    const open = price[price.length - 3]   // 前天收盘价
                    const low = price[price.length - 4]    // 更早的价格

                    // 计算涨幅是否超过5%
                    const priceChange = (close - open) / (open + low)
                    return priceChange >= 0.05
                })
            }
            const temp = filterYesterdayUp()
            console.log(JSON.stringify(temp))
            // 直接赋值新数组，让 Vue 的响应式系统处理更新
            data.value = temp
            break;
    }

    console.log('Selected code:', code, 'Checked:', checked, 'Filtered items:', data.value.length);
};

onMounted(() => {
    fetchData()
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


:deep(.ant-table) {
    font-size: 13px;
}

:deep(.ant-table-thead > tr > th) {
    white-space: normal;
    text-align: center;
    background: #fafafa;
    font-weight: 600;
}

:deep(.ant-table-tbody > tr > td) {
    padding: 8px 12px;
}

:deep(.stock-link) {
    color: #1890ff;
    text-decoration: none;
}

:deep(.stock-link:hover) {
    text-decoration: underline;
}

:deep(.ant-card .ant-card-body) {
    padding: 0px;
}
</style>