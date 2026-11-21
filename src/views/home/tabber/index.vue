<script setup lang="ts">
import { ArrowRight,} from '@element-plus/icons-vue'
import useSettingStore from '../../../store/modules/setting'
import { useRoute,useRouter } from 'vue-router'
import  useUserStore from '../../../store/modules/user'
let useInfo = useUserStore()
let $router = useRoute()
let $route = useRouter()
let fold = useSettingStore();
let refresh = useSettingStore();
function changeIcon() {
    fold.fold = !fold.fold
}
function ReFresh(){
    refresh.refresh = !refresh.refresh
}
function Fullscreen(){
    let isFull = document.fullscreenElement;
    if(!isFull){
        document.documentElement.requestFullscreen();
    }else{
        document.exitFullscreen();
    }
}
async function logout(){
    await useUserStore().userLogout()
    $route.push({path:'/login',query:{redirect:$router.path}})
}
</script>

<template>
    <div class="tabber">
        <div class="tabber_left">
            <button
                type="button"
                class="sidebar-toggle"
                :aria-label="fold.fold ? '展开菜单' : '收起菜单'"
                :aria-expanded="!fold.fold"
                @click="changeIcon"
            >
                <el-icon><component :is="fold.fold ? 'Expand' : 'Fold'" /></el-icon>
            </button>
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="item in $router.matched.filter(route => route.meta.title)" :key="item.path" :to="item.path">
                    <el-icon v-if="item.meta.icon" class="crumb_icon" :size="16">
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tabber_right">
            <el-button type="primary" icon="Refresh" circle aria-label="刷新页面" @click="ReFresh()" />
            <el-button type="primary" icon="FullScreen" circle aria-label="切换全屏" @click="Fullscreen()" />
            <img :src="useInfo.avatar" alt="" style="width: 32px;height: 32px;margin: 0 12px; border-radius: 50px;">
            <el-dropdown trigger="click">
                <button type="button" class="el-dropdown-link" aria-label="账户菜单">
                    {{ useInfo.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

        </div>
    </div>
</template>

<style scoped>
.tabber {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .tabber_left {
        display: flex;
        align-items: center;
    }

    .tabber_right {
        display: flex;
        align-items: center;

    }
}

.sidebar-toggle {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    margin-right: 8px;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: #254975;
    font-size: 18px;
    cursor: pointer;
}

.sidebar-toggle:hover {
    background: #dceaff;
}

.el-dropdown-link {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: #254975;
    font: inherit;
    cursor: pointer;
}

.el-dropdown-link:hover {
    background: #dceaff;
}

/* 面包屑内容改成 flex：图标和文字按盒子中心对齐，
   避免 vertical-align: middle 对齐 x-height 造成图标偏低 2px */
:deep(.el-breadcrumb__inner) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

/* 面包屑图标：16px */
.crumb_icon {
    flex: none;
}
</style>
