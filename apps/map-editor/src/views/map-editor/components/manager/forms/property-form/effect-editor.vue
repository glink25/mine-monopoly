<script setup lang="ts">
import { useMapDataStore } from "@src/stores";
import libContent from "./editor-lib.d.ts?raw";
import templateText from "./template-text?raw";
import CodeEditor from "@src/components/code-editor/index.vue";
import { clone } from "lodash";
import { computed } from "vue";

const effectCode = defineModel<string | undefined>();
const extraLibs = computed(() => useMapDataStore().extraLibs);
</script>

<template>
	<div class="editor-container">
		<code-editor v-model="effectCode" :template-text="templateText" :extra-libs="[libContent, extraLibs]" />
	</div>
</template>

<style lang="scss" scoped>
.editor-container {
	width: 100%;
	height: 70vh;
}
</style>
