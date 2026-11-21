import { ElMessage, type MessageType } from 'element-plus'
import { throttle } from './throttle'

// 统一的全局提示：任意两条提示至少间隔 500ms，避免并发报错刷屏
export const notify = throttle((type: MessageType, message: string) => {
	ElMessage({ type, message, duration: type === 'error' ? 3000 : 2000 })
}, 500)
