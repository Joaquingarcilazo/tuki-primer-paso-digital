
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Sparkles, CheckCircle } from 'lucide-react';

interface UserData {
  productoServicio: string;
  clienteIdeal: string;
  objetivoMarketing: string;
  redesSociales: string[];
}

interface OnboardingSummaryProps {
  userData: UserData;
  onEdit: () => void;
}

const OnboardingSummary: React.FC<OnboardingSummaryProps> = ({ userData, onEdit }) => {
  const handleGenerateCampaign = () => {
    // Por ahora solo mostramos un mensaje, en el futuro se conectará al generador de campañas
    alert('¡Genial! La funcionalidad de generación de campañas estará disponible pronto. Por ahora, tu briefing está guardado y listo para usar 🚀');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Perfecto! Tu briefing está listo
        </h2>
        <p className="text-gray-600">
          Revisá la información que me diste y cuando estés conforme, podemos generar tu primera campaña
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-8">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Producto/Servicio */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                Tu producto o servicio
              </h3>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-3">
                {userData.productoServicio || 'No especificado'}
              </p>
            </div>

            {/* Cliente Ideal */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                Tu cliente ideal
              </h3>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-3">
                {userData.clienteIdeal || 'No especificado'}
              </p>
            </div>

            {/* Objetivo */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                Objetivo de marketing
              </h3>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-3">
                {userData.objetivoMarketing || 'No especificado'}
              </p>
            </div>

            {/* Redes Sociales */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                Tus redes sociales
              </h3>
              <div className="bg-gray-50 rounded-lg p-3">
                {userData.redesSociales.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.redesSociales.map((red, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        {red}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No tengo redes activas aún</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGenerateCampaign}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generar mi primera campaña
              </Button>
              
              <Button
                onClick={onEdit}
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 text-lg font-semibold"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Editar respuestas
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Info */}
      <div className="text-center text-sm text-gray-500">
        <p>💾 Tu información se guardó localmente en tu navegador</p>
      </div>
    </div>
  );
};

export default OnboardingSummary;
