
export const buildImagePrompt = (producto: string): string => {
  // Crear un prompt más detallado basado en el tipo de producto/servicio
  const basePrompt = `Fotografía publicitaria profesional de ${producto}`;
  
  const lowerProduct = producto.toLowerCase();
  
  if (lowerProduct.includes('comida') || lowerProduct.includes('restaurante') || lowerProduct.includes('alimento')) {
    return `${basePrompt}, presentación gastronómica elegante, iluminación cálida, fondo limpio, alta calidad`;
  }
  
  if (lowerProduct.includes('ropa') || lowerProduct.includes('moda') || lowerProduct.includes('vestimenta')) {
    return `${basePrompt}, modelo profesional, estudio fotográfico, iluminación perfecta, estilo moderno`;
  }
  
  if (lowerProduct.includes('tecnología') || lowerProduct.includes('software') || lowerProduct.includes('app')) {
    return `${basePrompt}, ambiente tecnológico moderno, dispositivos elegantes, iluminación profesional`;
  }
  
  if (lowerProduct.includes('salud') || lowerProduct.includes('medicina') || lowerProduct.includes('bienestar')) {
    return `${basePrompt}, ambiente médico profesional, colores suaves, limpio y confiable`;
  }
  
  if (lowerProduct.includes('educación') || lowerProduct.includes('curso') || lowerProduct.includes('enseñanza')) {
    return `${basePrompt}, ambiente educativo moderno, libros, tecnología, inspirador`;
  }
  
  // Prompt genérico mejorado
  return `${basePrompt}, contexto de uso realista, iluminación profesional, alta calidad, estilo comercial moderno`;
};
