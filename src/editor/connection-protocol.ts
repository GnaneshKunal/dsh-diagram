/**
 * Browser-safe Connection RPC protocol pieces for the editor iframe bundle.
 *
 * The `@deepseek-ai/dsh-client-connection` main entry imports node builtins and
 * the published package ships no browser-safe source for these two values, so
 * the editor vendors them. Definitions mirror the harness source
 * (packages/client/connection/src/rpc.ts and rpc-schema.ts); keep them in sync
 * until upstream exposes a browser-safe protocol entry.
 */

import { z } from "zod";
import type { RpcId as RpcIdType, ServerResponse } from "@deepseek-ai/dsh-client-connection";

/**
 * Brand one validated string as a Connection correlation id.
 * @param id - validated wire identity.
 * @returns the same string with the correlation-id brand.
 */
export function RpcId(id: string): RpcIdType {
  return id as RpcIdType;
}

/** Server response envelope; endpoint value validation belongs to its caller. */
export const serverResponseSchema = z.object({
  type: z.literal("server-response"),
  rpcId: z.string(),
  result: z.union([
    z.object({ ok: z.literal(true), value: z.unknown().optional() }),
    z.object({
      ok: z.literal(false),
      error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.string(), z.unknown()),
      }),
    }),
  ]),
}) as unknown as z.ZodType<ServerResponse>;
