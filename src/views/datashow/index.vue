<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Sex from '../../components/datashow/sex.vue'
import Age from '../../components/datashow/age.vue'
import Tourist from '../../components/datashow/tourist.vue'
import TravelMap from '../../components/datashow/map.vue'
import Line from '../../components/datashow/line.vue'
import Rank from '../../components/datashow/rank.vue'
import Counter from '../../components/datashow/counter.vue'
import Year from '../../components/datashow/year.vue'

const router = useRouter()
const viewport = ref<HTMLDivElement>()
const scale = ref(1)
let observer: ResizeObserver | undefined

function fitScreen() {
  if (!viewport.value) return
  scale.value = Math.min(viewport.value.clientWidth / 1920, viewport.value.clientHeight / 1080)
}

function goHome() {
  void router.push('/home')
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') goHome()
}

onMounted(() => {
  fitScreen()
  if (viewport.value) {
    observer = new ResizeObserver(fitScreen)
    observer.observe(viewport.value)
  }
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div ref="viewport" class="data-screen">
    <div class="screen" :style="{ transform: 'translate(-50%, -50%) scale(' + scale + ')' }">
      <header class="screen-header">
        <div class="header-left">
          <button type="button" class="home-button" @click="goHome">首页</button>
        </div>
        <h1>智慧旅游可视化大数据平台</h1>
        <div class="header-right"></div>
      </header>

      <div class="screen-grid">
        <div class="screen-column side-column">
          <Tourist class="screen-panel" />
          <Sex class="screen-panel" />
          <Age class="screen-panel" />
        </div>
        <div class="screen-column center-column">
          <TravelMap class="travel-map" />
          <Line class="screen-panel" />
        </div>
        <div class="screen-column side-column">
          <Rank class="screen-panel" />
          <Year class="screen-panel" />
          <Counter class="screen-panel" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-screen {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: clip;
  background: #0b1220 url('../../assets/datashow/bg.png') center / cover no-repeat;
  font-family: 'Microsoft YaHei', system-ui, sans-serif;
}

.screen {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  grid-template-rows: 74px minmax(0, 1fr);
  width: 1920px;
  height: 1080px;
  padding: 0 16px 16px;
  box-sizing: border-box;
}

.screen-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  color: #29fcff;
}

.screen-header h1 {
  display: grid;
  place-items: center;
  background: url('../../assets/datashow/dataScreen-header-center-bg.png') center / 100% 100% no-repeat;
  font-size: 30px;
}

.header-left,
.header-right {
  height: 40px;
  background: center / 100% 100% no-repeat;
}

.header-left {
  display: flex;
  justify-content: flex-end;
  background-image: url('../../assets/datashow/dataScreen-header-left-bg.png');
}

.header-right {
  background-image: url('../../assets/datashow/dataScreen-header-right-bg.png');
}

.home-button {
  width: 150px;
  border: 0;
  background: url('../../assets/datashow/dataScreen-header-btn-bg-l.png') center / 100% 100% no-repeat;
  color: inherit;
  font-size: 23px;
  cursor: pointer;
}

.home-button:hover {
  color: white;
}

.screen-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr);
  gap: 12px;
  min-height: 0;
  padding-top: 8px;
}

.screen-column {
  display: grid;
  gap: 12px;
  min-width: 0;
  min-height: 0;
}

.side-column {
  grid-template-rows: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr);
}

.center-column {
  grid-template-rows: minmax(0, 3fr) minmax(0, 1fr);
}

.travel-map {
  min-width: 0;
  min-height: 0;
}
</style>

<style>
.data-screen .screen-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  padding: 15px 18px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #f5f9ff;
}

.data-screen .panel-title {
  display: grid;
  justify-items: start;
  gap: 5px;
  font-size: 20px;
}

.data-screen .panel-chart {
  flex: 1 1 0;
  min-height: 0;
}
</style>
