import crypto from "crypto";
import { env } from "@mine-monopoly/env";

type IceServer = {
	urls: string;
	username?: string;
	credential?: string;
};

function getStunUrl(): string {
	return `stun:${env<string>("TURN_URL")}:${env<number>("STUN_PORT")}`;
}

function getTurnUrl(): string {
	// 3G 网络下 UDP 可能被运营商限速/丢包，用 turns: (TLS over TCP) 更可靠
	return `turns:${env<string>("TURN_URL")}:${env<number>("TURN_PORT")}`;
}

function generateTurnCredentials(userId: string): { username: string; credential: string } {
	// env() 返回字符串，TURN_TTL 不匹配 PORT 模式不会被自动转为 number
	// 必须显式 Number() 否则数字+字符串会变成字符串拼接 → HMAC 永远不匹配
	const ttl = Number(env("TURN_TTL"));
	const secret = env<string>("TURN_SECRET");
	const timestamp = Math.floor(Date.now() / 1000) + ttl;
	const username = `${timestamp}:${userId}`;
	const credential = crypto.createHmac("sha1", secret).update(username).digest("base64");
	return { username, credential };
}

/**
 * 生成 iceServers 配置。
 * - 有 userId：返回 STUN + TURN（带动态凭证）
 * - 无 userId（游客）：仅返回 STUN
 */
export function generateIceServers(userId?: string): IceServer[] {
	const servers: IceServer[] = [{ urls: getStunUrl() }];
	if (userId) {
		const { username, credential } = generateTurnCredentials(userId);
		servers.push({ urls: getTurnUrl(), username, credential });
	}
	return servers;
}
