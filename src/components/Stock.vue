<template>
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 2500 }" :loading="loading" :pagination="{
        pageSize: 100,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['50', '100', '200', '500']
    }" />
</template>

<script setup lang="jsx">
import { h, ref, onMounted } from 'vue'

const columns = [
    {
        title: '序号',
        dataIndex: 'index_num',
        key: 'index_num',
    },
    {
        title: '股票代码',
        dataIndex: 'code',
        key: 'code',
        width: 100,
        customRender: ({ text }) => (
            <a href={`https://stockpage.10jqka.com.cn/${text}/`}
                target="_blank"
                className="stock-link">
                {text}
            </a>
        )
    },
    {
        title: '股票简称',
        dataIndex: 'codename',
        key: 'codename',
        width: 100,
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
        dataIndex: 'current_price',
        key: 'current_price',
    },
    {
        title: '涨跌幅',
        dataIndex: 'change_percent',
        key: 'change_percent',
        width: 100,
        sorter: (a, b) => parseFloat(a.change_percent) - parseFloat(b.change_percent),
        customRender: ({ text }) => (
            <span className={parseFloat(text) >= 0 ? 'rise-text' : 'fall-text'}>
                {text}%
            </span>
        )
    },
    {
        title: '换手率',
        dataIndex: 'turnover_rate',
        key: 'turnover_rate',
    },
    {
        title: '流入资金',
        dataIndex: 'capital_inflow',
        key: 'capital_inflow',
    },
    {
        title: '流出资金',
        dataIndex: 'capital_outflow',
        key: 'capital_outflow'
    },
    {
        title: '净额',
        dataIndex: 'net_inflow',
        key: 'net_inflow'
    },
    {
        title: '成交额',
        dataIndex: 'total_amount',
        key: 'total_amount'
    },
    {
        title: '3日排行',
        dataIndex: 'data_3d_index_num',
        key: 'data_3d_index_num',
    },
    {
        title: '3日代码',
        dataIndex: 'data_3d_code',
        key: 'data_3d_code',
    },
    {
        title: '3日涨跌幅',
        dataIndex: 'data_3d_change_percent',
        key: 'data_3d_change_percent',
        customRender: ({ text }) => (
            <span className={parseFloat(text) >= 0 ? 'rise-text' : 'fall-text'}>
                {text}%
            </span>
        )
    },
    {
        title: '3日换手率',
        dataIndex: 'data_3d_turnover_rate',
        key: 'data_3d_turnover_rate',
    },
    {
        title: '3日净额',
        dataIndex: 'data_3d_net_inflow',
        key: 'data_3d_net_inflow',
        customRender: ({ text }) => formatNumber(text)
    },
    {
        title: '5日排行',
        dataIndex: 'data_5d_index_num',
        key: 'data_5d_index_num',
    },
    {
        title: '5日代码',
        dataIndex: 'data_5d_code',
        key: 'data_5d_code',
    },
    {
        title: '5日涨跌幅',
        dataIndex: 'data_5d_change_percent',
        key: 'data_5d_change_percent',
        customRender: ({ text }) => (
            <span className={parseFloat(text) >= 0 ? 'rise-text' : 'fall-text'}>
                {text}%
            </span>
        )
    },
    {
        title: '5日换手率',
        dataIndex: 'data_5d_turnover_rate',
        key: 'data_5d_turnover_rate',
    },
    {
        title: '5日净额',
        dataIndex: 'data_5d_net_inflow',
        key: 'data_5d_net_inflow',
        customRender: ({ text }) => formatNumber(text)
    }
];

const loading = ref(false);
const data = ref([]);

const formatNumber = (value) => {
    if (!value) return '0';

    // 将字符串转换为数字并保留2位小数
    const num = parseFloat(value);
    const formattedNum = num.toFixed(2);

    // 计算原始字符串中小数点后的0的个数
    const zeroCount = (value.toString().split('.')[1] || '').split('').filter(char => char === '0').length;

    // 根据0的个数决定单位
    if (zeroCount >= 8) {
        return formattedNum + '亿';
    } else if (zeroCount >= 4) {
        return formattedNum + '万';
    }

    return formattedNum;
};

function processData(webData) {
    // 先处理数据
    const processedData = webData.map(item => {
        const data3D = item.data_3d ? JSON.parse(item.data_3d) : {};
        const data5D = item.data_5d ? JSON.parse(item.data_5d) : {};

        // 创建新对象，避免修改原始数据
        const processedItem = { ...item };

        // 将 data_3d 的字段复制到 item 中
        for (const key in data3D) {
            if (data3D.hasOwnProperty(key)) {
                processedItem[`data_3d_${key}`] = data3D[key];
            }
        }

        // 将 data_5d 的字段复制到 item 中
        for (const key in data5D) {
            if (data5D.hasOwnProperty(key)) {
                processedItem[`data_5d_${key}`] = data5D[key];
            }
        }

        return processedItem;
    });

    // 然后过滤数据
    const filteredData = processedData.filter(item => {
        const changePercent = parseFloat(item.change_percent);
        const netInflow = parseFloat(item.net_inflow);
        const data3dChangePercent = parseFloat(item.data_3d_change_percent);
        const data3dNetInflow = parseFloat(item.data_3d_net_inflow);
        // const data5dChangePercent = parseFloat(item.data_5d_change_percent);


        return netInflow > 0 && changePercent > 0 && data3dChangePercent > 0 && ( data3dChangePercent > changePercent && data3dNetInflow > netInflow);
    });

    // 更新数据
    data.value.length = 0;
    data.value.push(...filteredData);
    console.log('处理后的数据：', data);
}

// 获取数据并处理
const fetchData = async () => {
    loading.value = true
    try {
        const url = `${import.meta.env.VITE_API_URL}/stock/count`
        console.log('url:', url)

        const response = await fetch(url)
        const data = await response.json()
        console.log('data:',data.data.data.length, data)
        processData(data.data.data)
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