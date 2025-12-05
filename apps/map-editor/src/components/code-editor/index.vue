<script setup lang="ts">
import * as monaco from "monaco-editor";
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import loader from "@monaco-editor/loader";

const props = withDefaults(
	defineProps<{
		templateText: string;
		extraLibs?: string[];
		language?: "typescript" | "javascript" | "html" | string;
	}>(),
	{
		language: "typescript",
	}
);

const code = defineModel<string>();

const containerRef = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let resizeObserver: ResizeObserver | null = null;

const initEditor = async () => {
	if (containerRef.value && !editor) {
		loader.config({ monaco });
		const monacoInstance = await loader.init();

		// 设置额外声明 (仅对 TS/JS 有效，HTML 模式下的 script 标签支持有限)
		if (props.extraLibs) {
			monacoInstance.languages.typescript.typescriptDefaults.setExtraLibs(props.extraLibs.map((s) => ({ content: s })));
		}

		editor = monacoInstance.editor.create(containerRef.value, {
			value: code.value && code.value !== "" ? code.value : props.templateText || "",
			language: props.language,
			minimap: { enabled: false },
			wordWrap: "on",
			theme: "vs",
		});

		// --- 双向绑定：编辑器 -> code ---
		editor.onDidChangeModelContent(() => {
			code.value = editor!.getValue();
		});
	}
};

// --- 双向绑定：外部 code -> 编辑器 ---
watch(code, (newValue) => {
	if (editor && newValue !== editor.getValue()) {
		editor.setValue(newValue || "");
	}
});

watch(
	() => props.language,
	(newLang) => {
		if (editor) {
			const model = editor.getModel();
			if (model) {
				monaco.editor.setModelLanguage(model, newLang);
			}
		}
	}
);

onMounted(async () => {
	await nextTick();
	resizeObserver = new ResizeObserver(() => {
		if (containerRef.value?.offsetWidth && containerRef.value?.offsetHeight) {
			initEditor();
		}
	});
	if (containerRef.value) {
		resizeObserver.observe(containerRef.value);
	}
});

onBeforeUnmount(() => {
	if (editor) {
		editor.dispose();
		editor = null;
	}
	if (resizeObserver && containerRef.value) {
		resizeObserver.unobserve(containerRef.value);
		resizeObserver = null;
	}
});
</script>

<template>
	<div ref="containerRef" id="editor"></div>
</template>

<style lang="scss" scoped>
#editor {
	width: 100%;
	height: 100%;
	border: 1px solid #cccccc;
	box-sizing: border-box;
	background-color: #eeeeee;
}
</style>
