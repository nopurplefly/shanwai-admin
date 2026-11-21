<template>
	<!-- 二级路由的出口：/power 与 /product 的子页面渲染在这里 -->
	<router-view v-slot="{ Component }">
		<transition name="page-fade" mode="out-in">
			<component :is="Component" />
		</transition>
	</router-view>
</template>

<style scoped>
/* 路由切换过渡：配合 <transition name="page-fade" mode="out-in"> 使用 */
.page-fade-enter-active,
.page-fade-leave-active {
	transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.page-fade-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
</style>
