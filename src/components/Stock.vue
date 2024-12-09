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
        dataIndex: 'f1',
        key: 'f1',
        customRender: ({ text, record, index }) => index + 1
    },
    {
        title: '股票代码',
        dataIndex: 'f12',
        key: 'f12',
        width: 100,
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
        dataIndex: 'f14',
        key: 'f14',
        width: 100,
        customRender: ({ text, record }) => (
            <a href={`https://quote.eastmoney.com/${record.f12}.html`}
                target="_blank"
                className="stock-link">
                {text}
            </a>
        )
    },
    {
        title: '最新价',
        dataIndex: 'f2',
        key: 'f2',
    },
    {
        title: '涨跌幅',
        dataIndex: 'f3',
        key: 'f3',
        width: 100,
        sorter: (a, b) => parseFloat(a.f3) - parseFloat(b.f3),
        customRender: ({ text }) => (
            <span className={parseFloat(text) >= 0 ? 'rise-text' : 'fall-text'}>
                {text}%
            </span>
        )
    },
    {
        title: '振幅',
        dataIndex: 'f7',
        key: 'f7',
    },
    {
        title: '今开',
        dataIndex: 'f17',
        key: 'f17',
        customRender: ({ text, record }) => {
            const currentValue = parseFloat(text);
            const previousClose = parseFloat(record.f18);
            
            if (currentValue === previousClose) {
                return <span>{text}</span>;
            }
            
            return (
                <span className={currentValue < previousClose ? 'fall-text' : 'rise-text'}>
                    {text}
                </span>
            );
        }
    },
    {
        title: '昨收',
        dataIndex: 'f18',
        key: 'f18',
    },
    {
        title: '净额',
        dataIndex: 'f21',
        key: 'f21',
        customRender: ({ text }) => formatNumber(text)
    },
    {
        title: '成交量(手)',
        dataIndex: 'f5',
        key: 'f5',
        customRender: ({ text }) => {
            const num = parseFloat(text);
            if (num >= 10000) {
                return (num / 10000).toFixed(2) + '万';
            }
            return text;
        }
    },
    {
        title: '成交额',
        dataIndex: 'f6',
        key: 'f6',
        customRender: ({ text }) => formatNumber(text)
    },
    {
        title: '市场总成交额',
        dataIndex: 'f20',
        key: 'f20',
        customRender: ({ text }) => formatNumber(text)
    },
    {
        title: '换手率',
        dataIndex: 'f8',
        key: 'f8',
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
        // customRender: ({ text }) => (
        //     <span className={parseFloat(text) >= 0 ? 'rise-text' : 'fall-text'}>
        //         {text}%
        //     </span>
        // )
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
        // customRender: ({ text }) => formatNumber(text)
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
        // customRender: ({ text }) => (
        //     <span className={parseFloat(text) >= 0 ? 'rise-text' : 'fall-text'}>
        //         {text}%
        //     </span>
        // )
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
        // customRender: ({ text }) => formatNumber(text)
    }
];

const loading = ref(false);
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
const fetchData = async () => {
    loading.value = true
    try {
        const url = `http://localhost:3000/eastmoney`
        console.log('url:', url)

        const response = await fetch(url)
        const result = await response.json()
        console.log('data:', result.length, result)

        // 筛选主板和中小板的股票
        const filteredData = result.filter(item => {
            const stockCode = item.f12;
            // 保留以下股票：
            // - 上海主板（600、601、603开头）
            // - 深圳主板（000开头）
            // - 中小板（002开头）
            return /^(600|601|603|000|002)\d{3}$/.test(stockCode);
        });

        console.log('data:', filteredData.length, filteredData);
        data.value.length = 0;
        data.value.push(...filteredData);

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