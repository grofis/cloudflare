<template>
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </template>
  
  <script setup>
  import { onMounted, ref, watch } from 'vue';
  import * as echarts from 'echarts';
  
  const props = defineProps({
    data: {
      type: Object,
      required: true
    }
  });
  
  const chartRef = ref(null);
  let chart = null;
  
  const initChart = () => {
    if (chart) {
      chart.dispose();
    }
    
    chart = echarts.init(chartRef.value);
    const option = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['跌停', '-8%', '-6%', '-4%', '-2%', '0', '2%', '4%', '6%', '8%', '涨停']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: props.data,
        type: 'bar',
        itemStyle: {
          color: function(params) {
            return params.dataIndex < 5 ? '#d75442' : '#59b881';
          }
        }
      }]
    };
    
    chart.setOption(option);
  };
  
  onMounted(() => {
    initChart();
    window.addEventListener('resize', () => {
      chart?.resize();
    });
  });
  
  watch(() => props.data, () => {
    initChart();
  }, { deep: true });
  </script>