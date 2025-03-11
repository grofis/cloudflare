<template>
  <div ref="chartRef" style="width: 530px; height: 100%"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Array,
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
      top: '3%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      show: false,
      data: ['09:30', '', '', '', '', '', '', '', '', '', '15:00']
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      data: props.data,
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(1,116,221,0.3)' },
          { offset: 1, color: 'rgba(1,116,221,0.1)' }
        ])
      },
      itemStyle: {
        color: '#0174DD'
      },
      lineStyle: {
        color: '#0174DD'
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

onUnmounted(() => {
  chart?.dispose();
  window.removeEventListener('resize', chart?.resize);
});
</script>