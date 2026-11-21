<script setup lang="ts">
// 修改 / 删除两个按钮，事件交给父组件处理
const emit = defineEmits<{
    (e: 'edit'): void
    (e: 'del'): void
}>()

// 两个按钮各自的权限标识，默认是属性管理的，别的页面用可以自己传
withDefaults(defineProps<{
    editPerm?: string
    delPerm?: string
}>(), {
    editPerm: 'btn.Attr.update',
    delPerm: 'btn.Attr.remove',
})
</script>

<template>
    <el-button type="warning" round icon="Edit" size="small" v-has="editPerm" @click="emit('edit')">修改</el-button>
    <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" icon="InfoFilled" icon-color="#626AEF"
        title="你确定要删除此条信息吗？" @confirm="emit('del')">
        <template #reference>
            <el-button type="danger" round icon="Delete" size="small" v-has="delPerm">删除</el-button>
        </template>
    </el-popconfirm>
</template>

<style scoped></style>
