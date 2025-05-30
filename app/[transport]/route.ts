import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import { withMcpAuth } from "./auth-wrapper";

async function verifyToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return { token: authHeader.split(' ')[1] };
}

const mcpHandler = async (req: Request) => {
  const session = await verifyToken(req);

  if (!session) {
    return new Response(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer error="invalid_token"'
      }
    });
  }

  return createMcpHandler(
    (server) => {
      server.tool(
        "echo",
        "Echo a message",
        { message: z.string() },
        async ({ message }) => ({
          content: [{ type: "text", text: `Tool echo: ${message}` }],
        })
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
  )(req);
};

const handler = withMcpAuth(mcpHandler, verifyToken);

export { handler as GET, handler as POST, handler as DELETE };
