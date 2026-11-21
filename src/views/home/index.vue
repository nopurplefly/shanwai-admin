<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '../logo/index.vue'
import Menu from './menu/index.vue'
import Tabber from './tabber/index.vue'
import useUserStore from '../../store/modules/user'
import useSettingStore from '../../store/modules/setting'

const user = useUserStore()
const settings = useSettingStore()
const route = useRoute()
const content = ref<HTMLElement>()
const showPage = ref(true)
const isFullScreen = computed(() => route.meta.fullScreen === true)

watch(() => route.path, () => content.value?.scrollTo(0, 0), { flush: 'post' })

watch(() => settings.refresh, async () => {
  showPage.value = false
  await nextTick()
  showPage.value = true
})
</script>

<template>
  <div v-if="isFullScreen" class="full-screen">
    <router-view />
  </div>

  <div v-else class="layout" :class="{ folded: settings.fold }">
    <aside class="sidebar" aria-label="主菜单">
      <Logo :compact="settings.fold" />
      <div class="menu-scroll">
        <el-menu
          class="menu-list"
          popper-class="admin-menu-popup"
          router
          :default-active="route.path"
          :collapse="settings.fold"
          :collapse-transition="false"
          unique-opened
        >
          <Menu :menu-list="user.menuRouters" />
        </el-menu>
      </div>
    </aside>

    <header class="navigation">
      <Tabber />
    </header>

    <main ref="content" class="content" tabindex="0" aria-label="页面内容">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" v-if="showPage" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.full-screen {
  background: #0b1220;
}

.layout {
  --menu-width: clamp(184px, 17vw, 242px);
  display: grid;
  grid-template-columns: var(--menu-width) minmax(0, 1fr);
  grid-template-rows: 60px minmax(0, 1fr);
  gap: 12px 16px;
  height: 100dvh;
  padding: 14px;
  box-sizing: border-box;
  background: #d3e5f9 url('../../assets/login-mountains-enhanced.webp') center / cover no-repeat;
  font-family: 'Inter', 'Microsoft YaHei', system-ui, sans-serif;
}

.layout.folded {
  --menu-width: 68px;
}

.sidebar {
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 85%);
  border-radius: 22px;
  background: rgb(239 248 255 / 83%);
  box-shadow: 0 12px 36px rgb(28 67 113 / 16%);
}

@supports (backdrop-filter: blur(14px)) {
  .sidebar {
    background: rgb(235 246 255 / 66%);
    backdrop-filter: blur(14px) saturate(135%);
  }
}

.menu-scroll {
  min-height: 0;
  overflow: auto;
  padding: 0 8px 12px;
}

.menu-list {
  width: 100%;
  border-right: 0;
  --el-menu-bg-color: transparent;
  --el-menu-text-color: #314f73;
  --el-menu-hover-bg-color: rgb(255 255 255 / 65%);
  --el-menu-active-color: #174b9e;
  --el-menu-item-height: 46px;
  --el-menu-sub-item-height: 42px;
  --el-menu-base-level-padding: 12px;
}

.menu-list :deep(.el-menu-item),
.menu-list :deep(.el-sub-menu__title) {
  border-radius: 11px;
}

.menu-list :deep(.el-menu-item.is-active) {
  background: #d6e7ff;
  font-weight: 650;
}

.menu-list :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: var(--el-menu-active-color);
}

.navigation {
  min-width: 0;
  padding: 0 12px;
  border: 1px solid rgb(255 255 255 / 82%);
  border-radius: 16px;
  background: rgb(247 251 255 / 91%);
}

.content {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 2px 4px 12px;
}

.content:focus-visible {
  outline: 2px solid #2452ab;
  outline-offset: -2px;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.18s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

@media (max-width: 720px) {
  .layout {
    gap: 8px;
    padding: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition: none;
  }
}
</style>

<style>
.admin-menu-popup.el-popper {
  --el-menu-bg-color: #f2f8ff;
  --el-menu-text-color: #314f73;
  --el-menu-active-color: #174b9e;
  border-radius: 12px;
}
</style>
