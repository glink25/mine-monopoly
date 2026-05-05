<script setup lang="ts">
import { AdminUserListItem } from "@/interfaces/interfaces";
import { ref, onMounted } from "vue";
import { getUserList, deleteUser } from "@/utils/api/user";
import { isMobileDevice } from "@/utils/index";
import UserForm from "./components/user-form.vue";

const isMobile = isMobileDevice();
const userList = ref<AdminUserListItem[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(8);
const searchText = ref("");
const formVisible = ref(false);
const currentUser = ref<AdminUserListItem | undefined>();
const tableLoading = ref(false);

const columns = [
	{ title: "头像", dataIndex: "avatar", key: "avatar", align: "center" as const },
	{ title: "账号", dataIndex: "useraccount", key: "useraccount", align: "center" as const },
	{ title: "用户名", dataIndex: "username", key: "username", align: "center" as const },
	{ title: "在线", dataIndex: "online", key: "online", align: "center" as const },
	{ title: "管理员", dataIndex: "isAdmin", key: "isAdmin", align: "center" as const },
	{ title: "操作", key: "action", align: "center" as const },
];

let searchTimer: ReturnType<typeof setTimeout> | null = null;

async function updateList() {
	tableLoading.value = true;
	try {
		const data = await getUserList(currentPage.value, pageSize.value, searchText.value || undefined);
		userList.value = data.userList;
		total.value = data.total;
	} finally {
		tableLoading.value = false;
	}
}

function handleSearch(value: string) {
	searchText.value = value;
	currentPage.value = 1;
	if (searchTimer) clearTimeout(searchTimer);
	searchTimer = setTimeout(() => updateList(), 300);
}

function handlePageChange(page: number) {
	currentPage.value = page;
	updateList();
}

function handleCreate() {
	currentUser.value = undefined;
	formVisible.value = true;
}

function handleEdit(user: AdminUserListItem) {
	currentUser.value = user;
	formVisible.value = true;
}

function handleFormClose() {
	currentUser.value = undefined;
}

async function handleFormFinish() {
	formVisible.value = false;
	await updateList();
}

async function handleDelete(id: string) {
	await deleteUser(id);
	await updateList();
}

onMounted(() => {
	updateList();
});
</script>

<template>
	<div class="user-page">
		<div class="top-bar">
			<div class="left">
				<a-input-search
					placeholder="搜索用户名或账号"
					class="search-input"
					allow-clear
					@change="(e: Event) => handleSearch((e.target as HTMLInputElement).value)"
				/>
			</div>
			<div class="right">
				<a-button type="primary" @click="handleCreate">新增用户</a-button>
			</div>
		</div>

		<!-- 桌面端：表格 -->
		<div v-if="!isMobile" class="user-list-container">
			<a-table
				:columns="columns"
				:data-source="userList"
				:loading="tableLoading"
				:pagination="{
					current: currentPage,
					pageSize: pageSize,
					total: total,
					showTotal: (total: number) => `${total} 个用户`,
					onChange: handlePageChange,
					showLessItems: true,
				}"
				row-key="id"
			>
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'avatar'">
						<a-avatar
							v-if="record.avatar"
							:src="record.avatar"
							:size="40"
							:style="{ border: `2px solid ${record.color}` }"
						/>
						<div v-else class="avatar-circle" :style="{ backgroundColor: record.color }">
							{{ record.username?.charAt(0) }}
						</div>
					</template>
					<template v-if="column.key === 'online'">
						<a-tag :color="record.online ? 'green' : 'default'">
							{{ record.online ? "在线" : "离线" }}
						</a-tag>
					</template>
					<template v-if="column.key === 'isAdmin'">
						<a-tag v-if="record.isAdmin" color="blue">管理员</a-tag>
					</template>
					<template v-if="column.key === 'action'">
						<a-space>
							<a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
							<a-popconfirm title="确认删除该用户？" @confirm="handleDelete(record.id)">
								<a-button type="link" danger size="small">删除</a-button>
							</a-popconfirm>
						</a-space>
					</template>
				</template>
			</a-table>
		</div>

		<!-- 手机端：卡片列表 -->
		<div v-else class="user-card-list">
			<a-empty v-if="userList.length === 0" description="没有数据" />
			<div v-for="user in userList" :key="user.id" class="user-card">
				<div class="user-card-header">
					<a-avatar
						v-if="user.avatar"
						:src="user.avatar"
						:size="40"
						:style="{ border: `2px solid ${user.color}` }"
					/>
					<div v-else class="avatar-circle" :style="{ backgroundColor: user.color }">
						{{ user.username?.charAt(0) }}
					</div>
					<div class="user-card-info">
						<span class="user-card-name">{{ user.username }}</span>
						<span class="user-card-account">{{ user.useraccount }}</span>
					</div>
					<a-tag :color="user.online ? 'green' : 'default'" class="user-card-tag">
						{{ user.online ? "在线" : "离线" }}
					</a-tag>
				</div>
				<div class="user-card-footer">
					<div class="user-card-badges">
						<a-tag v-if="user.isAdmin" color="blue">管理员</a-tag>
					</div>
					<a-space>
						<a-button type="link" size="small" @click="handleEdit(user)">编辑</a-button>
						<a-popconfirm title="确认删除该用户？" @confirm="handleDelete(user.id)">
							<a-button type="link" danger size="small">删除</a-button>
						</a-popconfirm>
					</a-space>
				</div>
			</div>
			<div class="user-card-pagination">
				<a-pagination
					show-less-items
					v-model:current="currentPage"
					:total="total"
					:pageSize="pageSize"
					@change="handlePageChange"
				/>
			</div>
		</div>
	</div>

	<a-modal
		@close="handleFormClose"
		destroyOnClose
		:title="currentUser ? '编辑用户' : '新增用户'"
		:width="'min(420px, 90vw)'"
		v-model:open="formVisible"
		:footer="null"
	>
		<UserForm :user="currentUser" @finish="handleFormFinish" />
	</a-modal>
</template>

<style lang="scss" scoped>
.user-page {
	padding: 10px;
	display: flex;
	flex-direction: column;
	height: 100%;

	.top-bar {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		padding: 10px 20px;
		border-radius: 5px;

		.search-input {
			flex: 1;
			max-width: 260px;
		}
	}

	.user-list-container {
		flex: 1;
		margin-top: 10px;
		background-color: #fff;
		border-radius: 5px;
		padding: 10px;
	}

	.avatar-circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 16px;
		font-weight: bold;
	}

	.user-card-list {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 10px;

		.user-card {
			background: #fff;
			border-radius: 5px;
			padding: 12px 16px;

			.user-card-header {
				display: flex;
				align-items: center;
				gap: 12px;

				.user-card-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 2px;

					.user-card-name {
						font-weight: bold;
						color: #333;
					}

					.user-card-account {
						font-size: 12px;
						color: #999;
					}
				}
			}

			.user-card-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 10px;
				padding-top: 10px;
				border-top: 1px solid #f0f0f0;
			}
		}

		.user-card-pagination {
			display: flex;
			justify-content: center;
			padding: 10px 0;
		}
	}
}
</style>
