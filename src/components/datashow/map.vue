<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Chart from '../chart/index.vue'
// 按需引入和Chart组件共用同一份 echarts
import echarts from '../../utils/echarts'
import type { EChartsOption } from 'echarts'

const geoCoordMap: Record<string, [number, number]> = {
  '北京': [116.405285, 39.904989],
  '上海': [121.472644, 31.231706],
  '广州': [113.280637, 23.125178],
  '成都': [104.065735, 30.659462],
  '西安': [108.948024, 34.263161],
  '哈尔滨': [126.642464, 45.756967],
}

// 航线
const routes: [string, string][] = [
  ['北京', '上海'],
  ['广州', '北京'],
  ['成都', '西安'],
  ['哈尔滨', '上海'],
]

// 配置先留空，等地图 JSON 加载完再赋值
const option = ref<EChartsOption>()

onMounted(async () => {
  // 运行时请求，不再打进 bundle
  const res = await fetch(`${import.meta.env.BASE_URL}china.json`)
  const chinaJson = await res.json()
  echarts.registerMap('china', chinaJson)

  option.value = {
    geo: {
      map: 'china',
      roam: true,
      left: 50,
      top: 24,
      right: 50,
      bottom: 24,
      itemStyle: {
        areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#4a6bb5' },
          { offset: 1, color: '#2a4278' }
        ]),
        borderColor: 'rgba(130, 215, 255, 0.6)',
        borderWidth: 1,
        shadowColor: 'rgba(41, 252, 255, 0.25)',
        shadowBlur: 10
      },
      label: { show: true, color: '#cfe3ff', fontSize: 20 },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(41, 252, 255, 0.28)',
          borderColor: '#29fcff',
          borderWidth: 1.5,
          shadowColor: 'rgba(41, 252, 255, 0.75)',
          shadowBlur: 22
        },
        label: { color: '#ffffff', fontWeight: 'bold' }
      },
    },
    series: [
      // 城市光点
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        symbolSize: 8,
        rippleEffect: { brushType: 'stroke', scale: 3 },
        itemStyle: { color: '#29fcff' },
        label: { show: true, position: 'right', color: '#cfe3ff', fontSize: 11, formatter: '{b}' },
        data: Object.keys(geoCoordMap).map(name => ({ name, value: [...geoCoordMap[name], 100] })),
      },
      // 飞机飞线
      {
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 3,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.35,
          symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0-30.169-24.446-54.615-54.615-54.615s-54.615,24.446-54.615,54.615l-0.073,208.063l-319.9,221.799v89.254l319.9-100.974l0.073,208.063l-79.9,60.974v55.453l134.9-45.277l134.9,45.277v-55.453l-79.9-60.974l-0.073-208.063l319.9,100.974z',
          symbolSize: 16,
        },
        lineStyle: { color: 'rgba(41, 252, 255, 0.5)', width: 1.2, opacity: 0.85, curveness: 0.25 },
        data: routes.map(([from, to]) => ({ coords: [geoCoordMap[from], geoCoordMap[to]] })),
      },
    ],
  }
})
</script>

<template><Chart :options="option" height="100%" v-if="option"/></template>
