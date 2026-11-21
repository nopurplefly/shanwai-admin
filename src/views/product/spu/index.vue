<script setup lang="ts">
import { notify } from '../../../utils/notify'
import { ElButton, ElCard, ElTable, ElTableColumn } from 'element-plus';
import { ref, watch } from 'vue';
import skuForm from './skuForm.vue';
import spuForm from './spuForm.vue';
import type { recordsData,ViewSKUData,SKUData } from '../../../api/product/spu/type.ts'
import { reqDeleteSPU,reqSPULIst,reqViewSKU } from '../../../api/product/spu/index.ts'
import Category from '../../../components/catagraoh/index.vue'
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let spuList = ref<recordsData[]>([])
let total = ref<number>(0)
let scene = ref<number>(0) //默认显示0  1：添加修改spu  2：添加sku
let spu = ref()
let sku = ref()
let skuArr = ref<SKUData[]>([])
let isShow = ref<boolean>(false)
const categoryIds = ref<{ c1id: number; c2id: number; c3id: number }>({ c1id: 0, c2id: 0, c3id: 0 })
//获取spu列表
watch(() => categoryIds.value.c3id, () => {
	if (categoryIds.value.c3id) {
		getSPUlist()
	}
})
async function getSPUlist() {
	let result = await reqSPULIst(pageNo.value, pageSize.value, categoryIds.value.c3id)
	if (result.code == 200) {
		spuList.value = result.data.records
		total.value = result.data.total
	}
}
//分页器
function changeSPUlist() {
	pageNo.value = 1
	getSPUlist()
}

function addSPU(){
	//把当前三级分类传给子组件，并清空表单
	spu.value.initAddSpu(categoryIds.value.c3id)
	scene.value = 1
}

function updataSPU(row:recordsData){
	scene.value = 1
	//父组件通过调用子组件实例里面的方法传数据
	spu.value.getspulist(row)
	
}
//子传父
function changeScene(num:number){
	scene.value = num
	//保存成功后回到列表，刷新数据
	if(num === 0){
		getSPUlist()
	}
} 
//sku的组件实例
function addSKU(row:recordsData){
	scene.value = 2
	sku.value.initSKUData(categoryIds.value.c1id,categoryIds.value.c2id,row)
}

async function ViewSKU(row:recordsData){
	let result:ViewSKUData = await reqViewSKU(row.id as number)
	if(result.code === 200){
		skuArr.value = result.data
		isShow.value = true
	}


}

async function DeleteSPU(row:recordsData){
	let result = await reqDeleteSPU(row.id as number)
	if(result.code === 200){
		notify('success', '删除成功')
		spuList.value.length>1?pageNo.value:pageNo.value-1
		getSPUlist()
	}
	
}
</script>

<template>
	<div >
		<ElCard>
			<Category @ids="categoryIds = $event"></Category>
		</ElCard>

		<el-card style="margin: 10px 0;">
			<div v-show="scene == 0">
				<el-button type="primary" icon="Plus" v-has="'btn.Spu.add'" :disabled="categoryIds.c3id ? false : true" @click="addSPU()">添加SPU</el-button>
				<el-table border style="margin: 10px 0;" :data="spuList">
					<el-table-column type="index" label="序号" align="center"></el-table-column>
					<el-table-column label="SPU名称" align="center" prop="spuName"></el-table-column>
					<el-table-column label="SPU描述" align="center" prop="description"
						show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" align="center">
						<template #default="{ row }">
							<el-button type="primary" size="small" round icon="Plus" v-has="'btn.Spu.addsku'" @click="addSKU(row as recordsData)"></el-button>
							<el-button type="warning" size="small" round icon="Edit" v-has="'btn.Spu.update'" @click="updataSPU(row as recordsData)"></el-button>
							<el-button type="info" size="small" round icon="View" v-has="'btn.Spu.skus'" @click="ViewSKU(row as recordsData)"></el-button>
							<ElPopconfirm
								:title="`你确定删除${row.spuName}?`"
								confirm-button-text="确定"
								cancel-button-text="取消"
								@confirm="DeleteSPU(row as recordsData)">
								<template #reference>
									<el-button type="danger" size="small" round icon="Delete" v-has="'btn.Spu.delete'"></el-button>
								</template>
							</ElPopconfirm>
						</template>
					</el-table-column>
				</el-table>

				<el-pagination :page-sizes="[3, 5, 7]" size='default' background
					layout="prev, pager, next,->,jumper,sizes,total" :total=total :pager-count="5"
					v-model:current-page="pageNo" v-model:page-size="pageSize" @current-change="getSPUlist()"
					@size-change="changeSPUlist()" />
			</div>
			<!-- 添加修改spu -->
			<spuForm v-show="scene == 1" @change-scene="changeScene" ref="spu"></spuForm >
			<!-- 修改sku -->
			<skuForm v-show="scene == 2" @change-scene="changeScene" ref="sku"></skuForm >
				<ElDialog title="SKU列表" v-model="isShow" append-to-body width="50%">
					<el-table :data="skuArr">
						<el-table-column prop="skuName" label="SKU名称"></el-table-column>
						<el-table-column prop="price" label="SKU价格"></el-table-column>
						<el-table-column prop="weight" label="SKU重量"></el-table-column>
						<el-table-column  label="SKU图片">
							<template #default="{ row }">
								<img :src="row.skuDefaultImg" alt="" style="width: 50px;height: 50px;">
							</template>
						</el-table-column>

					</el-table>
				</ElDialog>
		</el-card>


	</div>
</template>

<style scoped>
.attr-form {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 12px;
}

/* 每个表单项可伸缩：窗口变窄自动缩小/换行，变宽时最多 360px，不会拉得过长 */
.attr-form :deep(.el-form-item) {
	flex: 1 1 220px;
	max-width: 360px;
	min-width: 0;
	margin-right: 0;
}

/* 下拉框占满表单项的可伸缩宽度 */
.attr-form :deep(.el-select) {
	width: 100%;
}
</style>
