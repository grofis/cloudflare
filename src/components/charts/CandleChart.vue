<template>
    <a-card title="股票蜡烛图" style="width: 100%">
      <div ref="candleChart" style="height: 400px;"></div>
    </a-card>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    name: 'CandleChart',
    props: {
      stockData: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      this.drawCandleChart();
    },
    methods: {
      drawCandleChart() {
        const { price, dates } = this.stockData;
  
        // 处理数据
        const candleData = price.reduce((acc, val, index) => {
          if (index % 4 === 0) {
            const low = val;
            const open = low + price[index + 1];
            const high = low + price[index + 2];
            const close = low + price[index + 3];
            acc.push([dates[index / 4], open, close, low, high]);
          }
          return acc;
        }, []);
  
        const chartDom = this.$refs.candleChart;
        const myChart = echarts.init(chartDom);
  
        const option = {
          title: {
            text: '蜡烛图',
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            data: candleData.map(item => item[0]),
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: '蜡烛图',
              type: 'candlestick',
              data: candleData.map(item => [item[1], item[2], item[3], item[4]]),
              itemStyle: {
                color: '#ec0000',
                color0: '#00da3c',
                borderColor: '#ec0000',
                borderColor0: '#00da3c',
              },
            },
          ],
        };
  
        myChart.setOption(option);
      },
    },
  };
  </script>
  
  <style scoped>
  </style>