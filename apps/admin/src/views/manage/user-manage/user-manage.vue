<script setup lang="ts">
import { User } from "@/interfaces/interfaces";
import { ref, onMounted, reactive, toRaw } from "vue";
import { getUserList, createUser, updateUser, deleteUser } from "@/utils/api/user";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>

<template>
	<div class="user-page">
	</div>
</template>

<style lang="scss" scoped>
.user-page {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.top-bar {
	width: 100%;
	height: 50px;
	border-radius: 10px;
	padding: 5px 20px;
	display: flex;
	align-items: center;
	box-shadow: var(--el-box-shadow-light);
	& > .button-container > * {
		float: right;
	}
}
.user-list-container {
	flex: 1;
	margin: 10px 0;
}

.user-card {
	height: 3rem;
	display: flex;
	justify-content: space-around;
	align-items: center;

	& > .avatar {
		$icon-size: 3rem;
		min-width: $icon-size;
		min-height: $icon-size;
		text-align: center;
		line-height: $icon-size;
		border-radius: 50%;
		font-size: 1.5rem;
		color: #ffffff;
		box-shadow: var(--box-shadow);
	}
}
</style>
