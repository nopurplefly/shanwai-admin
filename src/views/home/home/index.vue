<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import { defineAsyncComponent } from 'vue'
import { reqSKUList } from '../../../api/product/sku/index'
import { reqTradeMark } from '../../../api/product/spu/index'

//概览数据
const brandTotal = ref(0)
const skuTotal = ref(0)

//图片组件异步加载
const Chart = defineAsyncComponent(() => import('../../../components/chart/index.vue'))

//最新商品
const latestGoods = ref<any[]>([])

//品牌商品占比
const brandRank = ref<{ name: string; value: number }[]>([])

onMounted(async () => {
	try {
		
		const [skuRes, tmRes]: any = await Promise.all([reqSKUList(1, 100), reqTradeMark()])
		const records: any[] = skuRes?.data?.records || []
		const brandMap = new Map<number, string>(
			(tmRes?.data || []).map((item: any) => [item.id, item.tmName]),
		)

		brandTotal.value = tmRes?.data?.length || 0
		skuTotal.value = skuRes?.data?.total || records.length

		// 最新商品
		latestGoods.value = records.slice(0, 5).map((item: any) => ({
			...item,
			brandName: brandMap.get(item.tmId) || '未知品牌',
		}))

		// 品牌占比
		const total = records.length
		const counter = new Map<string, number>()
		records.forEach((item: any) => {
			const name = brandMap.get(item.tmId) || '未知品牌'
			counter.set(name, (counter.get(name) || 0) + 1)
		})
		brandRank.value = [...counter.entries()]
			.map(([name, count]) => ({
				name,
				value: total ? Math.round((count / total) * 100) : 0,
			}))
			.sort((a, b) => b.value - a.value)
			.slice(0, 5)
	} catch (error) {
		console.error('首页数据加载失败', error)
	}
})

// echarts数据测试
const trendDays = ['11-04', '11-05', '11-06', '11-07', '11-08', '11-09', '11-10']
const trendValues = [12, 18, 15, 26, 22, 31, 24]

const trendOption: EChartsOption = {
	grid: { left: 44, right: 20, top: 28, bottom: 34 },
	tooltip: {
		trigger: 'axis',
		backgroundColor: 'rgba(31, 45, 61, 0.9)',
		borderWidth: 0,
		textStyle: { color: '#fff', fontSize: 12 },
		axisPointer: { type: 'line', lineStyle: { color: '#c6e2ff', type: 'dashed' } },
	},
	xAxis: {
		type: 'category',
		data: trendDays,
		boundaryGap: false,
		axisLine: { lineStyle: { color: '#e4e8ef' } },
		axisTick: { show: false },
		axisLabel: { color: '#909399', fontSize: 11 },
	},
	yAxis: {
		type: 'value',
		axisLine: { show: false },
		axisTick: { show: false },
		axisLabel: { color: '#909399', fontSize: 11 },
		splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } },
	},
	series: [
		{
			name: '新增商品',
			type: 'line',
			smooth: true,
			symbol: 'circle',
			symbolSize: 6,
			data: trendValues,
			lineStyle: { width: 2.5, color: '#409eff' },
			itemStyle: { color: '#409eff', borderColor: '#fff', borderWidth: 2 },
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: 'rgba(64, 158, 255, 0.28)' },
						{ offset: 1, color: 'rgba(64, 158, 255, 0.02)' },
					],
				},
			},
		},
	],
}
</script>

<template>
	<div class="home">
		<!-- 数据概览 -->
		<section class="cards">
			<div class="stat_card">
				<div class="stat_top">
					<span class="stat_icon is_blue"><el-icon><Collection /></el-icon></span>
					<span class="stat_badge">较上周 +4</span>
				</div>
				<p class="stat_value">{{ brandTotal }}</p>
				<p class="stat_label">品牌总数</p>
			</div>

			<div class="stat_card">
				<div class="stat_top">
					<span class="stat_icon is_green"><el-icon><Goods /></el-icon></span>
					<span class="stat_badge">较上周 +12</span>
				</div>
				<p class="stat_value">1,024</p>
				<p class="stat_label">SPU 总数</p>
			</div>

			<div class="stat_card">
				<div class="stat_top">
					<span class="stat_icon is_orange"><el-icon><Box /></el-icon></span>
					<span class="stat_badge">较上周 +86</span>
				</div>
				<p class="stat_value">{{ skuTotal }}</p>
				<p class="stat_label">SKU 总数</p>
			</div>

			<div class="stat_card">
				<div class="stat_top">
					<span class="stat_icon is_purple"><el-icon><TrendCharts /></el-icon></span>
					<span class="stat_badge is_down">较昨日 -3</span>
				</div>
				<p class="stat_value">24</p>
				<p class="stat_label">今日新增商品</p>
			</div>
		</section>

		<!-- 趋势 + 品牌占比 -->
		<section class="panels">
			<div class="panel">
				<div class="panel_head">
					<h3>近 7 天商品新增趋势</h3>
				</div>
				<Chart class="chart_box" height="100%" :options="trendOption" />
			</div>

			<div class="panel">
				<div class="panel_head">
					<h3>品牌商品占比</h3>
				</div>
				<ul v-if="brandRank.length" class="rank_list">
					<li v-for="item in brandRank" :key="item.name" class="rank_item">
						<div class="rank_top">
							<span class="rank_name">{{ item.name }}</span>
							<span class="rank_value">{{ item.value }}%</span>
						</div>
						<div class="rank_bar">
							<i :style="{ width: item.value + '%' }"></i>
						</div>
					</li>
				</ul>
				<el-empty v-else description="暂无数据" :image-size="70" />
			</div>
		</section>

		<!-- 最新商品 + 快捷入口 -->
		<section class="panels">
			<div class="panel">
				<div class="panel_head">
					<h3>最新商品</h3>
				</div>
				<el-table :data="latestGoods" style="width: 100%">
					<el-table-column type="index" label="序号" width="70" align="center" />
					<el-table-column label="商品名称" prop="skuName" min-width="180" show-overflow-tooltip />
					<el-table-column label="品牌" prop="brandName" width="110" align="center" />
					<el-table-column label="价格(元)" prop="price" width="100" align="center" />
					<el-table-column label="重量(g)" prop="weight" width="100" align="center" />
					<el-table-column label="状态" width="100" align="center">
						<template #="{ row }">
							<el-tag :type="row.isSale === 1 ? 'success' : 'info'" size="small">
								{{ row.isSale === 1 ? '已上架' : '已下架' }}
							</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<div class="panel">
				<div class="panel_head">
					<h3>快捷入口</h3>
				</div>
				<div class="quick_grid">
					<button class="quick_item" @click="$router.push('/product/task')">
						<el-icon><Collection /></el-icon>
						品牌管理
					</button>
					<button class="quick_item" @click="$router.push('/product/value')">
						<el-icon><SetUp /></el-icon>
						属性管理
					</button>
					<button class="quick_item" @click="$router.push('/product/spu')">
						<el-icon><Goods /></el-icon>
						SPU 管理
					</button>
					<button class="quick_item" @click="$router.push('/product/sku')">
						<el-icon><Box /></el-icon>
						SKU 管理
					</button>
					<button class="quick_item" @click="$router.push('/datashow')">
						<el-icon><Monitor /></el-icon>
						数据大屏
					</button>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
.home {
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
	box-sizing: border-box;
	padding: 8px;
	font-size: 13px;
	color: #303133;
}

/*数据概览*/
.cards {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 12px;
}

.stat_card {
	padding: 16px;
	border-radius: 10px;
	background: #ffffff;
	box-shadow: 0 2px 10px rgba(64, 128, 255, 0.06);
}

.stat_top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10px;
}

.stat_icon {
	width: 30px;
	height: 30px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 15px;
}

.stat_icon.is_blue {
	background: #ecf3ff;
	color: #409eff;
}

.stat_icon.is_green {
	background: #edf7ed;
	color: #67c23a;
}

.stat_icon.is_orange {
	background: #fdf5ec;
	color: #e6a23c;
}

.stat_icon.is_purple {
	background: #f2efff;
	color: #7c6cf0;
}

.stat_badge {
	padding: 2px 8px;
	border-radius: 999px;
	font-size: 11px;
	color: #67c23a;
	background: #edf7ed;
}

.stat_badge.is_down {
	color: #f56c6c;
	background: #fef0f0;
}

.stat_value {
	margin: 0;
	font-size: 24px;
	font-weight: 700;
	color: #1f2d3d;
	line-height: 1.1;
}

.stat_label {
	margin: 6px 0 0;
	font-size: 12px;
	color: #909399;
}

/*面板*/
.panels {
	display: grid;
	grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
	gap: 12px;
}

.panel {
	display: flex;
	flex-direction: column;
	padding: 16px;
	border-radius: 10px;
	background: #ffffff;
	box-shadow: 0 2px 10px rgba(64, 128, 255, 0.06);
	min-width: 0;
}

.panel_head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
}

.panel_head h3 {
	margin: 0;
	font-size: 14px;
	font-weight: 700;
	color: #1f2d3d;
}

/*趋势图容器*/
.chart_box {
	flex: 1;
	min-height: 240px;
}

/*品牌占比*/
.rank_list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.rank_top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 6px;
	font-size: 12px;
}

.rank_name {
	color: #606266;
}

.rank_value {
	color: #909399;
}

.rank_bar {
	height: 6px;
	border-radius: 999px;
	background: #f0f2f5;
	overflow: hidden;
}

.rank_bar i {
	display: block;
	height: 100%;
	border-radius: 999px;
	background: linear-gradient(90deg, #79bbff, #409eff);
}

/*快捷入口*/
.quick_grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 10px;
}

.quick_item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 18px 8px;
	border: 1px solid #ebeef5;
	border-radius: 8px;
	background: #fafcff;
	color: #606266;
	font-size: 12px;
	cursor: pointer;
	transition: all 0.2s;
}

.quick_item .el-icon {
	font-size: 18px;
	color: #409eff;
}

.quick_item:hover {
	border-color: #c6e2ff;
	background: #ecf5ff;
	color: #409eff;
}
</style>
