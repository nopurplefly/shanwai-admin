<script setup lang="ts">
import Chart from '../chart/index.vue'
import type { EChartsOption } from 'echarts'
const option: EChartsOption = {
        xAxis: {
            type:'category',
            show:false
        },
        yAxis: {
            axisLabel: { color: '#bbd5fa' },
            splitLine: { lineStyle: { color: 'rgba(166, 202, 250, 0.16)' } },
        },
        series: [{
            type: 'scatter',
            data: [58,88,44,89,23,54,99,44,65,44],
            symbol:'arrow',
        },],
        grid: {
            right: 20,
            left: 40,
            top: 20,
            bottom: 20,
        }
}
</script>

<template>
    <div class="box7">
        <div class="panel-title">
            <p>年度对比</p>
            <img src="../../assets/datashow/dataScreen-title.png" alt="">
        </div>

        <Chart :options="option" class="panel-chart" height="auto" />
    </div>


</template>

<style scoped>
.box7 {
  background-image: url('../../assets/datashow/dataScreen-main-rc.png');
}
</style>
