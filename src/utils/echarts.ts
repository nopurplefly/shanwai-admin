// ECharts 统一入口：按需引入 + 在这里注册要用的图表类型和组件
import * as echarts from 'echarts/core'
import { LineChart, BarChart, PieChart, EffectScatterChart,ScatterChart,RadarChart, LinesChart } from 'echarts/charts'
import {
	GridComponent,
	TooltipComponent,
	LegendComponent,
	TitleComponent,
	GeoComponent,
	RadarComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
	LineChart,
	BarChart,
	PieChart,
	EffectScatterChart, 
	LinesChart,         
	GridComponent,
	TooltipComponent,
	LegendComponent,
	TitleComponent,
	GeoComponent,    
	CanvasRenderer,
	RadarComponent,
	ScatterChart,
	RadarChart,

])

export default echarts
