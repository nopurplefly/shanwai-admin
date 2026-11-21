<script setup lang="ts">
import { notify } from '../../../utils/notify'
import { reactive, ref, watch, nextTick } from 'vue'
import Catagraph from '../../../components/catagraoh/index.vue'
import { reqCategoryValue, reqUpdataorCategory, reqDeleteAttr } from '../../../api/product/attr/index.ts'
import Button from '../../../components/button/index.vue'
import type { ValueDate, } from '../../../api/product/attr/type.ts'
import { ElForm, ElButton } from 'element-plus'
// 子组件回传的三个分类 id
const categoryIds = ref<{ c1id: number; c2id: number; c3id: number }>({ c1id: 0, c2id: 0, c3id: 0 })
let attrArr = ref<ValueDate[]>([])
let scene = ref<number>(0)   //0显示属性页  1显示修改页

// 属性值行：isEdit 控制"编辑模式/观察模式"
type AttrValueRow = {
	valueName: string
	attrId?: number
	id?: number
	isEdit?: boolean
}

async function getAttr() {
	const { c1id, c2id, c3id } = categoryIds.value
	// 三级没选中时清空表格，不发无效请求
	if (!c1id || !c2id || !c3id) {
		attrArr.value = []
		return
	}
	let result = await reqCategoryValue(c1id, c2id, c3id)
	if (result.code == 200) {
		attrArr.value = result.data
		attrParams.categoryId = c3id
	}
}
watch(() => categoryIds.value.c3id, () => {
	getAttr()
})

//属性值数据
let attrParams = reactive<{
	id?: number
	attrName: string
	categoryId: number | string
	categoryLevel: number
	attrValueList: AttrValueRow[]
}>({
	id: undefined,
	attrName: '',
	categoryId: 0,
	categoryLevel: 3,
	attrValueList: [],
})

// 添加：清空表单再进入编辑场景
function changeScene() {
	attrParams.id = undefined
	attrParams.attrName = ''
	attrParams.categoryId = categoryIds.value.c3id
	attrParams.categoryLevel = 3
	attrParams.attrValueList = []
	scene.value = 1
}

// 修改：把当前行回填到表单
function editAttr(row: any) {
	const item = row as any
	attrParams.id = item.id
	attrParams.attrName = item.attrName
	attrParams.categoryId = item.categoryId
	attrParams.categoryLevel = item.categoryLevel ?? 3
	attrParams.attrValueList = (item.attrValueList || []).map((v: any) => ({
		valueName: v.valueName,
		attrId: v.attrId,
		id: v.id,
		isEdit: false,
	}))
	scene.value = 1
}

function pushParames() {
	attrParams.attrValueList.push({ valueName: '', isEdit: true })
}

// 观察模式 -> 编辑模式，并自动聚焦
const inputRefs = new Map<any, any>()
function setInputRef(row: any, el: any) {
	if (el) inputRefs.set(row, el)
}
function startEdit(row: any) {
	row.isEdit = true
	nextTick(() => inputRefs.get(row)?.focus?.())
}

// 删除一个属性值（保存时整表提交，后端按 id 增删）
function delValue(index: number) {
	attrParams.attrValueList.splice(index, 1)
}

// 删除整条属性
async function delAttr(row: any) {
	let result: any = await reqDeleteAttr(row.id)
	if (result.code == 200) {
		notify('success', '删除成功')
		getAttr()
	} else {
		notify('error', result.message || '删除失败')
	}
}

// 输入框失焦：去掉首尾空格后切回观察模式
function onValueBlur(row: any) {
	row.valueName = (row.valueName || '').trim()
	row.isEdit = false
}

// 校验属性值：不能为空、不能重复
function checkValueList() {
	const names = attrParams.attrValueList.map((v) => (v.valueName || '').trim())
	if (names.length === 0) {
		notify('error', '请至少添加一个属性值')
		return false
	}
	if (names.some((n) => n === '')) {
		notify('error', '属性值不能为空')
		return false
	}
	if (new Set(names).size !== names.length) {
		notify('error', '属性值不能重复')
		return false
	}
	// 统一写回去掉空格后的值
	attrParams.attrValueList.forEach((v, i) => {
		v.valueName = names[i]
	})
	return true
}

async function save() {
	if (!checkValueList()) return
	attrParams.attrName = (attrParams.attrName || '').trim()
	// isEdit 只服务于界面，提交时去掉
	const payload = {
		...attrParams,
		attrValueList: attrParams.attrValueList.map(({ valueName, attrId, id }) => ({ valueName, attrId, id })),
	}
	let result = await reqUpdataorCategory(payload as any)
	if (result.code == 200) {
		scene.value = 0
		notify('success', '保存成功')
		getAttr()
	}
}
</script>

<template>
	<div class="page">
		<el-card>
			<Catagraph @ids="categoryIds = $event" :scene="scene"></Catagraph>
		</el-card>
		<div v-show="scene == 0">
			<el-card style="margin: 10px 0;">
				<el-button size="default" type="primary" icon="Plus" v-has="'btn.Attr.add'" @click="changeScene()"
					:disabled="categoryIds.c3id?false:true">添加平台属性</el-button>
				<el-table border style="margin: 10px 0;" :data="attrArr">
					<el-table-column align="center" type="index" label="序号"></el-table-column>
					<el-table-column align="center" label="属性名称" prop="attrName"></el-table-column>
					<el-table-column label="属性值名称">
						<template #default="{ row }">
							<el-tag v-for="item in row.attrValueList" :key="item.id" class="attr_tag" type="info">
								{{ item.valueName }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="220">
						<template #default="{ row }">
							<Button @edit="editAttr(row)" @del="delAttr(row)"></Button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</div>
		<div v-show="scene == 1">
			<ElCard style="margin: 10px 0;">
				<el-form :inline="true">
					<ElFormItem label="属性名称">
						<ElInput placeholder="请您输入属性的名字" v-model="attrParams.attrName"></ElInput>
					</ElFormItem>
					<div>
						<el-button size="default" type="primary" icon="Plus"
							:disabled="attrParams.attrName?false:true" @click="pushParames()">添加属性值</el-button>
						<el-button size="default" link @click="scene = 0">取消</el-button>
					</div>

					<el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
						<el-table-column align="center" type="index" label="序号"></el-table-column>
						<el-table-column label="属性值">
							<template #default="{ row }">
								<!-- 编辑模式 -->
								<ElInput v-if="row.isEdit" :ref="(el: any) => setInputRef(row, el)"
									placeholder="请输入您的属性值" v-model="row.valueName" class="attr_value_edit"
									@blur="onValueBlur(row)"></ElInput>
								<!-- 观察模式 -->
								<span v-else class="attr_value_view" @click="startEdit(row)">
									{{ row.valueName || '点击编辑' }}
								</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="操作" width="120">
							<template #default="{ $index }">
								<el-button type="danger" round icon="Delete" size="small"
									@click="delValue($index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form>
				<el-button size="default" type="success" @click="save()">保存</el-button>
				<el-button size="default" link @click="scene = 0">取消</el-button>
			</ElCard>
		</div>


	</div>
</template>

<style scoped>
.page {
	padding: 8px;
}

/* 属性值 tag 之间留一点间距，换行也整齐 */
.attr_tag {
	margin: 3px 6px 3px 0;
}

/* 观察模式：一块可点击的浅灰块 */
.attr_value_view {
	display: inline-block;
	min-width: 140px;
	padding: 4px 10px;
	border-radius: 4px;
	cursor: pointer;
	background-color: #f2f3f5;
	color: #606266;
}

.attr_value_view:hover {
	background-color: #e9eaec;
}

/* 编辑模式的输入框 */
.attr_value_edit {
	width: 100%;
}

.page_title {
	margin: 0 0 6px;
	font-size: 20px;
	font-weight: 600;
	color: #1f2937;
}

.page_desc {
	margin: 0;
	font-size: 14px;
	color: #4b5563;
}

/* 表单内容始终水平居中（多行时每行也居中），并垂直对齐 */
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
