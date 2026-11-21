<script setup lang="ts">
import 'echarts-liquidfill'
import type { EChartsOption } from 'echarts'
import Chart from '../chart/index.vue'

const people = '215908人'
const option = {
  series: [{
    type: 'liquidFill',
    radius: '88%',
    center: ['50%', '50%'],
    data: [0.6, 0.4, 0.2],
    label: { fontSize: 38, color: '#29fcff' },
    outline: { borderDistance: 4 },
  }],
} as EChartsOption
</script>

<template>
  <section class="tourist">
    <div class="tourist-heading">
      <div class="panel-title">
        <p>实时游客统计</p>
        <img src="../../assets/datashow/dataScreen-title.png" alt="">
      </div>
      <p class="capacity">可预约总量 <strong>99999</strong> 人</p>
    </div>

    <div class="visitor-count" :aria-label="people">
      <span v-for="(digit, index) in people" :key="index" aria-hidden="true">{{ digit }}</span>
    </div>
    <Chart :options="option" class="panel-chart" height="auto" />
  </section>
</template>

<style scoped>
.tourist {
  background-image: url('../../assets/datashow/dataScreen-main-lt.png');
}

.tourist-heading {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 8px;
}

.capacity {
  padding-top: 2px;
  color: #d6e8ff;
  font-size: 16px;
}

.capacity strong {
  color: #75edff;
}

.visitor-count {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.visitor-count span {
  flex: 1;
  text-align: center;
  line-height: 43px;
  background: url('../../assets/datashow/total.png') center / 100% 100% no-repeat;
  color: #29fcff;
  font-size: 26px;
  font-weight: 700;
}
</style>
