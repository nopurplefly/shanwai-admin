<script setup lang="ts">
import Chart from '../chart/index.vue'
import type { EChartsOption } from 'echarts'
const rankData = [
    { name: '', value: 80, total: '8.00w' },
    { name: "", value: 60, total: '6.00w' },
    { name: '', value: 90, total: '5.00w' },
    { name: '', value: 70, total: '4.00w' },
    { name: '', value: 30, total: '3.00w' },
]
const progressColors = ['#2f8ce0', '#ef7f7f', '#3fc4d4', '#f2b93b', '#7c6cf0']
const badgeColors = ['#e2563f', '#f0a03c', '#2f6fc9', '#3c8fd4', '#7c6cf0']
const option: EChartsOption = {
        grid: { left: 150, right: 90, top: 10, bottom: 10 },
        xAxis: {
            type: 'value',
            max: 100,
            show: false,
        },
        yAxis: {
            type: 'category',
            inverse: true,                      
            data: rankData.map((item) => item.name),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                margin: 14,
                formatter: (name: string, index: number) => {
                    return `{no${index + 1}|NO.${index + 1}}  {name|${name}}`
                },
                rich: {
                    no1: { color: '#fff', backgroundColor: badgeColors[0], padding: [3, 6], borderRadius: 2, fontSize: 11, width: 36, align: 'center' },
                    no2: { color: '#fff', backgroundColor: badgeColors[1], padding: [3, 6], borderRadius: 2, fontSize: 11, width: 36, align: 'center' },
                    no3: { color: '#fff', backgroundColor: badgeColors[2], padding: [3, 6], borderRadius: 2, fontSize: 11, width: 36, align: 'center' },
                    no4: { color: '#fff', backgroundColor: badgeColors[3], padding: [3, 6], borderRadius: 2, fontSize: 11, width: 36, align: 'center' },
                    no5: { color: '#fff', backgroundColor: badgeColors[4], padding: [3, 6], borderRadius: 2, fontSize: 11, width: 36, align: 'center' },
                    name: { color: '#cfe3ff', fontSize: 12, padding: [0, 0, 0, 10] },
                },
            },
        },
        series: [
            {
                // 背景轨道
                type: 'bar',
                barWidth: 14,
                silent: true,
                data: rankData.map(() => 100),
                itemStyle: {
                    color: 'transparent',
                    borderColor: 'rgba(70, 140, 235, 0.55)',
                    borderWidth: 1,
                    borderRadius: 7,
                },
                label: {
                    show: true,
                    position: 'right',
                    distance: 10,
                    color: '#d8e6ff',
                    fontSize: 13,
                    formatter: (params: any) => rankData[params.dataIndex].total,
                },
                z: 1,
            },
            {
                // 实际进度
                type: 'bar',
                barWidth: 14,
                barGap: '-100%',                
                data: rankData.map((item, index) => ({
                    value: item.value,
                    itemStyle: { color: progressColors[index], borderRadius: 7 },
                })),
                label: {
                    show: true,
                    position: 'insideLeft',
                    distance: 8,
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 'bold',
                    formatter: '{c}%',
                },
                z: 2,
            },
        ],
}
</script>

<template>
    <div class="box6">
        <div class="panel-title">
            <p>热门景区排行</p>
            <img src="../../assets/datashow/dataScreen-title.png" alt="">
        </div>

        <Chart :options="option" class="panel-chart" height="auto" />
    </div>
</template>

<style scoped>
.box6 {
  background-image: url('../../assets/datashow/dataScreen-main-rt.png');
}
</style>
