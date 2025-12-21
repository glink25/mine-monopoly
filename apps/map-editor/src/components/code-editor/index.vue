<script setup lang="ts">
import * as monaco from "monaco-editor";
import { ref, onMounted, onBeforeUnmount, nextTick, watch, toRaw } from "vue";
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
let monacoInstance: typeof monaco | null = null;

let isInitializing = false;

const updateExtraLibs = (libs: string[]) => {
	if (!monacoInstance) return;

	const libDefinitions = libs.map((content, index) => ({
		content,
		filePath: `file:///extra-lib-${index}.d.ts`,
	}));

	monacoInstance.languages.typescript.typescriptDefaults.setExtraLibs(libDefinitions);
};

const initEditor = async () => {
	if (editor || isInitializing || !containerRef.value) return;

	isInitializing = true;

	try {
		loader.config({ monaco });
		monacoInstance = await loader.init();

		if (props.extraLibs) {
			updateExtraLibs(props.extraLibs);
		}
		monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
			target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
			allowNonTsExtensions: true,
			moduleResolution: monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
			module: monacoInstance.languages.typescript.ModuleKind.CommonJS,
			noEmit: true,
			esModuleInterop: true,
		});

		if (!containerRef.value) return;

		editor = monacoInstance.editor.create(containerRef.value, {
			value: code.value && code.value !== "" ? code.value : props.templateText || "",
			language: props.language,
			minimap: { enabled: false },
			wordWrap: "on",
			theme: "vs",
			automaticLayout: false,
		});

		// --- 双向绑定：编辑器 -> code ---
		editor.onDidChangeModelContent(() => {
			code.value = editor!.getValue();
		});
	} catch (error) {
		console.error("Monaco Editor Init Failed:", error);
	} finally {
		isInitializing = false;
	}
};

// --- 双向绑定：外部 code -> 编辑器 ---
watch(code, (newValue) => {
	if (editor && newValue !== editor.getValue()) {
		editor.setValue(newValue || "");
	}
});

// --- 监听 extraLibs 变化 ---
watch(
	() => props.extraLibs,
	(newValue) => {
		if (newValue) {
			updateExtraLibs(newValue);
		}
	},
	{ deep: true }
);

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
	await initEditor();
	resizeObserver = new ResizeObserver(() => {
		if (editor) {
			editor.layout();
		}
	});

	if (containerRef.value) {
		resizeObserver.observe(containerRef.value);
	}
});

onBeforeUnmount(() => {
	if (resizeObserver && containerRef.value) {
		resizeObserver.unobserve(containerRef.value);
		resizeObserver.disconnect();
		resizeObserver = null;
	}

	if (editor) {
		const model = editor.getModel();
		if (model) model.dispose();
		editor.dispose();
		editor = null;
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
