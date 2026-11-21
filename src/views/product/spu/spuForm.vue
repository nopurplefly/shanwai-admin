<!-- 添加修改spu -->
<script setup lang="ts">
import { notify } from '../../../utils/notify'
import { ref, computed, reactive, nextTick } from 'vue';
import type { recordsData, trademarkData, trademark, reqspuImageLis, reqspuSaleAttrListData, reqbaseSaleAttrList, spuImageListData, spuSaleAttrListData, baseSaleAttrList } from '../../../api/product/spu/type.ts'
import { reqBaseList, reqSPUImage, reqSPUSaleList, reqTradeMark, reqAddorUpadataSPU } from '../../../api/product/spu/index.ts'
import type { UploadUserFile, UploadFile } from 'element-plus'

// 顶层 ref
let eleimage = ref<UploadUserFile[]>([])
//子传父
let $emit = defineEmits(['changeScene'])
function cancel() {
	$emit('changeScene', 0)
}
//手机没有的id和属性名字
let idANDname = ref<string>()


//存储的数据
let TradeMark = ref<trademarkData[]>([])
let SPUImageData = ref<spuImageListData[]>([])
let SPUSaleData = ref<spuSaleAttrListData[]>([])
let SPUBaseData = ref<baseSaleAttrList[]>([])
let SPUParams = ref<recordsData>({
	spuName: '',
	description: '',
	category3Id: 0,
	tmId: 0,
	spuImageList: [],
	spuSaleAttrList: [],
})

// 展示已有 SPU：把行数据深拷贝进表单，并补齐图片 / 销售属性 / 品牌 / 基础销售属性
async function getspulist(spu: recordsData) {
	//没有 id 说明是新增场景，不需要拉取已有 SPU 的图片/销售属性
	if (!spu.id) return
	//父组件调用子组件的方法
	let Alltrademark: trademark = await reqTradeMark()
	let SPUImage: reqspuImageLis = await reqSPUImage(spu.id)
	let SPUSale: reqspuSaleAttrListData = await reqSPUSaleList(spu.id)
	let SPUBase: reqbaseSaleAttrList = await reqBaseList()

	//存储可选项数据
	TradeMark.value = Alltrademark.data
	SPUImageData.value = SPUImage.data
	SPUSaleData.value = SPUSale.data
	SPUBaseData.value = SPUBase.data

	//图片列表（回显到上传组件）
	eleimage.value = SPUImage.data.map(item => {
		return {
			name: item.imgName,
			url: item.imgUrl
		}
	})

	//深拷贝回填表单，避免直接改动列表里那一行
	SPUParams.value = {
		...spu,
		spuImageList: SPUImage.data.map(item => ({ ...item })),
		spuSaleAttrList: (SPUSale.data || []).map(item => ({
			...item,
			spuSaleAttrValueList: (item.spuSaleAttrValueList || []).map(v => ({ ...v })),
		})),
	}
}
//暴露子组件方法
defineExpose({ getspulist, initAddSpu })

// ------- 图片预览 / 删除 -------
const previewVisible = ref(false)
const previewUrl = ref('')

// 点击图片上的"放大镜"图标
function handlePreview(file: UploadFile) {
	previewUrl.value = file.url || ''
	previewVisible.value = true
}

// el-upload 自己发请求，需要手动带上 Token
const uploadHeaders = { Token: localStorage.getItem('TOKEN') || '' }

// 新增或删除图片后（on-change 在增、删时都会触发），把最新列表同步回 SPUParams
function handleImgChange(_file: UploadFile, fileList: UploadUserFile[]) {
	SPUParams.value.spuImageList = fileList.map((item) => {
		// 已存在的图片保留原来的 id / spuId
		const origin = SPUImageData.value.find((img) => img.imgUrl === item.url)
		if (origin) return { ...origin }
		// 新图片取上传成功后后端返回的地址，还没传完的 imgUrl 为空，下面会被过滤掉
		return { imgName: item.name, imgUrl: (item as any).imgUrl || '' }
	}).filter((img) => img.imgUrl)
}

// 上传成功：把后端返回的图片地址记到这条文件上，再同步进表单
function handleUploadSuccess(response: any, file: UploadFile) {
	if (response.code === 200) {
		;(file as any).imgUrl = String(response.data)
		handleImgChange(file, eleimage.value)
	} else {
		notify('error', '图片上传失败')
	}
}

// 点"删除"图标时 el-upload 只会触发 on-remove，不会触发 on-change，这里单独同步一次
function handleImgRemove(_file: UploadFile, fileList: UploadUserFile[]) {
	handleImgChange(_file, fileList)
}

//计算SPU还没有的销售属性（按当前表单里已有的属性名过滤）
let unSPUSalevalue = computed(() => {
	return SPUBaseData.value.filter(item => {
		return SPUParams.value.spuSaleAttrList.every(item1 => {
			return item1.saleAttrName !== item.name
		})
	})
})
//添加销售属性
function addSaleValue() {
	if (!idANDname.value) return
	const [baseSaleAttrId, saleAttrName] = idANDname.value.split(':')
	let newSaleArr: spuSaleAttrListData = {
		baseSaleAttrId: Number(baseSaleAttrId),
		saleAttrName,
		spuSaleAttrValueList: [],
	}
	SPUParams.value.spuSaleAttrList.push(newSaleArr)
	idANDname.value = ''
}

// ------- 销售属性值：添加 / 删除 -------
// 每个销售属性各自的输入框状态，key 用 saleAttrName（同一 SPU 内不会重复）
const saleInputState = reactive<Record<string, { visible: boolean; value: string }>>({})
const saleInputRefs = new Map<string, any>()

function saleInputOf(name: string) {
	return saleInputState[name] || { visible: false, value: '' }
}

function setSaleInputRef(name: string, el: any) {
	if (el) saleInputRefs.set(name, el)
}

// 点"+"：显示输入框并自动聚焦
function showSaleInput(row: any) {
	saleInputState[row.saleAttrName] = { visible: true, value: '' }
	nextTick(() => saleInputRefs.get(row.saleAttrName)?.focus?.())
}

// 回车或失焦：把输入框里的值加到当前销售属性下
function confirmSaleValue(row: any) {
	const state = saleInputState[row.saleAttrName]
	if (!state || !state.visible) return
	const text = state.value.trim()
	state.visible = false
	state.value = ''
	if (!text) return
	if (row.spuSaleAttrValueList.some((v: any) => v.saleAttrValueName === text)) {
		notify('error', '属性值不能重复')
		return
	}
	row.spuSaleAttrValueList.push({
		saleAttrValueName: text,
		baseSaleAttrId: Number(row.baseSaleAttrId),
	})
}

// 删除某个属性值
function removeSaleValue(row: any, value: any) {
	const index = row.spuSaleAttrValueList.indexOf(value)
	if (index > -1) row.spuSaleAttrValueList.splice(index, 1)
}

// ------- 添加（新建 SPU）：清空表单并加载品牌 / 基础销售属性 -------
async function initAddSpu(c3id: number) {
	SPUParams.value = {
		spuName: '',
		description: '',
		category3Id: c3id || 0,
		tmId: 0,
		spuImageList: [],
		spuSaleAttrList: [],
	}
	eleimage.value = []
	SPUImageData.value = []
	SPUSaleData.value = []
	idANDname.value = ''
	Object.keys(saleInputState).forEach(key => delete saleInputState[key])

	const [tm, base]: any = await Promise.all([reqTradeMark(), reqBaseList()])
	TradeMark.value = tm.data
	SPUBaseData.value = base.data
}

// ------- 保存（新增 / 修改共用一个接口） -------
async function save() {
	const data = SPUParams.value
	if (!data.spuName || !data.spuName.trim()) {
		notify('error', '请输入SPU名称')
		return
	}
	if (!data.tmId) {
		notify('error', '请选择SPU品牌')
		return
	}
	if (!data.category3Id) {
		notify('error', '请先选择三级分类')
		return
	}
	for (const attr of data.spuSaleAttrList) {
		if (!attr.spuSaleAttrValueList.length) {
			notify('error', `销售属性「${attr.saleAttrName}」还没有属性值`)
			return
		}
	}

	// 图片列表已在上传成功 / 删除时同步进 spuImageList，这里只做去空格
	data.spuName = data.spuName.trim()

	//后端新增时会把属性值的 baseSaleAttrId 存成 null，更新时再传 null 会报"服务繁忙"，这里补齐
	data.spuSaleAttrList.forEach(attr => {
		attr.baseSaleAttrId = Number(attr.baseSaleAttrId)
		attr.spuSaleAttrValueList.forEach(v => {
			v.baseSaleAttrId = Number(attr.baseSaleAttrId)
		})
	})

	const result: any = await reqAddorUpadataSPU(data)
	if (result.code === 200) {
		notify('success', data.id ? '修改成功' : '添加成功')
		$emit('changeScene', 0)
	} else {
		notify('error', result.message || '保存失败')
	}
}
</script>

<template>
	<div class="spu-form-wrap">
		<el-form label-width="110px" class="spu-form">
			<el-form-item label="SPU名称">
				<el-input placeholder="请输入SPU名称" v-model="SPUParams.spuName" />
			</el-form-item>
			<el-form-item label="SPU品牌">
				<el-select placeholder="请选择品牌" style="width: 320px" v-model="SPUParams.tmId">
					<el-option :value="item.id" v-for="(item) in TradeMark" :label="item.tmName" :key="item.id" />
				</el-select>
			</el-form-item>

			<el-form-item label="SPU描述">
				<el-input type="textarea" :rows="4" placeholder="请输入描述" v-model="SPUParams.description" />
			</el-form-item>

			<el-form-item label="SPU照片">
				<el-upload action="/api/admin/product/fileUpload" list-type="picture-card" :headers="uploadHeaders"
					v-model:file-list="eleimage" :on-preview="handlePreview" :on-change="handleImgChange"
					:on-success="handleUploadSuccess"
					:on-remove="handleImgRemove">
					<el-icon>
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>

			<el-form-item label="SPU销售属性">
				<el-select :placeholder="unSPUSalevalue.length ? `还未选择${unSPUSalevalue.length}个属性` : '没有属性'"
					style="width: 200px" v-model="idANDname">
					<el-option :value="`${item.id}:${item.name}`" v-for="item in unSPUSalevalue" :key="item.id"
						:label="item.name"></el-option>
				</el-select>
				<el-button type="primary" icon="Plus" style="margin-left: 10px"
					:disabled="idANDname ? false : true" @click="addSaleValue()">添加销售属性</el-button>
			</el-form-item>

			<el-form-item>
				<el-table border style="width: 100%" :data="SPUParams.spuSaleAttrList">
					<el-table-column type="index" label="序号" width="80" align="center" />
					<el-table-column label="属性名" align="center" prop="saleAttrName" />
					<el-table-column label="属性值" align="center">
						<template #="{ row }">
							<el-tag v-for="item in row.spuSaleAttrValueList" :key="item.saleAttrValueName"
								class="sale_tag" closable @close="removeSaleValue(row, item)">
								{{ item.saleAttrValueName }}
							</el-tag>

							<!-- 输入框：回车或失焦提交 -->
							<el-input v-if="saleInputOf(row.saleAttrName).visible" size="small" class="sale_input"
								:ref="(el: any) => setSaleInputRef(row.saleAttrName, el)"
								v-model="saleInputOf(row.saleAttrName).value" placeholder="请输入属性值"
								@keyup.enter="confirmSaleValue(row)" @blur="confirmSaleValue(row)" />

							<el-button v-else type="success" icon="Plus" size="small"
								@click="showSaleInput(row)"></el-button>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="120">
						<template #="{ $index }">
							<el-button size="small" type="danger" icon="Delete"
								@click="SPUParams.spuSaleAttrList.splice($index, 1)"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="save()">保存</el-button>
				<el-button @click="cancel()">取消</el-button>
			</el-form-item>
		</el-form>

		<!-- 图片预览 -->
		<el-dialog v-model="previewVisible" title="图片预览" width="520px" append-to-body>
			<img :src="previewUrl" alt="图片预览" class="preview-img" />
		</el-dialog>
	</div>
</template>

<style scoped>
.spu-form {
	margin-top: 10px;
}

/* 照片上传框：保持方形的 picture-card 样式 */
.spu-form :deep(.el-upload--picture-card) {
	width: 120px;
	height: 120px;
	line-height: 120px;
}

.spu-form :deep(.el-upload-list--picture-card .el-upload-list__item) {
	width: 120px;
	height: 120px;
}

/* 销售属性值标签 */
.sale_tag {
	margin: 2px 4px 2px 0;
}

/* 添加属性值的输入框 */
.sale_input {
	display: inline-block;
	width: 130px;
	vertical-align: middle;
}

/* 预览大图 */
.preview-img {
	display: block;
	width: 100%;
	max-height: 70vh;
	object-fit: contain;
}
</style>
