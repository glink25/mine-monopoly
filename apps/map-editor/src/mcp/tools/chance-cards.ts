/**
 * MCP Tools for Chance Card Management
 *
 * This module provides CRUD operations for chance cards through the Service Layer.
 * All business logic, validation, and event notifications are handled by mapContentService.
 */

import { mapContentService } from "@src/services";
import type { ChanceCard } from "@src/services/validators/chance-card-validators";

/**
 * Add a new chance card
 *
 * Service API: addChanceCard(data: Omit<ChanceCard, "id">): Promise<ChanceCard>
 */
export async function addChanceCard(args: unknown) {
	try {
		const data = args as Omit<ChanceCard, "id">;
		const result = await mapContentService.addChanceCard(data);
		return {
			success: true,
			id: result.id,
			chanceCard: result
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Update an existing chance card
 *
 * Service API: updateChanceCard(data: ChanceCard): Promise<ChanceCard>
 */
export async function updateChanceCard(args: unknown) {
	try {
		const data = args as ChanceCard;
		const result = await mapContentService.updateChanceCard(data);
		return {
			success: true,
			chanceCard: result
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Remove a chance card
 *
 * Service API: removeChanceCard(cardId: string): Promise<void>
 */
export async function removeChanceCard(args: unknown) {
	try {
		const params = args as { cardId: string };
		await mapContentService.removeChanceCard(params.cardId);
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
	}
];