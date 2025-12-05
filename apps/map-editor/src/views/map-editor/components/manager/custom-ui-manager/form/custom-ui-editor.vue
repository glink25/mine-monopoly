<script setup lang="ts">
import { CustomUI } from "@fatpaper-monopoly/types";
import CodeEditor from "@src/components/code-editor/index.vue";
import libContent from "./editor-lib.d.ts?raw";
import templateText from "./template-text?raw";
import { onMounted, reactive, ref } from "vue";
import { Modal } from "ant-design-vue";
import UiSchemaForm from "./ui-schema-form.vue";

const props = defineProps<{ customUi: CustomUI }>();

const emits = defineEmits(["save", "delete"]);

const tempCustomUIForm = reactive<CustomUI>(props.customUi);

function handleSave() {
	emits("save", JSON.parse(JSON.stringify(tempCustomUIForm)));
}

function handleDelete() {
	Modal.confirm({
		title: `确定删除UI: "${props.customUi.name}" 吗?`,
		onOk: () => {
			emits("delete", props.customUi.id);
		},
		okText: "删除",
		cancelText: "取消",
	});
}
</script>

<template>
	<div class="custom-ui-editor">
		<a-form @finish="handleSave" :labelCol="{ style: { width: '60px' } }" :model="tempCustomUIForm" name="custom-ui">
			<a-form-item label="ID" :rules="[{ required: true, message: '请输入ID' }]">
				<a-input v-model:value="tempCustomUIForm.id" disabled />
			</a-form-item>

			<a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入UI名称' }]">
				<a-input v-model:value="tempCustomUIForm.name" />
			</a-form-item>

			<a-form-item label="X" :name="['layout', 'x']" :rules="[{ required: true, message: '布局数据X不能为空' }]">
				<a-input-number :min="0" v-model:value="tempCustomUIForm.layout.x" placeholder="请输入X坐标" />
			</a-form-item>

			<a-form-item label="Y" :name="['layout', 'y']" :rules="[{ required: true, message: '布局数据Y不能为空' }]">
				<a-input-number :min="0" v-model:value="tempCustomUIForm.layout.y" placeholder="请输入Y坐标" />
			</a-form-item>

			<a-form-item label="宽" :name="['layout', 'width']" :rules="[{ required: true, message: '布局数据宽不能为空' }]">
				<a-input-number :min="1" v-model:value="tempCustomUIForm.layout.width" placeholder="请输入宽度" />
			</a-form-item>

			<a-form-item label="高" :name="['layout', 'height']" :rules="[{ required: true, message: '布局数据高不能为空' }]">
				<a-input-number :min="1" v-model:value="tempCustomUIForm.layout.height" placeholder="请输入高度" />
			</a-form-item>

			<a-form-item>
				<a-button @click="handleDelete" danger>删除</a-button>
				<a-button style="margin-left: 10px" type="primary" html-type="submit">确认修改</a-button>
			</a-form-item>
		</a-form>
		<div class="code-editor-container">
			<UiSchemaForm :model-value="customUi.uiSchema" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.custom-ui-editor {
	height: 75vh;
	display: flex;
	justify-content: space-around;
	margin-top: 20px;
	gap: 10px;
}

.code-editor-container {
	flex: 1;
	height: 100%;
}
</style>
