/**
 * MCP Tools for Role Management
 *
 * This module provides CRUD operations for roles through the Service Layer.
 * All business logic, validation, and event notifications are handled by mapContentService.
 */

import { mapContentService } from "@src/services";
import type { Role } from "@src/services/validators/role-validators";

/**
 * Add a new role
 *
 * Service API: addRole(data: Omit<Role, "id">): Promise<Role>
 */
export async function addRole(args: unknown) {
	try {
		const data = args as Omit<Role, "id">;
		const result = await mapContentService.addRole(data);
		return {
			success: true,
			id: result.id,
			role: result
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Update an existing role
 *
 * Service API: updateRole(data: { roleId, ...fields }): Promise<Role>
 */
export async function updateRole(args: unknown) {
	try {
		const data = args as { roleId: string } & Partial<Omit<Role, "id">>;
		const result = await mapContentService.updateRole(data);
		return {
			success: true,
			role: result
		};
	} catch (error: any) {
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Remove a role
 *
 * Service API: removeRole(roleId: string): Promise<void>
 */
export async function removeRole(args: unknown) {
	try {
		const params = args as { roleId: string };
		await mapContentService.removeRole(params.roleId);
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
export const roleTools = [
	{
		name: "add_role",
		description: "添加新角色。参数：name（名称）, description?（描述，可选）, color?（颜色，可选）, initCode?（初始化代码，可选）, imageId?（图片ID，可选）",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string", description: "角色名称" },
				description: { type: "string", description: "角色描述" },
				color: { type: "string", description: "角色颜色" },
				initCode: { type: "string", description: "初始化代码" },
				imageId: { type: "string", description: "图片ID" }
			},
			required: ["name"]
		},
		handler: addRole
	},
	{
		name: "update_role",
		description: "更新角色。参数：roleId（角色ID）, name?, description?, color?, initCode?, imageId?",
		inputSchema: {
			type: "object",
			properties: {
				roleId: { type: "string", description: "角色ID" },
				name: { type: "string", description: "角色名称" },
				description: { type: "string", description: "角色描述" },
				color: { type: "string", description: "角色颜色" },
				initCode: { type: "string", description: "初始化代码" },
				imageId: { type: "string", description: "图片ID" }
			},
			required: ["roleId"]
		},
		handler: updateRole
	},
	{
		name: "remove_role",
		description: "删除角色。参数：roleId（角色ID）",
		inputSchema: {
			type: "object",
			properties: {
				roleId: { type: "string", description: "角色ID" }
			},
			required: ["roleId"]
		},
		handler: removeRole
	}
];