<!-- 菜单图标：用内联 SVG，避免引入 @element-plus/icons-vue 依赖 -->
<script setup lang="ts">
defineProps<{
	name?: string
}>()
</script>

<template>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.7"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<!-- 首页 -->
		<template v-if="name === 'home'">
			<path d="M3.5 10.6 12 3.6l8.5 7" />
			<path d="M5.9 9.3V20a1 1 0 0 0 1 1h10.2a1 1 0 0 0 1-1V9.3" />
			<path d="M9.9 21v-5.3h4.2V21" />
		</template>

		<!-- 数据大屏 -->
		<template v-else-if="name === 'screen'">
			<rect x="3" y="4.5" width="18" height="12.5" rx="1.6" />
			<path d="M9 21h6M12 17v4" />
			<path d="M7.8 13.4v-2.2M11 13.4V9.2M14.2 13.4v-3.4M17.4 13.4v-1.6" />
		</template>

		<!-- 权限管理 -->
		<template v-else-if="name === 'lock'">
			<rect x="4.5" y="10.5" width="15" height="10" rx="2" />
			<path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
			<path d="M12 14.4v2.2" />
		</template>

		<!-- 商品管理 -->
		<template v-else-if="name === 'goods'">
			<path d="M4.2 7.5h15.6L18.4 21H5.6L4.2 7.5Z" />
			<path d="M8.6 7.5V5.8a3.4 3.4 0 0 1 6.8 0v1.7" />
		</template>

		<!-- 用户管理 -->
		<template v-else-if="name === 'user'">
			<circle cx="12" cy="8.2" r="3.4" />
			<path d="M5 20c.6-3.5 3.4-5.4 7-5.4s6.4 1.9 7 5.4" />
		</template>

		<!-- 角色管理 -->
		<template v-else-if="name === 'role'">
			<circle cx="9.2" cy="8.4" r="3.2" />
			<path d="M3.6 19.6c.5-3.2 2.9-5 5.6-5s5.1 1.8 5.6 5" />
			<path d="M15.8 5.9a3.2 3.2 0 0 1 0 5.6" />
			<path d="M17.3 14.6c1.9.5 3.2 2.2 3.5 4.6" />
		</template>

		<!-- 菜单管理 -->
		<template v-else-if="name === 'menu'">
			<path d="M9 6.5h11M9 12h11M9 17.5h11" />
			<circle cx="4.6" cy="6.5" r="1.1" />
			<circle cx="4.6" cy="12" r="1.1" />
			<circle cx="4.6" cy="17.5" r="1.1" />
		</template>

		<!-- 品牌管理 -->
		<template v-else-if="name === 'brand'">
			<path d="M4.6 5.4h7.1l7.7 7.7-6.3 6.3-7.7-7.7V5.4Z" />
			<circle cx="8.9" cy="9.7" r="1.4" />
		</template>

		<!-- 平台属性 -->
		<template v-else-if="name === 'attr'">
			<path d="M4.5 8.5h15M4.5 15.5h15" />
			<circle cx="9.5" cy="8.5" r="2.1" />
			<circle cx="14.5" cy="15.5" r="2.1" />
		</template>

		<!-- SPU 管理 -->
		<template v-else-if="name === 'spu'">
			<path d="M12 3.6 20 8v8l-8 4.4L4 16V8l8-4.4Z" />
			<path d="M4 8l8 4.4L20 8" />
			<path d="M12 12.4V20.4" />
		</template>

		<!-- SKU 管理 -->
		<template v-else-if="name === 'sku'">
			<path d="M12 3.8 20 8l-8 4.2L4 8l8-4.2Z" />
			<path d="m4 12.2 8 4.2 8-4.2" />
			<path d="m4 16.2 8 4.2 8-4.2" />
		</template>

		<!-- 兜底 -->
		<template v-else>
			<circle cx="12" cy="12" r="2.2" />
		</template>
	</svg>
</template>
