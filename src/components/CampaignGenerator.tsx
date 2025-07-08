
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Rocket, Sparkles } from 'lucide-react';
import CampaignSummary from './CampaignSummary';
import { UserData, Campaign, AudienceData } from '../types/campaign';

interface CampaignGeneratorProps {
  userData: UserData;
  audienceData?: AudienceData;
  onBack: () => void;
}

/* ---------- 1. Utilidad opcional de gramática mínima ---------- */
function ensureSpanishGrammar(text: string): string {
  let t = text.trim();
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (t.endsWith('?')) { if (!t.startsWith('¿')) t = '¿' + t; }
  else if (t.endsWith('!')) { if (!t.startsWith('¡')) t = '¡' + t; }
  else if (!/[.!?]$/.test(t)) { t += '.'; }
  return t.replace(/\btu\b/g, 'tú');
}

/* ---------- 2. Extraer producto/servicio del texto del usuario ---------- */
function extractProductService(userInput: string): string {
  const input = userInput.toLowerCase().trim();
  
  // Patrones comunes para extraer el producto/servicio
  const patterns = [
    /tengo (?:una?|un) (.+)/,
    /vendo (.+)/,
    /ofrezco (.+)/,
    /mi negocio es (?:de |una? |un )?(.+)/,
    /soy (.+)/,
    /trabajo (?:en |con |de )?(.+)/,
    /me dedico a (.+)/,
    /hago (.+)/
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      let product = match[1].trim();
      // Limpiar artículos innecesarios al final
      product = product.replace(/\s+en\s+.+$/, '');
      return product;
    }
  }

  // Si no encuentra patrón, devolver el input limpio
  return input.replace(/^(tengo|soy|vendo|ofrezco|mi negocio es|trabajo|me dedico a|hago)\s*/i, '');
}

/* ---------- 3. Título dirigido al consumidor ---------- */
const generateTitle = (productoServicio: string, cliente: string): string => {
  const producto = extractProductService(productoServicio);
  
  // Plantillas de títulos más naturales
  const templates = [
    `¿Necesitás ${producto}? ¡Contactanos!`,
    `¿Buscás ${producto} de calidad? ¡Escribinos!`,
    `${producto.charAt(0).toUpperCase() + producto.slice(1)} - ¡Consultá ahora!`,
    `¿Querés el mejor ${producto}? ¡Hablamos!`,
    `${producto.charAt(0).toUpperCase() + producto.slice(1)} de primera calidad`
  ];
  
  const randomTitle = templates[Math.floor(Math.random() * templates.length)];
  return ensureSpanishGrammar(randomTitle);
};

/* ---------- 4. Texto persuasivo coherente con el título ---------- */
const generateAdText = (
  producto: string,
  cliente: string,
  objetivo: string,
  title: string
): string => {
  // Extraer el producto limpio para usar en los templates
  const productoLimpio = extractProductService(producto);

  const templates: Record<string, string[]> = {
    /* OBJETIVO: VISIBILIDAD */
    'Aumentar visibilidad de mi marca': [
      `Descubrí nuestra línea de ${productoLimpio} y sentí la diferencia. Calidad garantizada.`,
      `Tu próximo ${productoLimpio} está acá. Elegí calidad y estilo hoy mismo.`,
      `Innovación y diseño en ${productoLimpio}. Mirá lo que tenemos preparado para vos.`,
      `Llevá tu experiencia al siguiente nivel con nuestros ${productoLimpio}. Conocenos ahora.`,
      `Somos referentes en ${productoLimpio}. Visitanos y comprobalo vos mismo.`
    ],

    /* OBJETIVO: CONSULTAS / LEADS */
    'Generar más leads/consultas': [
      `¿Buscás ${productoLimpio} de calidad? Escribinos y recibí asesoramiento gratis.`,
      `Consultá hoy por nuestros ${productoLimpio} y obtené respuestas al instante.`,
      `Contanos qué tipo de ${productoLimpio} necesitás y te ayudamos a elegir la mejor opción.`,
      `Obtené información detallada y presupuestos sin compromiso sobre ${productoLimpio}.`,
      `Estamos online para resolver tus dudas sobre ${productoLimpio}. ¡Consultanos ahora!`
    ],

    /* OBJETIVO: VENTAS DIRECTAS */
    'Aumentar ventas directas': [
      `Aprovechá esta promo en ${productoLimpio}. Stock limitado, ¡comprá ahora!`,
      `Financiación en cuotas y envío sin cargo en todos los ${productoLimpio}.`,
      `Comprá hoy tu ${productoLimpio} con descuento exclusivo y recibilo en 24 h.`,
      `Solo por tiempo limitado: 20% off en ${productoLimpio}. No te lo pierdas.`,
      `Llevate tu nuevo ${productoLimpio} con garantía total y precio especial.`
    ]
  };

  const lista = templates[objetivo] || templates['Aumentar visibilidad de mi marca'];
  const raw   = lista[Math.floor(Math.random() * lista.length)];
  return ensureSpanishGrammar(raw);
};

/* ---------- 4. Generar datos de audiencia estructurados ---------- */
const generateAudienceData = (cliente: string): AudienceData => {
  const ageRanges = [
    { min: 18, max: 35 },
    { min: 25, max: 45 },
    { min: 30, max: 50 },
    { min: 35, max: 55 }
  ];
  
  const locations = [
    'Argentina',
    'Buenos Aires, Argentina',
    'Principales ciudades de Argentina'
  ];
  
  const randomAgeRange = ageRanges[Math.floor(Math.random() * ageRanges.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  
  return {
    edadMin: randomAgeRange.min,
    edadMax: randomAgeRange.max,
    ubicacion: randomLocation,
    intereses: cliente.toLowerCase()
  };
};

/* ---------- 5. Formatear audiencia para mostrar ---------- */
const formatAudienceData = (audienceData: AudienceData): string => {
  const parts = [];
  
  if (audienceData.edadMin && audienceData.edadMax) {
    parts.push(`${audienceData.edadMin}-${audienceData.edadMax} años`);
  }
  
  if (audienceData.ubicacion) {
    parts.push(audienceData.ubicacion);
  }
  
  if (audienceData.intereses) {
    parts.push(`interesados en: ${audienceData.intereses}`);
  }
  
  return parts.join(', ');
};

const CampaignGenerator: React.FC<CampaignGeneratorProps> = ({ userData, audienceData, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    generateCampaign();
  }, []);

  const generateCampaign = () => {
    setIsGenerating(true);
    
    // Simular generación de campaña con datos del briefing
    setTimeout(() => {
      const generatedCampaign = createCampaignFromUserData(userData, audienceData);
      setCampaign(generatedCampaign);
      setIsGenerating(false);
    }, 3000);
  };

  const createCampaignFromUserData = (data: UserData, audience?: AudienceData): Campaign => {
    // Lógica para generar campaña basada en los datos del usuario
    const hasInstagramFacebook = data.redesSociales.some(red => 
      red.includes('Instagram') || red.includes('Facebook')
    );
    
    const canal = hasInstagramFacebook ? 'Meta Ads (Instagram/Facebook)' : 'Google Ads';
    
    // Generar título y texto con corrección automática
    const rawTitle = generateTitle(data.productoServicio, data.clienteIdeal);
    const titulo = ensureSpanishGrammar(rawTitle);
    
    const texto = generateAdText(
      data.productoServicio,
      data.clienteIdeal,
      data.objetivoMarketing,
      titulo
    );
    
    // Usar audiencia proporcionada o generar una nueva
    const finalAudience = audience || generateAudienceData(data.clienteIdeal);
    const publicoObjetivo = formatAudienceData(finalAudience);
    
    // Presupuesto sugerido basado en el objetivo
    const presupuesto = generateBudget(data.objetivoMarketing);
    
    return {
      titulo,
      texto,
      publicoObjetivo,
      presupuesto,
      duracion: '7 días',
      canal
    };
  };

  const generateBudget = (objetivo: string): string => {
    const budgets = {
      'Aumentar visibilidad de mi marca': '$15-25 por día',
      'Generar más leads/consultas': '$20-35 por día',
      'Aumentar ventas directas': '$25-40 por día'
    };
    
    return budgets[objetivo as keyof typeof budgets] || '$20-30 por día';
  };

  if (campaign) {
    return <CampaignSummary campaign={campaign} userData={userData} onBack={onBack} onEdit={() => {}} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Generando tu campaña perfecta
          </h2>
          <p className="text-gray-600">
            Tuki está analizando tu resumen para crear una campaña personalizada
          </p>
        </div>
      </div>

      {/* Loading Card */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              ¡Estoy trabajando en tu campaña!
            </h3>
            
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Analizando tu producto/servicio</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Identificando tu cliente ideal</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Creando mensajes persuasivos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-gray-400">Optimizando presupuesto y targeting</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CampaignGenerator;
