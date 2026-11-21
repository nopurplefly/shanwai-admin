<script setup lang="ts">
defineProps<{ compact?: boolean }>()

const mark = `${import.meta.env.BASE_URL}shanwai-mark.svg`
</script>

<template>
  <div class="brand" :class="{ compact }">
    <img :src="mark" :alt="compact ? '山外集' : ''" width="44" height="44">
    <div v-if="!compact" class="brand-copy">
      <strong>山外集</strong>
      <span>后台管理系统</span>
    </div>
  </div>
</template>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 18px 16px;
  color: #173357;
}

.brand.compact {
  justify-content: center;
  padding-inline: 0;
}

.brand img {
  flex: none;
}

.brand-copy {
  display: grid;
  gap: 4px;
  white-space: nowrap;
}

.brand-copy strong {
  font-size: 18px;
  font-weight: 750;
}

.brand-copy span {
  color: #526b89;
  font-size: 12px;
}
</style>
