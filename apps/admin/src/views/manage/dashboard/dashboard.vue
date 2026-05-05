<script setup lang="ts">
import { RoomMapItem } from "@/interfaces/interfaces";
import RoomItem from "./components/room-item.vue";
import { getRoomList } from "@/utils/api/room-list";
import { onBeforeUnmount, onMounted, ref } from "vue";

const roomList = ref<RoomMapItem[]>([]);
let setTimeOutId: any;

async function updateRoomList() {
	roomList.value = await getRoomList();
	setTimeOutId = setTimeout(updateRoomList, 2000);
}

onMounted(() => {
	updateRoomList();
});

onBeforeUnmount(() => {
	clearTimeout(setTimeOutId);
});
</script>

<template>
	<div class="dashboard">
		<div class="top-bar">
			<h4>当前房间列表({{ roomList.length }})</h4>
		</div>
		<a-row :gutter="[12, 12]" class="room-list">
			<a-col :xs="24" :sm="12" :lg="8" v-for="room in roomList" :key="room.roomId">
				<RoomItem :room="room" />
			</a-col>
		</a-row>
	</div>
</template>

<style lang="scss" scoped>
.dashboard {
	padding: 10px;

	.top-bar {
		width: 100%;
		height: 52px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		padding: 10px 20px;
		border-radius: 5px;
	}

	.room-list {
		flex: 1;
		overflow-y: scroll;
	}
}
</style>
