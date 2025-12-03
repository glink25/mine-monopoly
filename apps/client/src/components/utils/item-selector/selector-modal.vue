<script setup lang="ts">
import { ref, PropType } from "vue";
import FpDialog from "../fp-dialog/fp-dialog.vue";
import ItemSelector from "./item-selector.vue";

// 定义接收的参数
const props = defineProps({
	// ItemSelector 需要的参数
	itemList: { type: Array as PropType<any[]>, default: () => [] },
	column: { type: Number, default: 3 },
	keyName: { type: String, default: "id" },
	multiple: { type: Boolean, default: false },
	selectedKey: { type: [String, Array] as PropType<string | string[]>, default: "" },
	// 弹窗参数
	title: { type: String, default: "请选择" },
	// 用于自定义 item 显示的渲染函数 (可选)
	renderItem: { type: Function, default: undefined },
});

const emit = defineEmits(["confirm", "cancel"]);

const visible = ref(false);
const currentSelected = ref<string | string[]>(props.multiple ? [] : "");

// 初始化数据
const init = () => {
	if (props.multiple) {
		currentSelected.value = Array.isArray(props.selectedKey) ? [...props.selectedKey] : [];
	} else {
		currentSelected.value = props.selectedKey;
	}
	visible.value = true;
};

// 暴露给函数式调用
defineExpose({ init });

const handleSubmit = () => {
	emit("confirm", currentSelected.value);
	visible.value = false;
};

const handleCancel = () => {
	emit("cancel");
	visible.value = false;
};
</script>

<template>
	<FpDialog v-model:visible="visible" :append-to-body="false" @submit="handleSubmit" @cancel="handleCancel">
		<template #title>{{ title }}</template>

		<div class="selector-container">
			<ItemSelector
				:column="column"
				:item-list="itemList"
				:key-name="keyName"
				:multiple="multiple"
				v-model:selected-key="currentSelected"
			>
				<template #item="itemProps">
					<component v-if="renderItem" :is="renderItem(itemProps)" />
					<div v-else class="default-item-content">
						{{ itemProps.name || itemProps[keyName] }}
					</div>
				</template>
			</ItemSelector>
		</div>
	</FpDialog>
</template>

<style scoped>
.selector-container {
	/* 限制高度，防止弹窗过长 */
	max-height: 60vh;
	overflow-y: auto;
	padding: 10px;
}
.default-item-content {
	padding: 20px;
	text-align: center;
	font-weight: bold;
}
</style>
