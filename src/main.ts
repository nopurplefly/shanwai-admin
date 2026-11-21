import { createApp } from 'vue'
import './style/style.css'
import App from './App.vue'
//带入路由
import router from './router'

//导入pinia
import pinia from './store'


//鉴权路由导入
import './permisstion.ts'
import {isHasButton} from './utils/isHasButton.ts'

//获取应用实列对象
const app = createApp(App)

//按需引入element
// Element Plus 图标：只注册项目里实际用到的，避免把 293 个图标全部打进首屏
// 以后新增图标：在这里补一个名字，并在下面的 icons 对象里加一项
import {ArrowDown,ArrowRight,Avatar,Box,Collection,Delete,Edit,Expand,Fold,FullScreen,Goods,Grid,House,InfoFilled,Lock,Monitor,Operation,Picture,Plus,PriceTag,Refresh,Search,Setting,SetUp,TrendCharts,User,View,
} from '@element-plus/icons-vue'

const icons = {
  ArrowDown, ArrowRight, Avatar, Box, Collection, Delete, Edit, Expand, Fold,
  FullScreen, Goods, Grid, House, InfoFilled, Lock, Monitor, Operation, Picture,
  Plus, PriceTag, Refresh, Search, Setting, SetUp, TrendCharts, User, View,
}
for (const [name, component] of Object.entries(icons)) {
  app.component(name, component)
}

app.use(router);
app.use(pinia);
isHasButton(app)
//挂载实例
app.mount('#app')
