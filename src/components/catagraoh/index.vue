<script setup lang="ts">
import { ElForm, ElOption, ElSelect } from 'element-plus';
import { reqCategory1, reqCategory2, reqCategory3 } from '../../api/product/attr/index'
import { onMounted, ref, watch } from 'vue';
import type { Category1Data, Category2Data, Category3Data } from '../../api/product/attr/type'

// 子传父：三个分类 id（三个都是一定会有的），父组件用 @ids 接收
const emit = defineEmits<{
    (e: 'ids', payload: { c1id: number; c2id: number; c3id: number }): void
}>()

onMounted(() => {
    getCategory1()
})
//父传子
defineProps(['scene'])

// 一级
let arrC1 = ref<Category1Data[]>([])
let c1id = ref<number>()
// 二级
let arrC2 = ref<Category2Data[]>([])
let c2id = ref<number>()
// 三级
let arrC3 = ref<Category3Data[]>([])
let c3id = ref<number>()

// 三个 id 任意变化就回传给父组件
watch([c1id, c2id, c3id], () => {
    emit('ids', {
        c1id: c1id.value as number,
        c2id: c2id.value as number,
        c3id: c3id.value as number,
    })
}, { immediate: true })

async function getCategory1() {
    let result = await reqCategory1()
    if (result.code == 200) {
        arrC1.value = result.data
    }
}

// 一级变化：重新请求二级，并把二级、三级的选择清空
async function getCategory2() {
    arrC2.value = []
    arrC3.value = []
    c2id.value = undefined
    c3id.value = undefined
    if (!c1id.value) return
    let result = await reqCategory2(c1id.value)
    if (result.code == 200) {
        arrC2.value = result.data
    }
}

// 二级变化：重新请求三级，并把三级的选择清空
async function getCategory3() {
    arrC3.value = []
    c3id.value = undefined
    if (!c2id.value) return
    let result = await reqCategory3(c2id.value)
    if (result.code == 200) {
        arrC3.value = result.data
    }
}
</script>

<template>
    <el-form :inline="true" class="attr-form">
        <el-form-item label="一级标签">
            <el-select v-model="c1id" placeholder="请选择一级标签" @change="getCategory2" :disabled="scene == 1">
                <el-option v-for="c1 in arrC1" :key="c1.id" :value="c1.id" :label="c1.name" />
            </el-select>
        </el-form-item>
        <el-form-item label="二级标签">
            <el-select v-model="c2id" placeholder="请选择二级标签" :disabled="!c1id ||scene == 1" @change="getCategory3">
                <el-option v-for="c2 in arrC2" :key="c2.id" :value="c2.id" :label="c2.name" />
            </el-select>
        </el-form-item>
        <el-form-item label="三级标签">
            <el-select v-model="c3id" placeholder="请选择三级标签" :disabled="!c2id ||scene == 1">
                <el-option v-for="c3 in arrC3" :key="c3.id" :value="c3.id" :label="c3.name" />
            </el-select>
        </el-form-item>
    </el-form>

</template>

<style scoped></style>
