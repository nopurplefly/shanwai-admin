<script setup lang="ts">
import Chart from '../chart/index.vue'
import type { EChartsOption } from 'echarts'


// 年龄比例数据（数值就是百分比，总和 100）
const ageData = [
  { name: '10岁以下', value: 16 },
  { name: '10-18岁', value: 8 },
  { name: '18-30岁', value: 12 },
  { name: '30-40岁', value: 24 },
  { name: '40-60岁', value: 20 },
  { name: '60岁以上', value: 20 },
]

const option: EChartsOption = {
    color: ['#f2c14e', '#ef8a3c', '#2ba3a0', '#2f6fc9', '#6fc2f2', '#a180d8'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}:{c}%',
    },
    legend: {
      orient: 'vertical',
      right: '2%',
      top: 'center',
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 14,
      textStyle: {
        color: '#d8e6ff',
        fontSize: 14,
      },
      formatter: (name: string) => {
        const item = ageData.find((d) => d.name === name)
        return `${name}   ${item ? item.value : 0}%`
      },
    },
    series: [
      {
        name: '年龄比例',
        type: 'pie',
        radius: ['48%', '72%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: 'rgba(8, 20, 44, 0.85)',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{d}%',
          color: '#0b1a33',
          fontSize: 13,
          fontWeight: 'bold',
        },
        labelLine: {
          show: false,
        },
        data: ageData,
      },
    ],
    title: {
      text: '本日总数',
      left: '35%',
      top: '50%',
      textAlign: 'center',
      textVerticalAlign: 'middle',
      textStyle: {
        color: '#d8e6ff',
        fontSize: 15,
        fontWeight: 'normal',
      },
    },
}
</script>

<template>
  <div class="box2">
    <div class="panel-title">
      <p>年龄比例</p>
      <img src="../../assets/datashow/dataScreen-title.png" alt="">
    </div>

    <Chart :options="option" class="panel-chart" height="auto" />
  </div>
</template>

<style scoped>
.box2 {
  background-image: url('../../assets/datashow/dataScreen-main-lb.png');
}
</style>
