/**
 * MCP Tools for Map Event Management
 *
 * This module provides CRUD operations for map events through the IPC Bridge.
 * All business logic, validation, and event notifications are handled by mapContentService
 * in the renderer process via the bridge.
 */

import { invokeTool } from "../bridge.js";
import { successResult, errorResult } from "../utils.js";
import type { MapEvent } from "@src/services/validators/map-event-validators";

/**
 * Add a new map event
 */
export async function addMapEvent(args: unknown) {
	try {
		const result = await invokeTool("add_map_event", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to add map event");
	}
}

/**
 * Update an existing map event
 */
export async function updateMapEvent(args: unknown) {
	try {
		const result = await invokeTool("update_map_event", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to update map event");
	}
}

/**
 * Remove a map event
 */
export async function removeMapEvent(args: unknown) {
	try {
		const result = await invokeTool("remove_map_event", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to remove map event");
	}
}

/**
 * List all map events
 */
export async function listMapEvents(args: unknown) {
	try {
		const result = await invokeTool("list_map_events", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to list map events");
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
	},
	{
		name: "list_map_events",
		description: "获取当前地图中所有地图事件的列表。返回所有地图事件的完整信息，包括 ID、名称、类型、描述、图标ID和效果代码。",
		inputSchema: {
			type: "object",
			properties: {},
			required: []
		},
		handler: listMapEvents
	}
];