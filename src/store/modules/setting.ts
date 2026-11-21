//配置layout的小仓库
import { defineStore } from "pinia";
let useSettingStore = defineStore('setting',{
    state:()=>{
        return{
            fold:false,
            refresh:true,
        }
    }
})

export default useSettingStore