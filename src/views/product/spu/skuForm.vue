<!-- 添加修改sku -->
<script lang="ts" setup>
import { notify } from '../../../utils/notify'
import { reqCategoryValue } from '../../../api/product/attr/index.ts'
import { ref, reactive } from 'vue'
import { reqSPUImage, reqSPUSaleList, reqAddSKU } from '../../../api/product/spu/index.ts'
import type { SKUData } from '../../../api/product/spu/type.ts'
let $emit = defineEmits(['changeScene'])

function cancel() {
  $emit('changeScene', 0)
}
//添加sku表头收集
let SKUParams = reactive<SKUData>({
  spuID: 0,
  category3Id: 0,
  tmId: 0,
  skuName: '',
  price: 0,
  weight: 0,
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
  isSale:0,
})
//平台属性
let attrData = ref<any>([])
//销售属性
let saleData = ref<any>([])
//照片数据
let imageData = ref<any>([])
let table = ref<any>()

//父传子
async function initSKUData(c1id: number | string, c2id: number | string, row: any) {

  SKUParams.spuID = row.id
  SKUParams.category3Id = row.category3Id
  SKUParams.tmId = row.tmId
  let result1 = await reqCategoryValue(c1id, c2id, row.category3Id) //平台属性
  let result2 = await reqSPUImage(row.id)                         //spu图片
  let result3 = await reqSPUSaleList(row.id)                      //销售属性

  attrData.value = result1.data
  imageData.value = result2.data
  saleData.value = result3.data
}

defineExpose({
  initSKUData
})

//收集图片
function handleImg(row: any) {
  imageData.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  table.value.toggleRowSelection(row, true)
  SKUParams.skuDefaultImg = row.imgUrl
}

async function save() {
  //销售属性与平台属性的:切割
  SKUParams.skuAttrValueList = attrData.value.filter((item: any) => item.IdandValue).map((item: any) => {
    const [attrId, ValueId] = item.IdandValue.split(':')
    return {
      attrId,
      valueId: ValueId
    }
  })
  SKUParams.skuSaleAttrValueList = saleData.value.filter((item: any) => item.IdandValue).map((item: any) => {
    const [saleAttrId, saleAttrValueId] = item.IdandValue.split(':')
    return {
      saleAttrId,
      saleAttrValueId
    }
  })
  let result = await reqAddSKU(SKUParams)
  if(result.code === 200){
    notify('success', '添加成功')
    $emit('changeScene', 0)
  }
}
</script>
<template>
  <el-form>
    <el-form-item label="sku名称">
      <el-input placeholder="SKU名称" v-model="SKUParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="sku价格">
      <el-input placeholder="价格(元)" type="number" v-model="SKUParams.price"></el-input>
    </el-form-item>
    <el-form-item label="sku重量">
      <el-input placeholder="重量(g)" v-model="SKUParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input placeholder="SKU描述" type="textarea" v-model="SKUParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline=true>
        <el-form-item :label="item.attrName" v-for="item in attrData" :key="item.id">
          <el-select placeholder="请选择" style="width: 120px;" v-model="item.IdandValue">
            <el-option :value="`${item.id}:${option.id}`" v-for="option in item.attrValueList" :key="option.id"
              :label="option.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline=true>
        <el-form-item :label="item.saleAttrName" v-for="item in saleData" :key="item.id">
          <el-select placeholder="请选择" style="width: 120px;" v-model="item.IdandValue">
            <el-option :value="`${item.id}:${option.id}`" v-for="option in item.spuSaleAttrValueList" :key="option.id"
              :label="option.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imageData" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template #default="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="imgName"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="warning" size="small" @click="handleImg(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save()">保存</el-button>
      <el-button type="danger" @click="cancel()">取消</el-button>
    </el-form-item>



  </el-form>
</template>
<style lang="sass" scoped>

</style>
