<script setup lang="ts">
import { notify } from '../../../utils/notify'
import type { UploadRawFile } from 'element-plus'
import { ref, onMounted, reactive, computed, } from 'vue'
import { reqHasTrademark, reqUpdateandAddTrademark,reqDeleteTrademark } from '../../../api/product/trademark/index'
import type { TrademarkRecord, Trademark, } from '../../../api/product/trademark/type'
let CurrentPage = ref(1)
let limit = ref(5)
let total = ref(0)
let Trademarks = ref<TrademarkRecord[]>([])
let dialogVisible = ref(false)
//收集表单数据
let TrademarkParams = reactive<Trademark>({
	tmName: '',
	logoUrl: ''
})
let refForm = ref()

// el-upload 是直接发请求的，不走 axios 拦截器，需要手动带上 Token
const uploadHeaders = computed(() => ({ Token: localStorage.getItem('TOKEN') || '' }))

// 上传约束：只能 JPG / PNG / GIF，且不超过 4MB
const MAX_SIZE = 4 * 1024 * 1024
const ALLOW_TYPE = ['image/jpeg', 'image/png', 'image/gif']

// 上传前校验：不合格直接拦截并提示
function beforeUpload(rawFile: UploadRawFile) {
	const typeOk = ALLOW_TYPE.includes(rawFile.type) || /\.(jpe?g|png|gif)$/i.test(rawFile.name)
	if (!typeOk) {
		notify('error', '只能上传 JPG、PNG、GIF 格式的图片')
		return false
	}
	if (rawFile.size > MAX_SIZE) {
		notify('error', '图片大小不能超过 4MB')
		return false
	}
	return true
}

//上传成功：把后端返回的图片地址存到 logoUrl
function successUpload(response: any, _file: any, _fileList: any) {
	refForm.value.clearValidate()
	if (response && response.code === 200) {
		const url = typeof response.data === 'string'
			? response.data
			: response.data?.logoUrl ?? response.data?.url
		TrademarkParams.logoUrl = url || ''
		notify('success', '图片上传成功')
	} else {
		notify('error', response?.message || '图片上传失败')
	}
}

// 上传请求失败时的提示
function onUploadError() {
	notify('error', '图片上传失败，请稍后重试')
}

onMounted(async () => {
	getHasTrademark()
})

async function getHasTrademark() {
	let result = await reqHasTrademark(CurrentPage.value, limit.value)
	if (result.code == 200) {
		total.value = result.data.total
		Trademarks.value = result.data.records
	}
}

function changePage() {

	getHasTrademark()
}
function changeTrademark() {
	TrademarkParams.logoUrl = '',
		TrademarkParams.tmName = '',
		dialogVisible.value = !dialogVisible.value
	refForm.value?.clearValidate('tmName')
	refForm.value?.clearValidate('logoUrl')
}

// 点击"修改"：把当前行数据回填到表单
function UpdateTrademark(row: TrademarkRecord) {
	TrademarkParams.id = row.id
	TrademarkParams.tmName = row.tmName
	TrademarkParams.logoUrl = row.logoUrl
	dialogVisible.value = true
	refForm.value?.clearValidate('tmName')
	refForm.value?.clearValidate('logoUrl')
}

// 确定：提交表单，新增还是修改由 reqUpdateandAddTrademark 内部按 id 判断
async function saveTrademark() {
	//表单校验
	await refForm.value.validate()
	if (!TrademarkParams.tmName.trim()) {
		notify('error', '请输入品牌名称')
		return
	}
	try {
		await reqUpdateandAddTrademark({ ...TrademarkParams })
		// 提交完把 id 清掉，避免下次点"添加品牌"时还带着上一条的 id
		TrademarkParams.id = undefined
		notify('success', '操作成功')
		dialogVisible.value = false
		getHasTrademark()
	} catch {
		notify('error', '保存失败，请稍后重试')
	}
}

//表单校验
const rules = {
	tmName: [{
		required: true, trigger: 'change', validator: validatorTmName
	}],
	logoUrl: [{ required: true, trigger: 'change', validator: validatorLogoUrl }],
}

function validatorTmName(_rule: any, value: any, callBack: any) {
	if (value.trim().length < 2 || value == '') {
		callBack(new Error('品牌名称必须大于2'))
	} else {
		callBack()
	}
}

function validatorLogoUrl(_rule: any, value: any, callBack: any) {
	if (value == '') {
		callBack(new Error('图片不为空'))
	} else {
		callBack()
	}
}

//删除表格元素
async function deleteItem(id:number){
	await reqDeleteTrademark(id)
	getHasTrademark()
	Trademarks.value.length<1 ?CurrentPage.value : CurrentPage.value-1
}
</script>

<template>
	<!-- 必须要有一个根元素：多根节点放进 <transition> 会报
	     "Component inside <Transition> renders non-element root node"，切页动画失效 -->
	<div class="task_page">
		<el-card shadow="always">
			<el-button type="primary" round icon="Plus" v-has="'btn.Trademark.add'" @click="changeTrademark()">添加品牌</el-button>
			<el-table border style="width: 100%;margin: 15px 0;" :data="Trademarks">
				<el-table-column label="序号" width="80px" type="index" align="center" />
				<el-table-column label="品牌名称" align="center" prop="tmName">
					<template #="{ row }">
						{{ row.tmName }}
					</template>
				</el-table-column>
				<el-table-column label="品牌LOGO" align="center">
					<template #="{ row }">
						<img :src="row.logoUrl" alt="无图片" style="width: 80px; height: 80px;">
					</template>
				</el-table-column>

				<el-table-column label='品牌操作' align="center">
					<template #="{ row }">
						<el-button type="warning" round icon="Edit" size="small" v-has="'btn.Trademark.update'"
							@click="UpdateTrademark(row as TrademarkRecord)">修改</el-button>
						<el-popconfirm confirm-button-text="Yes" cancel-button-text="No" icon="InfoFilled"
							icon-color="#626AEF" title="你确定要删除此条品牌信息吗？" @confirm="deleteItem(row.id)">
							<template #reference>
								<el-button type="danger" round icon="Delete" size="small" v-has="'btn.Trademark.remove'">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @change="changePage()" v-model:current-page='CurrentPage' v-model:page-size=limit
				:page-sizes="[5, 7, 9]" size='large' background layout="prev, pager, next,->,jumper,sizes,total"
				:total=total />
		</el-card>
		<el-dialog v-model="dialogVisible" :title="TrademarkParams.id ? '修改品牌' : '新增品牌'" width="500">
			<el-form :model="TrademarkParams" :rules="rules">
				<el-form-item label="添加品牌:" prop="tmName">
					<el-input autocomplete="off" style="width: 80%;" placeholder="请您输入品牌名称"
						v-model="TrademarkParams.tmName" />
				</el-form-item>
				<el-form-item label="品牌LOGO:" prop="logoUrl" ref="refForm">
					<el-upload class="upload-demo" drag multiple action="/api/admin/product/fileUpload"
						:headers="uploadHeaders" accept=".jpg,.jpeg,.png,.gif" :before-upload="beforeUpload"
						:on-error="onUploadError" :on-success="successUpload">
						<el-icon class="el-icon--upload" v-if="!TrademarkParams.logoUrl"><upload-filled /></el-icon>
						<div class="el-upload__text">
							<img :src="TrademarkParams.logoUrl" v-if="TrademarkParams.logoUrl"
								style="width: 90%;height: 90%;">
							<span v-if="!TrademarkParams.logoUrl">拖动图片至此处 或者 <em>点击上传图片</em></span>
						</div>
						<template #tip>
							<div class="el-upload__tip">只能上传 JPG / PNG / GIF 图片，且大小不超过 4MB</div>
						</template>
					</el-upload>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="success" icon="Edit" @click="saveTrademark()">确定</el-button>
				<el-button type="danger" icon="Delete" @click="dialogVisible = false">取消</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped>
.task_page {
	height: 100%;
}
</style>
