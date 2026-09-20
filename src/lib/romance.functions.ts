import { createOpenAI } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({ note: z.string().trim().min(8, "Catatan terlalu singkat.").max(1200, "Catatan maksimal 1.200 karakter.") });

export const createRomanticMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: owner } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "owner" });
    if (!owner) throw new Error("Hanya pemilik yang dapat membuat pesan romantis.");
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Lovable AI belum tersedia.");

    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: "Kamu membantu menulis pesan romantis berbahasa Indonesia. Buat satu pesan yang hangat, tulus, personal, tidak berlebihan, tanpa judul, maksimal 130 kata. Pertahankan detail nyata dari catatan dan jangan mengarang nama, tanggal, atau janji baru.",
      prompt: `Catatan pribadi:\n${data.note}`,
      providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } },
    });
    const message = (await result.text).trim();
    if (!message) throw new Error("Lovable AI belum menghasilkan pesan. Coba lagi nanti.");
    return { message };
  });
