<script setup lang="ts">
import { isAxiosError } from 'axios'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import Logo from '../logo/index.vue'
import useUserStore from '../../store/modules/user'
import { notify } from '../../utils/notify'

const router = useRouter()
const route = useRoute()
const user = useUserStore()
const form = ref<FormInstance>()
const loading = ref(false)
const accountKey = 'remembered-admin-account'
const savedAccount = localStorage.getItem(accountKey)
const remember = ref(Boolean(savedAccount))
const credentials = reactive({ username: savedAccount ?? '', password: '' })

const motionKey = 'login-bird-motion'
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
const reduceMotion = ref(motionPreference.matches)
const motionOverride = ref(sessionStorage.getItem(motionKey))
const birdsPlaying = computed(() =>
  motionOverride.value === null ? !reduceMotion.value : motionOverride.value === 'play',
)

function updateMotionPreference(event: MediaQueryListEvent) {
  reduceMotion.value = event.matches
}

function toggleBirds() {
  motionOverride.value = birdsPlaying.value ? 'pause' : 'play'
  sessionStorage.setItem(motionKey, motionOverride.value)
}

onMounted(() => motionPreference.addEventListener('change', updateMotionPreference))
onBeforeUnmount(() => motionPreference.removeEventListener('change', updateMotionPreference))

const rules: FormRules<typeof credentials> = {
  username: [{ required: true, whitespace: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function submitLogin() {
  if (loading.value || !form.value) return
  loading.value = true
  try {
    const valid = await form.value.validate().catch(() => false)
    if (!valid) return

    await user.userLogin(credentials)
    if (remember.value) localStorage.setItem(accountKey, credentials.username)
    else localStorage.removeItem(accountKey)

    const redirect = route.query.redirect
    await router.push(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/home')
    notify('success', '登录成功')
  } catch (error) {
    if (!isAxiosError(error)) {
      notify('error', error instanceof Error ? error.message : '登录失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login" :class="{ 'birds-playing': birdsPlaying }">
    <div class="bird-flight" aria-hidden="true">
      <svg viewBox="0 0 100 50" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" focusable="false">
        <path class="bird-wings" d="M7 28q6-6 12 1 6-8 12-4" />
        <path class="bird-wings" d="M42 13q5-4 9 1 4-6 9-3" />
        <path class="bird-wings" d="M72 36q5-4 9 1 4-6 9-3" />
      </svg>
    </div>
    <div class="bird-flight bird-flight--distant" aria-hidden="true">
      <svg viewBox="0 0 100 50" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" focusable="false">
        <path class="bird-wings" d="M12 16q5-5 10 1 5-6 10-4" />
        <path class="bird-wings" d="M57 29q6-5 11 1 5-7 11-4" />
      </svg>
    </div>

    <main class="login-panel">
      <Logo class="login-brand" />
      <h1>欢迎登录</h1>

      <el-form
        ref="form"
        :model="credentials"
        :rules="rules"
        hide-required-asterisk
        label-position="top"
        size="large"
        @submit.prevent="submitLogin"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model.trim="credentials.username" autocomplete="username" placeholder="请输入账号" clearable />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="credentials.password"
            type="password"
            autocomplete="current-password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <el-checkbox v-model="remember">记住账号</el-checkbox>
        <el-button class="login-button" type="primary" native-type="submit" :loading="loading">登录</el-button>
      </el-form>
    </main>
    <button class="bird-control" type="button" @click="toggleBirds">
      {{ birdsPlaying ? '暂停飞鸟动画' : '播放飞鸟动画' }}
    </button>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  isolation: isolate;
  display: grid;
  align-items: center;
  justify-items: end;
  min-height: 100dvh;
  box-sizing: border-box;
  overflow: clip;
  padding: 28px clamp(26px, 8vw, 144px) 60px;
  background: #d3e5f9 url('../../assets/login-mountains-enhanced.webp') center / cover no-repeat;
  font-family: 'Inter', 'Microsoft YaHei', system-ui, sans-serif;
}

.bird-flight {
  --flight-duration: 9s;
  --flight-delay: -1s;
  --flight-distance: 39vw;
  --flight-rise: -5vh;
  --flight-opacity: 0.88;
  position: absolute;
  z-index: 0;
  top: clamp(60px, 25vh, 270px);
  left: 12%;
  width: clamp(98px, 11vw, 166px);
  pointer-events: none;
  color: #183e62;
  animation: birds-glide var(--flight-duration) linear var(--flight-delay) infinite paused;
}

.bird-flight--distant {
  --flight-duration: 11s;
  --flight-delay: -4s;
  --flight-distance: 29vw;
  --flight-rise: -4vh;
  --flight-opacity: 0.68;
  top: clamp(32px, 15vh, 162px);
  left: 20%;
  width: clamp(69px, 7vw, 110px);
}

.bird-flight svg {
  display: block;
  width: 100%;
  overflow: visible;
}

.bird-wings {
  transform-box: fill-box;
  transform-origin: center;
  animation: birds-flap 0.95s ease-in-out infinite paused;
}

.bird-wings:nth-child(2) {
  animation-delay: -0.4s;
}

.bird-wings:nth-child(3) {
  animation-delay: -0.7s;
}

.birds-playing .bird-flight,
.birds-playing .bird-wings {
  animation-play-state: running;
}

@keyframes birds-glide {
  0% {
    opacity: 0;
    transform: translate3d(-5vw, 1.5vh, 0);
  }

  8%, 88% {
    opacity: var(--flight-opacity);
  }

  100% {
    opacity: 0;
    transform: translate3d(var(--flight-distance), var(--flight-rise), 0);
  }
}

@keyframes birds-flap {
  0%, 100% {
    transform: scaleY(1);
  }

  48% {
    transform: scaleY(0.24);
  }
}

.bird-control {
  position: absolute;
  z-index: 1;
  inset-inline-end: clamp(16px, 3vw, 32px);
  bottom: 16px;
  padding: 8px 13px;
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: 8px;
  background: rgb(244 250 255 / 92%);
  color: #173b61;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.bird-control:hover {
  background: #fff;
}

.login-panel {
  z-index: 1;
  box-sizing: border-box;
  width: min(100%, 416px);
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid #fff;
  border-radius: 24px;
  background: rgb(252 254 255 / 94%);
  box-shadow: 0 22px 70px rgb(37 74 132 / 16%);
  color: #173357;
  --el-color-primary: #285fbd;
}

.login-brand {
  padding: 0 0 30px;
}

h1 {
  padding-bottom: 25px;
  font-size: 28px;
  font-weight: 750;
}

.login-button {
  display: flex;
  width: 100%;
  height: 46px;
  margin-top: 16px;
  border-radius: 10px;
}

@media (max-width: 760px) {
  .login {
    justify-items: center;
    padding: 20px 20px 60px;
  }

  .bird-flight {
    top: clamp(8px, calc(24vh - 112px), 90px);
  }

  .bird-flight--distant {
    top: clamp(3px, calc(13vh - 66px), 54px);
    left: 36%;
  }
}
</style>
