
import axios from 'axios';

// Simulador de generación de imágenes usando Unsplash API
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Usar Unsplash API para obtener imágenes relacionadas al prompt
    // Extraer palabras clave del prompt para buscar imágenes relevantes
    const keywords = extractKeywords(prompt);
    const searchQuery = keywords.join(' ');
    
    try {
      // Intentar obtener imagen de Unsplash
      const unsplashResponse = await axios.get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': 'Client-ID 8QFJQg4j5U8N-HuE_XXX' // Demo key (limitada)
          }
        }
      );

      if (unsplashResponse.data.results && unsplashResponse.data.results.length > 0) {
        const imageUrl = unsplashResponse.data.results[0].urls.regular;
        return new Response(JSON.stringify({ url: imageUrl }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (unsplashError) {
      console.log('Unsplash API failed, using fallback images');
    }

    // Fallback: usar imágenes de demostración basadas en el tipo de producto
    const fallbackImage = getFallbackImage(prompt);
    
    return new Response(JSON.stringify({ url: fallbackImage }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function extractKeywords(prompt: string): string[] {
  // Extraer palabras clave relevantes del prompt
  const words = prompt.toLowerCase().split(' ');
  const relevantWords = words.filter(word => 
    word.length > 3 && 
    !['para', 'con', 'una', 'del', 'las', 'los', 'por', 'que', 'como', 'alta', 'calidad', 'profesional'].includes(word)
  );
  return relevantWords.slice(0, 3); // Tomar las 3 primeras palabras relevantes
}

function getFallbackImage(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Mapear tipos de productos a imágenes apropiadas
  if (lowerPrompt.includes('comida') || lowerPrompt.includes('restaurante') || lowerPrompt.includes('alimento')) {
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop';
  }
  if (lowerPrompt.includes('ropa') || lowerPrompt.includes('moda') || lowerPrompt.includes('vestimenta')) {
    return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop';
  }
  if (lowerPrompt.includes('tecnología') || lowerPrompt.includes('software') || lowerPrompt.includes('app')) {
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop';
  }
  if (lowerPrompt.includes('salud') || lowerPrompt.includes('medicina') || lowerPrompt.includes('bienestar')) {
    return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop';
  }
  if (lowerPrompt.includes('educación') || lowerPrompt.includes('curso') || lowerPrompt.includes('enseñanza')) {
    return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop';
  }
  if (lowerPrompt.includes('servicio') || lowerPrompt.includes('consultoría') || lowerPrompt.includes('asesor')) {
    return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop';
  }
  
  // Imagen por defecto para productos/servicios generales
  return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop';
}
