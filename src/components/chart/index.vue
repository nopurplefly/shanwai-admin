<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import echarts from '../../utils/echarts'
import type { EChartsType } from 'echarts/core'
import type { EChartsOption } from 'echarts'

const props = withDefaults(
	defineProps<{
		// 图表配置
		options: EChartsOption
		// 容器高度，默认 240px
		height?: string
	}>(),
	{
		height: '240px',
	},
)

const chartRef = ref<HTMLDivElement>()
let chart: EChartsType | null = null
let resizeObserver: ResizeObserver | null = null

function renderChart() {
	if (!chartRef.value) return
	let instance = chart
	if (!instance) {
		instance = echarts.init(chartRef.value)
		chart = instance
	}
	// 第二个参数 true：整体替换，避免旧配置残留
	instance.setOption(props.options, true)
}

function resizeChart() {
	chart?.resize()
}

onMounted(() => {
	renderChart()
	// 容器尺寸变化时自动重绘
	if (chartRef.value) {
		resizeObserver = new ResizeObserver(resizeChart)
		resizeObserver.observe(chartRef.value)
	}
})

// options 变化时重新渲染
watch(
	() => props.options,
	() => renderChart(),
	{ deep: true },
)

onBeforeUnmount(() => {
	resizeObserver?.disconnect()
	resizeObserver = null
	chart?.dispose()
	chart = null
})
</script>

<template>
	<div ref="chartRef" class="chart" :style="{ height }"></div>
</template>

<style scoped>
.chart {
	width: 100%;
}
</style>
