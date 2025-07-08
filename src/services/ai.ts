
import { buildImagePrompt } from '@/utils/imagePrompt';

export async function getProductImage(producto: string): Promise<string> {
  const prompt = buildImagePrompt(producto);

  try {
    // Simular llamada a API local
    const response = await fetch('/api/ai-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error calling AI image API:', error);
    
    // Fallback directo si la API falla
    return getFallbackImageDirect(producto);
  }
}

function getFallbackImageDirect(producto: string): string {
  const lowerProduct = producto.toLowerCase();
  
  if (lowerProduct.includes('comida') || lowerProduct.includes('restaurante') || lowerProduct.includes('alimento')) {
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop';
  }
  if (lowerProduct.includes('ropa') || lowerProduct.includes('moda') || lowerProduct.includes('vestimenta')) {
    return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop';
  }
  if (lowerProduct.includes('tecnología') || lowerProduct.includes('software') || lowerProduct.includes('app')) {
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop';
  }
  
  return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop';
}
