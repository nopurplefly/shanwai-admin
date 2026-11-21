<script setup lang="ts">
import { notify } from '../../../utils/notify'
import { ref, onMounted, reactive, computed } from 'vue'
import { reqGetUserList, reqUpdataOrAddUser, reqRoleUser, reqAssignRole,reqDeleteUser,reqBatchDelete } from '../../../api/acl/user/index'
import type { UserData, ResponseData, UserInfoData, UserInfo, allRolesList, assignRoles } from '../../../api/acl/user/type'
import useSettingStore from '../../../store/modules/setting'
import { ElForm } from 'element-plus'
import type { FormInstance } from 'element-plus'
// 搜索条件
const username = ref<string>('')
const drawer = ref(false)
const drawer1 = ref(false)
// 分页
const pageNo = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(5)
const userList = ref<UserInfoData[]>([])
const UserParams = reactive<UserInfo>({
	username: '',
	name: '',
	password: '',
})
const form = ref<FormInstance>()
const AllRole = ref<allRolesList[]>([])
const UserRole = ref<number[]>([])
const batchnum = ref<number[]>([])


async function getUserList() {
	const res: ResponseData<UserData> = await reqGetUserList(pageNo.value, pageSize.value,username.value)
	total.value = res.data.total
	userList.value = res.data.records
}

onMounted(() => {
	getUserList()
})

function handchange() {
	pageNo.value = 1
	getUserList()
}

function addUser() {
	form.value?.clearValidate('username')
	form.value?.clearValidate('name')
	form.value?.clearValidate('password')
	drawer.value = true
	Object.assign(UserParams, {
		id: '',
		username: '',
		name: '',
		password: '',
	})

}

function updataUser(row: UserInfoData) {
	form.value?.clearValidate('username')
	form.value?.clearValidate('name')
	drawer.value = true
	Object.assign(UserParams, row)

}

async function addUserInfo() {
	try {
		await form.value?.validate()
	} catch {
		return
	}
	reqUpdataOrAddUser(UserParams).then(result => {
		if (result.code == 200) {
			drawer.value = false
			notify('success', UserParams.id ? '更新成功' : '添加成功')
			UserParams.id ? pageNo.value : pageNo.value = 1
			getUserList()
		}
	})
}
//表单校验
function validatorusername(_rule: any, value: any, callBack: any) {
	if (value.trim().length >= 5) {
		callBack()
	} else {
		callBack(new Error('用户名字长度需要大于五位'))
	}
}

function validatorname(_rule: any, value: any, callBack: any) {
	if (value.trim().length >= 5) {
		callBack()
	} else {
		callBack(new Error('用户名字长度需要大于五位'))
	}
}

function validatorpassword(_rule: any, value: any, callBack: any) {
	if (value.trim().length >= 6) {
		callBack()
	} else {
		callBack(new Error('用户密码长度需要大于六位'))
	}
}

const rules = {
	username: [{ required: true, trigger: 'change', validator: validatorusername }],

	name: [{ required: true, trigger: 'change', validator: validatorname }],

	password: [{ required: true, trigger: 'change', validator: validatorpassword }],
}

function RoleCharactor(row: any) {
	Object.assign(UserParams, row)
	reqRoleUser(row.id).then(result => {
		if (result.code == 200) {
			AllRole.value = result.data.allRolesList
			UserRole.value = result.data.assignRoles.map(item=>item.id)
			drawer1.value = true
		}
	})
}

// 全选：勾上就选全部，取消就清空
const isAllChecked = computed({
	get: () => AllRole.value.length > 0 && UserRole.value.length === AllRole.value.length,
	set: (val: boolean) => {
		UserRole.value = val ? AllRole.value.map(item => item.id) : []
	},
})

// 半选：选中了一部分
const isIndeterminate = computed(() => {
	return UserRole.value.length > 0 && UserRole.value.length < AllRole.value.length
})

// 提交分配
async function assignRoles() {
	const result = await reqAssignRole(UserParams.id as number, UserRole.value)
	if (result.code === 200) {
		notify('success', '分配成功')
		drawer1.value = false
		getUserList()
	}
}

//删除
function DeleteUser(id:number){
	reqDeleteUser(id).then(result =>{
		if(result.code == 200){
			notify('success', '删除成功')
			userList.value.length >1?pageNo.value:pageNo.value-1
			getUserList()
		}
	})
}

function selectChange(value:any){
	   batchnum.value = value.map((item:any) => item.id)
	
}

function BatchDelete(){
	reqBatchDelete(batchnum.value).then(result =>{
		if(result.code == 200){
			notify('success', '删除成功')
			userList.value.length >1?pageNo.value:pageNo.value-1
			getUserList()
		}
	})
}

function Search(){
	getUserList()	
	username.value = ''
}

function reset(){
	useSettingStore().refresh = !useSettingStore().refresh
}
</script>

<template>
	<div class="user_page">
		<!-- 搜索区 -->
		<el-card class="search_card">
			<el-form :inline="true" class="search_form">
				<el-form-item label="用户名:">
					<el-input placeholder="请输入用户名" style="width: 220px" clearable v-model="username" />
				</el-form-item>
				<div class="search_btns">
					<el-button type="primary" icon="Search" @click="Search()" :disabled="username?false:true">搜索</el-button>
					<el-button icon="Refresh" @click="reset()">重置</el-button>
				</div>
			</el-form>
		</el-card>

		<!-- 列表区 -->
		<el-card style="margin-top: 10px;">
			<el-button type="primary" icon="Plus" v-has="'btn.User.add'" @click="addUser()">添加</el-button>
			<el-button type="danger" plain icon="Delete" v-has="'btn.User.remove'" :disabled="batchnum.length?false:true" @click="BatchDelete()">批量删除</el-button>

			<el-table border style="margin: 10px 0;" :data="userList" @selection-change="selectChange">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column type="index" label="#" width="60" align="center" />
				<el-table-column label="id" prop="id" width="80" align="center" />
				<el-table-column label="用户名字" prop="name" min-width="120" show-overflow-tooltip />
				<el-table-column label="用户名称" prop="username" min-width="120" show-overflow-tooltip />
				<el-table-column label="用户角色" prop="roleName" min-width="140" show-overflow-tooltip />
				<el-table-column label="创建时间" prop="createTime" width="180" show-overflow-tooltip />
				<el-table-column label="更新时间" prop="updateTime" width="180" show-overflow-tooltip />
				<el-table-column label="操作" width="300" align="center">
					<template #default="{ row }">
						<el-button type="primary" size="small" icon="User" v-has="'btn.User.assgin'" @click="RoleCharactor(row)">分配角色</el-button>
						<el-button type="primary" size="small" icon="Edit" v-has="'btn.User.update'"
							@click="updataUser(row as UserInfoData)">编辑</el-button>
						<el-popconfirm :title="`您确定删除${row.username}`" @confirm="DeleteUser(row.id)">
							<template #reference>
								<el-button type="danger" size="small" icon="Delete" v-has="'btn.User.remove'">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination :page-sizes="[5, 7, 9]" size="default" background
				layout="prev, pager, next,->,jumper,sizes,total" :total="total" :pager-count="5"
				v-model:current-page="pageNo" v-model:page-size="pageSize" @size-change="handchange()" 
				@current-change="getUserList()"
				/>
		</el-card>

		<el-drawer v-model="drawer" :title="UserParams.id ? '更新用户' : '新增用户'" size="40%">
			<el-form ref="form" :model="UserParams" :rules="rules">
				<el-form-item label="用户姓名" prop="username">
					<el-input placeholder="请输入用户名" v-model="UserParams.username" />
				</el-form-item>
				<el-form-item label="用户昵称" prop="name">
					<el-input v-model="UserParams.name" placeholder="请输入用户昵称" />
				</el-form-item>
				<el-form-item label="用户密码" prop="password" v-show="UserParams.id ? false : true">
					<el-input v-model="UserParams.password" placeholder="请输入用户密码" />
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button @click="drawer = false">取 消</el-button>
				<el-button type="primary" @click="addUserInfo()">确 定</el-button>
			</template>
		</el-drawer>

		<!-- 角色分配 -->
		<el-drawer v-model="drawer1" title="角色分配" size="40%">
			<template #default>
				<el-form>
					<el-form-item label="用户姓名">
						<el-input v-model="UserParams.username" :disabled="true"></el-input>
					</el-form-item>

					<el-form-item label="职位列表">
						<div class="role_box">
							<el-checkbox v-model="isAllChecked" :indeterminate="isIndeterminate">全选</el-checkbox>

							<el-checkbox-group v-model="UserRole" class="role_list">
								<el-checkbox v-for="item in AllRole" :key="item.id" :value="item.id">
									{{ item.roleName }}
								</el-checkbox>
							</el-checkbox-group>
						</div>

					</el-form-item>
				</el-form>
			</template>

			<template #footer>
				<el-button @click="drawer1 = false">取 消</el-button>
				<el-button type="primary" @click="assignRoles()">确 定</el-button>
			</template>
		</el-drawer>
	</div>
</template>

<style scoped>
.user_page {
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

/* 职位列表：全选 + 每行 4 个 */
.role_box {
	display: flex;
	flex-direction: column;
	gap: 6px;
	width: 100%;
}

.role_list {
	display: flex;
	flex-wrap: wrap;
}

.role_list :deep(.el-checkbox) {
	flex: 0 0 25%;
	margin-right: 0;
}
</style>
