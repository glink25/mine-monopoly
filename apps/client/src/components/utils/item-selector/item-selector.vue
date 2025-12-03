<script setup lang="ts">
// script 部分保持不变
import { toRaw, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface Prop {
	column: number;
	itemList: Array<any>;
	keyName: string;
	multiple: boolean;
	selectedKey: string | string[]; // 接受 v-model 的值
}

const props = defineProps<Prop>();

const emits = defineEmits(["select", "update:selectedKey"]);

const isItemSelected = (itemId: string): boolean => {
	if (props.multiple) {
		if (Array.isArray(props.selectedKey)) {
			return props.selectedKey.includes(itemId);
		}
		return false;
	} else {
		return props.selectedKey === itemId;
	}
};

function handleItemClick(item: any) {
	const itemId: string = item[props.keyName];
	let newSelectedKey: string | string[];

	if (props.multiple) {
		let currentList = (Array.isArray(props.selectedKey) ? toRaw(props.selectedKey) : []) as string[];
		const index = currentList.findIndex((key) => key === itemId);

		if (index !== -1) {
			currentList.splice(index, 1);
		} else {
			currentList.push(itemId);
		}
		newSelectedKey = [...currentList];
	} else {
		newSelectedKey = props.selectedKey === itemId ? "" : itemId;
	}

	emits("select", newSelectedKey);
	emits("update:selectedKey", newSelectedKey);
}
</script>

<template>
	<div class="item-selector" :style="{ 'grid-template-columns': `repeat(${column}, 1fr)` }">
		<div
			class="items"
			v-for="item in itemList"
			:key="item[keyName]"
			@click="handleItemClick(item)"
			:class="{ 'is-selected': isItemSelected(item[keyName]) }"
		>
			<div v-if="isItemSelected(item[keyName])" class="selected">
				<FontAwesomeIcon icon="check" />
			</div>

			<div v-if="item.display" class="item-display-html" v-html="item.display"></div>

			<slot v-else name="item" v-bind="item"></slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-selector {
	display: grid;
	gap: 20px;
	padding: 10px;

	& > .items {
		position: relative;
		background-color: #ffffff;
		border-radius: 0.8rem;
		border: 2px solid #e0e0e0;
		cursor: pointer;
		transition: all 0.3s ease-out;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		overflow: hidden;

		// 鼠标悬停效果
		&:hover {
			box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
			transform: translateY(-2px);
		}

		// 选中状态
		&.is-selected {
			border-color: var(--color-primary); // 主题色边框
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--color-primary); // 增加主题色外圈
		}

		// 选中图标角标
		& > .selected {
			position: absolute;
			top: 0.1rem;
			right: 0.1rem;
			width: 2rem;
			height: 2rem;
			display: flex;
			align-items: center;
			justify-content: center;

			font-size: 1rem;
			color: #ffffff;
			background-color: var(--color-primary); // 主题色背景
			border-radius: 50%; // 保持圆角一致性
			z-index: 10;
		}

		.item-display-html {
			width: 100%;
			height: 100%;
			display: flex;
			padding: .5rem;
			align-items: center;
			justify-content: center;
			text-align: center;
			box-sizing: border-box;

			// 防止注入的内容溢出
			:deep(img) {
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
}
</style>
