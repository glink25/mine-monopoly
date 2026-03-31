/**
 * MCP Tools for Chance Card Management
 *
 * This module provides CRUD operations for chance cards through the IPC Bridge.
 * All business logic, validation, and event notifications are handled by mapContentService
 * in the renderer process via the bridge.
 */

import { invokeTool } from "../bridge.js";
import { successResult, errorResult } from "../utils.js";
import type { ChanceCard } from "@src/services/validators/chance-card-validators";

/**
 * Add a new chance card
 */
export async function addChanceCard(args: unknown) {
	try {
		const result = await invokeTool("add_chance_card", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to add chance card");
	}
}

/**
 * Update an existing chance card
 */
export async function updateChanceCard(args: unknown) {
	try {
		const result = await invokeTool("update_chance_card", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to update chance card");
	}
}

/**
 * Remove a chance card
 */
export async function removeChanceCard(args: unknown) {
	try {
		const result = await invokeTool("remove_chance_card", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to remove chance card");
	}
}

/**
 * List all chance cards
 */
export async function listChanceCards(args: unknown) {
	try {
		const result = await invokeTool("list_chance_cards", args);
		return successResult(result);
	} catch (error: any) {
		return errorResult(error.message || "Failed to list chance cards");
	}
}

/**
 * Export tool definitions for MCP server
 */
export const chanceCardTools = [
	{
		name: "add_chance_card",
		description: "添加新的机会卡。参数：name（名称）, type（类型：attack/defense/buff/debuff/special）, description（描述）, color（颜色，如#FF0000）, iconId?（图标ID，可选）, effectCode（效果代码）",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string", description: "机会卡名称" },
				type: { type: "string", description: "机会卡类型" },
				description: { type: "string", description: "机会卡描述" },
				color: { type: "string", description: "机会卡颜色" },
				iconId: { type: "string", description: "图标ID（可选）" },
				effectCode: { type: "string", description: "效果代码" }
			},
			required: ["name", "type", "description", "color", "effectCode"]
		},
		handler: addChanceCard
	},
	{
		name: "update_chance_card",
		description: "更新机会卡。参数：id（机会卡ID）, name, type, description, color, iconId?, effectCode",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "string", description: "机会卡ID" },
				name: { type: "string", description: "机会卡名称" },
				type: { type: "string", description: "机会卡类型" },
				description: { type: "string", description: "机会卡描述" },
				color: { type: "string", description: "机会卡颜色" },
				iconId: { type: "string", description: "图标ID（可选）" },
				effectCode: { type: "string", description: "效果代码" }
			},
			required: ["id", "name", "type", "description", "color", "effectCode"]
		},
		handler: updateChanceCard
	},
	{
		name: "remove_chance_card",
		description: "删除机会卡。参数：cardId（机会卡ID）",
		inputSchema: {
			type: "object",
			properties: {
				cardId: { type: "string", description: "机会卡ID" }
			},
			required: ["cardId"]
		},
		handler: removeChanceCard
	},
	{
		name: "list_chance_cards",
		description: "获取当前地图中所有机会卡的列表。返回所有机会卡的完整信息，包括 ID、名称、类型、描述、颜色、图标ID和效果代码。",
		inputSchema: {
			type: "object",
			properties: {},
			required: []
		},
		handler: listChanceCards
	}
];