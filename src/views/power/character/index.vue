<script setup lang="ts">
import { notify } from '../../../utils/notify'
import { ref, reactive, onMounted, nextTick } from 'vue'
import { reqRoleList, reqAddorUpdataRole, reqGetPower, reqSetPower,reqDeletePower } from '../../../api/acl/character/index'
import useSettingStore from '../../../store/modules/setting'
import type { RoleRecordsData, RoleInfo, PowerRoleData, } from '../../../api/acl/character/type'
import type { FormInstance } from 'element-plus'

const roleName = ref('')
// 分页
const pageNo = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)

const RoleList = ref<RoleRecordsData[]>([])
const dialogVisible = ref<boolean>(false)
const drawer = ref<boolean>(false)
const tree = ref()

// 新增 / 修改共用的表单数据（有 id 就是修改）
const RoleParams = reactive<RoleInfo>({
	id: undefined,
	roleName: '',
	remark: '',
})
const roleForm = ref<FormInstance>()
const MenuList = ref<PowerRoleData[]>([])
const defaultProps = {
	children: 'children',
	label: 'name'
}
const SelectList = ref<number[]>([])

onMounted(() => {
	GetRoleList()
})
function GetRoleList() {
	reqRoleList(pageNo.value, pageSize.value, roleName.value).then(result => {
		if (result.code == 200) {
			total.value = result.data.total
			RoleList.value = result.data.records
		}
	})
}

function changeSize() {
	pageNo.value = 1
	GetRoleList()
}

function Searchit() {
	pageNo.value = 1
	GetRoleList()
}

function reset() {
	useSettingStore().refresh = !useSettingStore().refresh
}

// ------- 表单校验 -------
function validatorRoleName(_rule: any, value: string, callback: any) {
	if (!value || !value.trim()) {
		callback(new Error('请输入角色名称'))
	} else if (value.trim().length < 5) {
		callback(new Error('角色名称长度不能少于五个字'))
	} else {
		callback()
	}
}

const rules = {
	roleName: [{ required: true, trigger: 'change', validator: validatorRoleName }],
}

// 打开弹窗前清掉上一次的校验提示
function clearValidate() {
	nextTick(() => roleForm.value?.clearValidate())
}

// 添加角色
function addRole() {
	Object.assign(RoleParams, { id: undefined, roleName: '', remark: '' })
	clearValidate()
	dialogVisible.value = true
}

// 更新角色：把当前行的数据回填
function updataRole(row: RoleRecordsData) {
	Object.assign(RoleParams, { id: row.id, roleName: row.roleName, remark: row.remark })
	clearValidate()
	dialogVisible.value = true
}

// 提交（有 id 走更新，没有 id 走新增）
async function submitRole() {
	try {
		await roleForm.value?.validate()
	} catch {
		return
	}
	RoleParams.roleName = RoleParams.roleName.trim()
	const result = await reqAddorUpdataRole(RoleParams)
	if (result.code === 200) {
		notify('success', RoleParams.id ? '更新成功' : '添加成功')
		dialogVisible.value = false
		if (RoleParams.id) {
			GetRoleList()
		} else {
			pageNo.value = 1
			GetRoleList()
		}
	}
}

function assignPower(row: RoleRecordsData) {
	drawer.value = !drawer.value
	SelectList.value = []
	Object.assign(RoleParams, row)
	reqGetPower(row.id).then(result => {
		if (result.code == 200) {
			MenuList.value = result.data
			FilterSelect(result.data, SelectList.value)
		}
	})

}

function FilterSelect(AllSelect: PowerRoleData[], initarr: number[]) {
	AllSelect.forEach(item => {
		if (item.select && item.level == 4) {
			initarr.push(item.id)
		}
		if (item.children.length > 0) {
			FilterSelect(item.children, initarr)
		}
	})

}

function Handle() {
	const selectarr = tree.value.getCheckedKeys().concat(tree.value.getHalfCheckedKeys())
	reqSetPower(RoleParams.id as number, selectarr).then(result => {
		if (result.code == 200) {
			notify('success', '修改权限成功')
			drawer.value = !drawer.value
			window.location.reload()
		}

	})
}

function DeleteRole(row:RoleRecordsData){
	reqDeletePower(row.id).then(result=>{
		if(result.code == 200){
			notify('success', '删除成功')
			RoleList.value.length >1?pageNo.value:pageNo.value-1
			GetRoleList()
		}
	})

}
</script>

<template>
	<div class="role_page">
		<!-- 搜索区 -->
		<el-card class="search_card">
			<el-form :inline="true" class="search_form">
				<el-form-item label="角色名:">
					<el-input v-model="roleName" placeholder="请输入角色名" style="width: 220px" clearable />
				</el-form-item>
				<div class="search_btns">
					<el-button type="primary" icon="Search" @click="Searchit()"
						:disabled="roleName ? false : true">搜索</el-button>
					<el-button icon="Refresh" @click="reset()">重置</el-button>
				</div>
			</el-form>
		</el-card>

		<!-- 列表区 -->
		<el-card style="margin-top: 10px;">
			<el-button type="primary" icon="Plus" v-has="'btn.Role.add'" @click="addRole()">添加角色</el-button>
			<el-button type="danger" plain icon="Delete" v-has="'btn.Role.remove'">批量删除</el-button>

			<el-table border style="margin: 10px 0;" :data="RoleList">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column type="index" label="#" width="60" align="center" />
				<el-table-column label="id" prop="id" width="150" align="center" />
				<el-table-column label="角色名称" prop="roleName" min-width="140" show-overflow-tooltip />
				<el-table-column label="备注" prop="remark" min-width="160" show-overflow-tooltip />
				<el-table-column label="创建时间" prop="createTime" width="180" show-overflow-tooltip />
				<el-table-column label="更新时间" prop="updateTime" width="180" show-overflow-tooltip />
				<el-table-column label="操作" width="310" align="center">
					<template #="{ row }">
						<el-button type="primary" size="small" icon="Setting" v-has="'btn.Role.assgin'"
							@click="assignPower(row as RoleRecordsData)">分配权限</el-button>
						<el-button type="primary" size="small" icon="Edit" v-has="'btn.Role.update'"
							@click="updataRole(row as RoleRecordsData)">编辑</el-button>
						<el-button type="danger" size="small" icon="Delete" v-has="'btn.Role.remove'" @click="DeleteRole(row as RoleRecordsData)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination :page-sizes="[3, 5, 7]" size="default" background
				layout="prev, pager, next,->,jumper,sizes,total" :total="total" :pager-count="5"
				v-model:current-page="pageNo" v-model:page-size="pageSize" @current-change="GetRoleList"
				@size-change="changeSize()" />
		</el-card>

		<!-- 添加 / 更新角色 -->
		<el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新角色' : '添加角色'" width="500px">
			<el-form ref="roleForm" :model="RoleParams" :rules="rules" label-width="90px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="RoleParams.roleName" placeholder="请输入角色名称（不少于五个字）" clearable />
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="RoleParams.remark" type="textarea" :rows="3" placeholder="请输入备注" />
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitRole()">确定</el-button>
			</template>
		</el-dialog>

		<el-drawer v-model="drawer" title="分配菜单与按钮的权限" size="40%">
			<el-tree style="max-width: 600px" :data="MenuList" show-checkbox node-key="id" default-expand-all
				:default-checked-keys="SelectList" :props="defaultProps" ref="tree" />
			<template #footer>
				<el-button type="success" size="small" icon="Plus" @click="Handle()">确定</el-button>
				<el-button type="danger" size="small" icon="Delete">删除</el-button>
			</template>
		</el-drawer>
	</div>
</template>

<style scoped>
.role_page {
	padding: 8px;
}

/* 搜索表单：左边条件、右边按钮 */
.search_form {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 10px;
}

.search_form :deep(.el-form-item) {
	margin-bottom: 0;
}

.search_btns {
	display: flex;
	gap: 10px;
}
</style>
