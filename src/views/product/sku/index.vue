<script setup lang="ts">
import { notify } from '../../../utils/notify'
import { ref } from 'vue'
import { reqSKUList, reqLaunchSKU, reqWithdrawSKU,  reqSKUDetails, reqDeleteSKU } from '../../../api/product/sku/index.ts'
import type { SkuListData, ResponseData, SkuInfo, } from '../../../api/product/sku/type.ts'
import { onMounted } from "vue";
let skuList = ref<SkuInfo[]>([])
// 分页器配置
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let drawer = ref(false)
let skuDetails = ref<any>({})
//issale是零下架一上架
onMounted(() => {
	getSKUList()
})
async function getSKUList() {
	let result: ResponseData<SkuListData> = await reqSKUList(pageNo.value, pageSize.value)
	if (result.code == 200) {
		skuList.value = result.data.records
		total.value = result.data.total
	}
}


// 分页器：改每页条数时回到第一页
function changeSKUList() {
	pageNo.value = 1
	getSKUList()
}

//上下架
async function UpdataSale(row: SkuInfo) {
	if (row.isSale === 0) {
		let result: ResponseData<any> = await reqLaunchSKU(row.id)
		if (result.code === 200) {

			row.isSale = 1
			notify('success', "上架成功")
			getSKUList()
		}
	} else {
		let result: ResponseData<any> = await reqWithdrawSKU(row.id)
		if (result.code === 200) {
			row.isSale = 0
			notify('success', "下架成功")
			getSKUList()
		}
	}
}

async function ViewSKUDetails(row: any) {
	drawer.value = !drawer.value
	let result: ResponseData<any> = await reqSKUDetails(row.id)
	skuDetails.value = result.data
}

async function Delete(row:any) {
	let result: ResponseData<any> = await reqDeleteSKU(row.id)
	if(result.code === 200){
		notify('success', "删除成功")
		skuList.value.length >1 ?pageNo.value = pageNo.value : pageNo.value = 1
		getSKUList()
	}
}
</script>

<template>
	<div class="sku_page">
		<el-card>
			<el-table border style="width: 100%" :data="skuList">
				<el-table-column type="index" label="序号" width="70" align="center" />
				<el-table-column label="名称" prop="skuName" min-width="220" />
				<el-table-column label="描述" prop="skuDesc" min-width="220" />
				<el-table-column label="默认图片" width="120" align="center">
					<template #="{ row }">
						<el-image class="sku_img" :src="row.skuDefaultImg">
							<template #error>
								<div class="sku_img_fallback">
									<el-icon :size="20">
										<Picture />
									</el-icon>
								</div>
							</template>
						</el-image>
					</template>
				</el-table-column>
				<el-table-column label="重量(g)" prop="weight" width="110" align="center" />
				<el-table-column label="价格(元)" prop="price" width="120" align="center" />
				<el-table-column label="操作" width="230" align="center" fixed="right">
					<template #="{ row }">
						<el-button v-has="'btn.Sku.updown'" :type="row.isSale === 0 ? 'success' : 'warning'" size="small" round
							:icon="row.isSale === 0 ? 'Top' : 'Bottom'" :title="row.isSale === 0 ? '上架' : '下架'"
							@click="UpdataSale(row as SkuInfo)" />
						<el-button type="primary" size="small" round icon="Edit" title="修改" v-has="'btn.Sku.update'" />
						<el-button type="info" size="small" round icon="View" title="查看" v-has="'btn.Sku.detail'" @click="ViewSKUDetails(row)" />
						<el-button type="danger" size="small" round icon="Delete" title="删除" v-has="'btn.Sku.remove'" @click="Delete(row)"/>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination :page-sizes="[3, 5, 7]" size='default' background
				layout="prev, pager, next,->,jumper,sizes,total" :total=total :pager-count="5"
				v-model:current-page="pageNo" v-model:page-size="pageSize" @current-change="getSKUList()"
				@size-change="changeSKUList()" style="margin-top: 10px;" />

			<el-drawer v-model="drawer" title="查看商品详情" size="40%">
				<div class="sku_detail">
					
					<el-descriptions class="sku_detail_info" direction="horizontal" :column="1" size="small" border label-width="90px">
						<el-descriptions-item label="名称">{{ skuDetails.skuName }}</el-descriptions-item>
						<el-descriptions-item label="描述">{{ skuDetails.skuDesc }}</el-descriptions-item>
						<el-descriptions-item label="价格">{{ skuDetails.price }}</el-descriptions-item>
						<el-descriptions-item label="平台属性">
							<el-tag class="sku_tag" size="small" v-for="tag in skuDetails.skuAttrValueList"
								:key="tag">{{ tag.valueName }}</el-tag>
						</el-descriptions-item>
						<el-descriptions-item label="销售属性">
							<el-tag class="sku_tag" size="small" v-for="tag in skuDetails.skuSaleAttrValueList"
								:key="tag">{{ tag.saleAttrValueName }}</el-tag>
						</el-descriptions-item>
					</el-descriptions>

					
					<div class="sku_detail_imgs">
						<el-carousel v-if="skuDetails.skuImageList && skuDetails.skuImageList.length" :interval="4000"
							height="100%" type="card">
							<el-carousel-item v-for="item in skuDetails.skuImageList" :key="item.id">
								<el-image class="sku_detail_img" :src="item.imgUrl" fit="contain">
									<template #error>
										<div class="sku_detail_img_empty">
											<el-icon :size="32">
												<Picture />
											</el-icon>
										</div>
									</template>
								</el-image>
							</el-carousel-item>
						</el-carousel>

						<!-- 没有图片时给个空状态，别留一片白 -->
						<el-empty v-else description="暂无图片" :image-size="80" />
					</div>
				</div>
			</el-drawer>
		</el-card>
	</div>
</template>

<style scoped>
.sku_page {
	padding: 8px;
}

/* 默认图片缩略图 */
.sku_img {
	width: 56px;
	height: 56px;
	display: inline-block;
	vertical-align: middle;
}

/* 抽屉内容：上面信息、下面图片，整体撑满抽屉高度 */
.sku_detail {
	display: flex;
	flex-direction: column;
	gap: 12px;
	height: 100%;
}

.sku_detail_info {
	flex: 0 0 auto;
}

/* 图片区吃掉剩下的所有高度，避免下面留白 */
.sku_detail_imgs {
	flex: 1 1 auto;
	min-height: 220px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border-radius: 4px;
}

.sku_detail_imgs :deep(.el-carousel) {
	width: 100%;
	height: 100%;
}

/* 图片自适应容器，不变形 */
.sku_detail_img {
	width: 100%;
	height: 100%;
	background-color: #f5f7fa;
}

/* 图片加载不出来时的占位 */
.sku_detail_img_empty {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #c0c4cc;
	background-color: #f5f7fa;
}

/* 属性标签之间的间距 */
.sku_tag {
	margin: 2px 6px 2px 0;
}

/* 图片加载不出来时的占位 */
.sku_img_fallback {
	width: 56px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #c0c4cc;
	background-color: #f5f7fa;
	border-radius: 4px;
}

.el-carousel__item h3 {
	color: #475669;
	opacity: 0.75;
	line-height: 200px;
	margin: 0;
	text-align: center;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: #d3dce6;
}
</style>
