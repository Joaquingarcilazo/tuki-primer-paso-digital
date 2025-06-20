
import { buildImagePrompt } from '@/utils/imagePrompt';

export async function getProductImage(producto: string): Promise<string> {
  const prompt = buildImagePrompt(producto);

  const res = await fetch('/api/ai-image', {   // tu endpoint
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
  const { url } = await res.json();
  return url;              // ← URL generada
}
