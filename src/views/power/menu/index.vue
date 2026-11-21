<script lang="ts" setup>
import { notify } from '../../../utils/notify'
import { ref, onMounted, reactive } from 'vue'
import { reqMenuList, reqAddOrUpdataMenu,reqDeleteMenu } from '../../../api/acl/menu';
import type { MenuList, MenuInfo } from '../../../api/acl/menu/type'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElTable } from 'element-plus';

const MenuList = ref<MenuList[]>([])
const dialogVisible = ref<boolean>(false)
const MenuData = reactive<MenuInfo>({
	name: '',
	pid: 0,
	code: '',
	level: 0
})

onMounted(() => {
	GetMenuList()
})

function GetMenuList() {
	reqMenuList().then(result => {
		if (result.code == 200) {
			MenuList.value = result.data
		}
	})
}

function addMenu(row: MenuList) {
	Object.assign(MenuData, {
		id:0,
		name: '',
		pid: 0,
		code: '',
		level: 0
	})

	dialogVisible.value = !dialogVisible.value
	MenuData.level = row.level + 1
	MenuData.pid = row.id
}

function updataMenu(row:MenuList) {
	Object.assign(MenuData,row)
	dialogVisible.value = !dialogVisible.value
}

function ConfirmMenu() {
	reqAddOrUpdataMenu(MenuData).then(result => {
		if (result.code == 200) {
			notify('success', '新增成功')
			dialogVisible.value = !dialogVisible.value
			GetMenuList()
		}
	})
}

function deleteMenu(id:number){
	reqDeleteMenu(id).then(result=>{
		if(result.code == 200){
			notify('success', '删除成功')
			GetMenuList()
		}
	})
}
</script>

<template>
	<div class="page">
		<el-table :data="MenuList" style="width: 100%; margin-bottom: 20px" row-key="id" border>
			<el-table-column prop="name" label="名称" />
			<el-table-column prop="code" label="权限值" />
			<el-table-column prop="updateTime" label="修改时间" />
			<el-table-column label="操作">
				<template #="{ row }">
					<el-button type="success" icon="Plus" size="small" v-has="'btn.Permission.add'" :disabled="row.level == 4 ? true : false"
						@click="addMenu(row as MenuList)">{{ row.level == 3 ? '添加功能' : '添加菜单' }}</el-button>
					<el-button type="warning" icon="User" size="small" v-has="'btn.Permission.update'" :disabled="row.level == 1 ? true : false"
						@click="updataMenu(row as MenuList)">编辑</el-button>
					<el-button type="danger" icon="Delete" size="small" v-has="'btn.Permission.remove'"
						:disabled="row.level == 1 ? true : false" @click="deleteMenu(row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog v-model="dialogVisible" :title="MenuData.id?'更新菜单':'添加菜单'" width="40%">
			<el-form>
				<el-form-item label="名称">
					<el-input placeholder="请输入名称" v-model="MenuData.name"></el-input>
				</el-form-item>
				<el-form-item label="权限值">
					<el-input placeholder="请输入权限" v-model="MenuData.code"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="success" @click="ConfirmMenu()">确定</el-button>
				<el-button type="danger" @click="dialogVisible = !dialogVisible">取消</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped>
.page {
	padding: 8px;
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
</style>
