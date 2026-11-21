<script setup lang="ts">
const men = 58
const women = 100 - men
</script>

<template>
  <section class="audience">
    <div class="panel-title">
      <p>男女比例</p>
      <img src="../../assets/datashow/dataScreen-title.png" alt="">
    </div>

    <div class="audience-icons">
      <div class="man">
        <img src="../../assets/datashow/man.png" alt="">
      </div>
      <div class="woman">
        <img src="../../assets/datashow/woman.png" alt="">
      </div>
    </div>

    <div class="rate">
      <span>男生 {{ men }}%</span>
      <span>女生 {{ women }}%</span>
    </div>
    <div class="ratio" aria-hidden="true">
      <span :style="{ width: men + '%' }"></span>
    </div>
  </section>
</template>

<style scoped>
.audience {
  background-image: url('../../assets/datashow/dataScreen-main-lc.png');
}

.audience-icons {
  display: flex;
  flex: 1 1 0;
  justify-content: center;
  align-items: center;
  gap: 32px;
  min-height: 0;
}

.audience-icons > div {
  display: grid;
  place-items: center;
  width: 100px;
  height: min(100%, 104px);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

.man {
  background-image: url('../../assets/datashow/man-bg.png');
}

.woman {
  background-image: url('../../assets/datashow/woman-bg.png');
}

.audience-icons img {
  max-height: 68px;
  max-width: 70%;
  object-fit: contain;
}

.rate {
  display: flex;
  justify-content: space-between;
  color: #e1efff;
  font-size: 19px;
}

.ratio {
  height: 14px;
  border-radius: 8px;
  background: #f197c2;
}

.ratio span {
  display: block;
  height: 100%;
  border-radius: 8px;
  background: #438fff;
}
</style>
