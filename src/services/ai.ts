
import { buildImagePrompt } from '@/utils/imagePrompt';
import { generateImage } from './imageApi';

export async function getProductImage(producto: string): Promise<string> {
  const prompt = buildImagePrompt(producto);

  try {
    // Llamar directamente a la función de generación de imágenes
    const imageUrl = await generateImage(prompt);
    return imageUrl;
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
  if (lowerProduct.includes('ropa') || lowerProduct.includes('moda') || lowerProduct.includes('vestimenta') || lowerProduct.includes('tenis')) {
    return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop';
  }
  if (lowerProduct.includes('tecnología') || lowerProduct.includes('software') || lowerProduct.includes('app')) {
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop';
  }
  if (lowerProduct.includes('deportes') || lowerProduct.includes('deporte') || lowerProduct.includes('raquetas') || lowerProduct.includes('tenis')) {
    return 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop';
  }
  
  return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop';
}
