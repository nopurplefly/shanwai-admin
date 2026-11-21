<script setup lang="ts">
import Chart from '../chart/index.vue'
import type { EChartsOption } from 'echarts'
const option: EChartsOption = {
        radar: {
            radius: '66%',
            axisName: { color: '#bbd5fa' },
            indicator: [
                { name: '销售', max: 6500 },
                { name: '购物', max: 16000 },
                { name: '查看', max: 30000 },
                { name: '闲逛', max: 38000 },
                { name: '审查', max: 52000 },
                { name: '欣赏', max: 25000 }
            ]
        },
        series: [
            {
                name: '',
                type: 'radar',
                data: [
                    {
                        value: [4200, 3000, 20000, 35000, 50000, 18000],
                        name: ''
                    },
                    {
                        value: [5000, 14000, 28000, 26000, 42000, 21000],
                        name: ''
                    }
                ]
            }
        ]
}
</script>

<template>
    <div class="box8">
        <div class="panel-title">
            <p>行动占比</p>
            <img src="../../assets/datashow/dataScreen-title.png" alt="">
        </div>

        <Chart :options="option" class="panel-chart" height="auto" />
    </div>
</template>

<style scoped>
.box8 {
  background-image: url('../../assets/datashow/dataScreen-main-rb.png');
}
</style>
