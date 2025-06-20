
import { Campaign, UserData } from '../types/campaign';

export interface InstagramPost {
  id: string;
  caption: string;
  imageUrl: string;
  hashtags: string[];
  timestamp: string;
  platform: 'instagram';
  status: 'scheduled' | 'published';
}

export async function publishToInstagram(
  campaign: Campaign, 
  userData: UserData, 
  imageUrl: string
): Promise<InstagramPost> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generar hashtags basados en el producto/servicio
  const hashtags = generateHashtags(userData.productoServicio, userData.objetivoMarketing);
  
  // Crear el caption combinando el texto de la campaña con hashtags
  const caption = `${campaign.texto}\n\n${hashtags.join(' ')}`;
  
  // Simular respuesta de Instagram API
  const instagramPost: InstagramPost = {
    id: `ig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    caption,
    imageUrl,
    hashtags,
    timestamp: new Date().toISOString(),
    platform: 'instagram',
    status: 'scheduled' // En la vida real estaría programado para publicación
  };
  
  console.log('📸 Publicación simulada en Instagram:', instagramPost);
  
  return instagramPost;
}

function generateHashtags(producto: string, objetivo: string): string[] {
  const baseHashtags = ['#emprendimiento', '#argentina', '#negocio'];
  
  // Hashtags específicos del producto
  const productWords = producto.toLowerCase().split(' ');
  const productHashtags = productWords
    .filter(word => word.length > 3)
    .slice(0, 2)
    .map(word => `#${word}`);
  
  // Hashtags específicos del objetivo
  const objectiveHashtags = objetivo.toLowerCase().includes('venta') 
    ? ['#ventas', '#ofertas']
    : objetivo.toLowerCase().includes('marca')
    ? ['#branding', '#marketing']
    : ['#crecimiento', '#clientes'];
  
  return [...baseHashtags, ...productHashtags, ...objectiveHashtags].slice(0, 8);
}
