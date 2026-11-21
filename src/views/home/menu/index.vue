<!-- 动态生成路由，封装成组件 -->
<script setup lang="ts">
//获取父组件传递的路由
defineProps(['menuList'])
</script>
<script lang="ts">
export default {
    name: "Menu"
}
</script>

<template>
    <template v-for="item in menuList" :key="item.path">
        <!-- 没有子路由 -->
        <template v-if="!item.children">
            <el-menu-item :index="item.path" v-if="!item.meta?.hidden">
                <el-icon v-if="item.meta?.icon">
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta?.title }}</span>
            </el-menu-item>
        </template>

        <!-- 只有一个子路由：把它提升为一级菜单 -->
        <template v-if="item.children && item.children.length == 1">
            <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta?.hidden">
                <el-icon v-if="item.children[0].meta?.icon">
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <span>{{ item.children[0].meta?.title }}</span>
            </el-menu-item>
        </template>

        <!-- 多个子路由：折叠菜单 -->
        <template v-if="item.children && item.children.length > 1">
            <el-sub-menu :index="item.path" v-if="!item.meta?.hidden">
                <template #title>
                    <el-icon v-if="item.meta?.icon">
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta?.title }}</span>
                </template>
                <!-- 递归组件 -->
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>
    </template>
</template>

<style scoped></style>
