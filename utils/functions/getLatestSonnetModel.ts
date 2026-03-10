import Anthropic from "@anthropic-ai/sdk";

const FALLBACK_SONNET_MODEL = "claude-sonnet-4-5";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Module-level cache — best-effort persistence across edge isolate reuse
let cachedModel: string | null = null;
let cacheResolvedAt: number | null = null;

function isStableSonnet(modelId: string): boolean {
  const id = modelId.toLowerCase();
  return (
    id.includes("sonnet") &&
    !id.includes("preview") &&
    !id.includes("beta")
  );
}

export async function getLatestSonnetModel(client: Anthropic): Promise<string> {
  const now = Date.now();

  if (
    cachedModel !== null &&
    cacheResolvedAt !== null &&
    now - cacheResolvedAt < CACHE_TTL_MS
  ) {
    return cachedModel;
  }

  try {
    const page = await client.models.list();
    const stableSonnets = page.data
      .filter((m) => isStableSonnet(m.id))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    if (stableSonnets.length === 0) {
      return FALLBACK_SONNET_MODEL;
    }

    cachedModel = stableSonnets[0].id;
    cacheResolvedAt = now;
    return cachedModel;
  } catch {
    return FALLBACK_SONNET_MODEL;
  }
}
