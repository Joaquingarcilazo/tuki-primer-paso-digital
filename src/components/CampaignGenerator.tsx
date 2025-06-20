import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Rocket, Sparkles } from 'lucide-react';
import CampaignSummary from './CampaignSummary';

interface UserData {
  productoServicio: string;
  clienteIdeal: string;
  objetivoMarketing: string;
  redesSociales: string[];
}

interface Campaign {
  titulo: string;
  texto: string;
  publicoObjetivo: string;
  presupuesto: string;
  duracion: string;
  canal: string;
}

interface CampaignGeneratorProps {
  userData: UserData;
  onBack: () => void;
}

const CampaignGenerator: React.FC<CampaignGeneratorProps> = ({ userData, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    generateCampaign();
  }, []);

  const generateCampaign = () => {
    setIsGenerating(true);
    
    // Simular generación de campaña con datos del briefing
    setTimeout(() => {
      const generatedCampaign = createCampaignFromUserData(userData);
      setCampaign(generatedCampaign);
      setIsGenerating(false);
    }, 3000);
  };

  const createCampaignFromUserData = (data: UserData): Campaign => {
    // Lógica para generar campaña basada en los datos del usuario
    const hasInstagramFacebook = data.redesSociales.some(red => 
      red.includes('Instagram') || red.includes('Facebook')
    );
    
    const canal = hasInstagramFacebook ? 'Meta Ads (Instagram/Facebook)' : 'Google Ads';
    
    // Generar título basado en el producto/servicio
    const titulo = generateTitle(data.productoServicio, data.objetivoMarketing);
    
    // Generar texto del anuncio que complemente el título
    const texto = generateAdText(data.productoServicio, data.clienteIdeal, data.objetivoMarketing);
    
    // Generar público objetivo
    const publicoObjetivo = generateTargetAudience(data.clienteIdeal);
    
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

  const generateTitle = (producto: string, objetivo: string): string => {
    const templates = {
      'Aumentar visibilidad de mi marca': [
        `Descubre ${producto.toLowerCase()} que está revolucionando el mercado`,
        `¿Conocés ${producto.toLowerCase()}? Te va a sorprender`,
        `La solución que buscabas: ${producto.toLowerCase()}`,
        `${producto} - La innovación que necesitabas`,
        `Conocé ${producto.toLowerCase()} y transformá tu experiencia`
      ],
      'Generar más leads/consultas': [
        `Consulta gratuita sobre ${producto.toLowerCase()}`,
        `Obtené más información sobre ${producto.toLowerCase()}`,
        `¿Necesitás ${producto.toLowerCase()}? Contactanos`,
        `${producto} - Consulta sin compromiso`,
        `Solicitá información sobre ${producto.toLowerCase()} ahora`
      ],
      'Aumentar ventas directas': [
        `Comprá ${producto.toLowerCase()} con descuento especial`,
        `Oferta limitada: ${producto.toLowerCase()}`,
        `Aprovechá esta oportunidad única con ${producto.toLowerCase()}`,
        `${producto} - Precio especial por tiempo limitado`,
        `No te pierdas esta oferta de ${producto.toLowerCase()}`
      ]
    };
    
    const options = templates[objetivo as keyof typeof templates] || templates['Aumentar visibilidad de mi marca'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateAdText = (producto: string, cliente: string, objetivo: string): string => {
    const templates = {
      'Aumentar visibilidad de mi marca': [
        `Calidad premium que marca la diferencia. Visitá nuestro showroom y descubrí por qué somos líderes en el mercado.`,
        `Tecnología de vanguardia al alcance de tus manos. Experimentá la excelencia que te mereces.`,
        `Años de experiencia nos respaldan. Vení y comprobá la diferencia de trabajar con los mejores.`,
        `Productos de primera línea que superan expectativas. Tu satisfacción es nuestra prioridad.`,
        `Innovación y calidad se unen en cada producto. Descubrí lo que nos hace únicos en el sector.`
      ],
      'Generar más leads/consultas': [
        `Nuestros especialistas te brindan asesoramiento personalizado sin costo. Llamá ahora y resolvé todas tus dudas.`,
        `Recibí información detallada y presupuesto personalizado. Te acompañamos en cada paso del proceso.`,
        `Charlamos sobre tus necesidades y te proponemos la mejor solución. Sin compromiso, con total transparencia.`,
        `Te orientamos para que tomes la mejor decisión. Atención personalizada de lunes a viernes.`,
        `Dejanos tus datos y te contactamos en el día. Respondemos todas tus preguntas de manera clara y directa.`
      ],
      'Aumentar ventas directas': [
        `Aprovechá esta promoción exclusiva por tiempo limitado. Financiación disponible y envío gratuito.`,
        `Stock limitado, no te quedes sin el tuyo. Garantía extendida y el mejor precio del mercado.`,
        `Oferta válida hasta agotar stock. Comprá hoy y recibilo en 24 horas en CABA y GBA.`,
        `Precio especial para los primeros 50 clientes. Incluye accesorios de regalo y garantía total.`,
        `Última semana de descuentos especiales. Pagá en cuotas sin interés y llevátelo ya.`
      ]
    };
    
    const options = templates[objetivo as keyof typeof templates] || templates['Aumentar visibilidad de mi marca'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateTargetAudience = (cliente: string): string => {
    // Extraer información básica del cliente ideal
    const ageRanges = ['18-35 años', '25-45 años', '30-50 años', '35-55 años'];
    const locations = ['Argentina', 'Buenos Aires, Argentina', 'Principales ciudades de Argentina'];
    
    const randomAge = ageRanges[Math.floor(Math.random() * ageRanges.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    return `${randomAge}, ${randomLocation}, interesados en: ${cliente.toLowerCase()}`;
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
            Tuki está analizando tu briefing para crear una campaña personalizada
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
