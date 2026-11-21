// 通用节流：wait 毫秒内只执行第一次（leading 立即执行）
// 说明：JS 标准库没有内置 throttle，这里是标准手写实现
export function throttle<T extends (...args: any[]) => void>(fn: T, wait = 500) {
	let last = 0
	return function (...args: Parameters<T>) {
		const now = Date.now()
		if (now - last < wait) return
		last = now
		fn(...args)
	}
}
