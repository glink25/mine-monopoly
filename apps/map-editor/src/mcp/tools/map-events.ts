/**
 * MCP Tools for Map Event Management
 *
 * This module provides CRUD operations for map events through the Service Layer.
 * All business logic, validation, and event notifications are handled by mapContentService.
 */

import { mapContentService } from "@src/services";
import type { MapEvent } from "@src/services/validators/map-event-validators";

/**
 * Add a new map event
 *
 * Service API: addMapEvent(data: Omit<MapEvent, "id">): Promise<MapEvent>
 */
export async function addMapEvent(args: unknown) {
	try {
		const data = args as Omit<MapEvent, "id">;
		const result = await mapContentService.addMapEvent(data);
		return {
			success: true,
			id: result.id,
			mapEvent: result
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Update an existing map event
 *
 * Service API: updateMapEvent(data: MapEvent): Promise<MapEvent>
 */
export async function updateMapEvent(args: unknown) {
	try {
		const data = args as MapEvent;
		const result = await mapContentService.updateMapEvent(data);
		return {
			success: true,
			mapEvent: result
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Remove a map event
 *
 * Service API: removeMapEvent(eventId: string): Promise<void>
 */
export async function removeMapEvent(args: unknown) {
	try {
		const params = args as { eventId: string };
		await mapContentService.removeMapEvent(params.eventId);
		return { success: true };
	} catch (error: any) {
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Export tool definitions for MCP server
 */
export const mapEventTools = [
	{
		name: "add_map_event",
		description: "添加新地图事件。参数：name（名称）, type（类型）, description?（描述，可选）, iconId?（图标ID，可选）, effectCode?（效果代码，可选）",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string", description: "地图事件名称" },
				type: { type: "string", description: "地图事件类型" },
				description: { type: "string", description: "地图事件描述" },
				iconId: { type: "string", description: "图标ID" },
				effectCode: { type: "string", description: "效果代码" }
			},
			required: ["name", "type"]
		},
		handler: addMapEvent
	},
	{
		name: "update_map_event",
		description: "更新地图事件。参数：id（事件ID）, name, type, description?, iconId?, effectCode?",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "string", description: "地图事件ID" },
				name: { type: "string", description: "地图事件名称" },
				type: { type: "string", description: "地图事件类型" },
				description: { type: "string", description: "地图事件描述" },
				iconId: { type: "string", description: "图标ID" },
				effectCode: { type: "string", description: "效果代码" }
			},
			required: ["id", "name", "type"]
		},
		handler: updateMapEvent
	},
	{
		name: "remove_map_event",
		description: "删除地图事件。参数：eventId（事件ID）",
		inputSchema: {
			type: "object",
			properties: {
				eventId: { type: "string", description: "地图事件ID" }
			},
			required: ["eventId"]
		},
		handler: removeMapEvent
	}
];