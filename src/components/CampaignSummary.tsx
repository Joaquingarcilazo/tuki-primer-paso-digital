
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Rocket, Target, DollarSign, Calendar, Radio } from 'lucide-react';

interface Campaign {
  titulo: string;
  texto: string;
  publicoObjetivo: string;
  presupuesto: string;
  duracion: string;
  canal: string;
}

interface UserData {
  productoServicio: string;
  clienteIdeal: string;
  objetivoMarketing: string;
  redesSociales: string[];
}

interface CampaignSummaryProps {
  campaign: Campaign;
  userData: UserData;
  onBack: () => void;
  onEdit: () => void;
}

const CampaignSummary: React.FC<CampaignSummaryProps> = ({ campaign, userData, onBack, onEdit }) => {
  const handlePublishCampaign = () => {
    // Simular publicación de campaña
    alert('🚀 ¡Excelente! Tu campaña está lista para publicar. En la versión completa, esto se conectaría directamente con las plataformas de publicidad. ¡Tu campaña se ve increíble!');
  };

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
            ¡Tu campaña está lista! 🎉
          </h2>
          <p className="text-gray-600">
            Revisá los detalles y decidí si querés editarla o publicarla
          </p>
        </div>
      </div>

      {/* Campaign Summary Card */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-8">
        <div className="space-y-8">
          {/* Título del anuncio */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📣</span>
              <h3 className="text-lg font-semibold text-gray-800">Título del anuncio</h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-gray-800 font-medium text-lg">{campaign.titulo}</p>
            </div>
          </div>

          {/* Texto del anuncio */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📝</span>
              <h3 className="text-lg font-semibold text-gray-800">Texto del anuncio</h3>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <p className="text-gray-700 leading-relaxed">{campaign.texto}</p>
            </div>
          </div>

          {/* Grid de detalles */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Público objetivo */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <h3 className="text-lg font-semibold text-gray-800">Público objetivo</h3>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-gray-700">{campaign.publicoObjetivo}</p>
              </div>
            </div>

            {/* Canal */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛰️</span>
                <h3 className="text-lg font-semibold text-gray-800">Canal</h3>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-gray-700 font-medium">{campaign.canal}</p>
              </div>
            </div>

            {/* Presupuesto */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💰</span>
                <h3 className="text-lg font-semibold text-gray-800">Presupuesto sugerido</h3>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-gray-700 font-medium">{campaign.presupuesto}</p>
              </div>
            </div>

            {/* Duración */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🗓️</span>
                <h3 className="text-lg font-semibold text-gray-800">Duración</h3>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-gray-700 font-medium">{campaign.duracion}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handlePublishCampaign}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Publicar campaña
              </Button>
              
              <Button
                onClick={onEdit}
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 text-lg font-semibold"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Editar campaña
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Info adicional */}
      <div className="text-center text-sm text-gray-500">
        <p>🤖 Esta campaña fue generada automáticamente por Tuki basándose en tu briefing</p>
      </div>
    </div>
  );
};

export default CampaignSummary;
