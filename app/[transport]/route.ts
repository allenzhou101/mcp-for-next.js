import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import { experimental_withMcpAuth } from "@vercel/mcp-adapter";
import DescopeClient from "@descope/node-sdk";
import { AuthInfo } from "./types";

async function verifyToken(
  req: Request,
  token: string,
): Promise<AuthInfo> {
    const descope = DescopeClient({
    projectId: process.env.DESCOPE_PROJECT_ID!,
    baseUrl: process.env.DESCOPE_BASE_URL!,
  });

  // First validate the token with Descope
  const authInfo = await descope.validateSession(token).catch((e) => {
    throw new Error("Failed to validate token");
  });

  // Extract scopes from token
  const scope = authInfo.token.scope as string | undefined;
  const scopes = scope ? scope.split(" ").filter(Boolean) : [];

  const clientId = authInfo.token.azp as string;

  return {
    token: authInfo.jwt,
    clientId,
    scopes,
    expiresAt: authInfo.token.exp,
  };
}

const mcpHandler = createMcpHandler(
  (server) => {
    server.tool(
      "echo",
      "Echo a message",
      { message: z.string() },
      async ({ message }, { authInfo }) => {
        console.log("Auth info", authInfo);
        const token = authInfo?.token;
        return {
          content: [{ type: "text", text: `Tool echo: ${message}\n\nToken: ${token}` }],
        }
      }
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
      },
    },
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
  }
);

const handler = experimental_withMcpAuth(mcpHandler, verifyToken);

export { handler as GET, handler as POST, handler as DELETE };
