<script setup lang="ts">
import Chart from '../chart/index.vue'
import type { EChartsOption } from 'echarts'
const option: EChartsOption = {
  grid: { left: 45, right: 28, top: 14, bottom: 27 },
  yAxis: {
    axisLabel: { color: '#bbd5fa' },
    splitLine: { lineStyle: { color: 'rgba(166, 202, 250, 0.16)' } },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: Array.from({ length: 7 }, (_, index) => `第${index + 1}天`),
    axisLabel: { color: '#bbd5fa' },
  },
  series: [{
    type: 'line',
    data: [120, 240, 110, 203, 405, 645, 345],
    smooth: true,
    itemStyle: { color: '#66cfff' },
    areaStyle: { color: 'rgba(72, 178, 251, 0.23)' },
  }],
}
</script>

<template>
  <div class="box5">
    <div class="panel-title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../assets/datashow/dataScreen-title.png" alt="">
    </div>

    <Chart :options="option" class="panel-chart" height="auto" />
  </div>
</template>

<style scoped>
.box5 {
  background-image: url('../../assets/datashow/dataScreen-main-cb.png');
}
</style>
