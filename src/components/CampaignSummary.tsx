
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Rocket, Target, DollarSign, Calendar, Radio, Image, BarChart3 } from 'lucide-react';
import { Campaign, UserData } from '../types/campaign';
import CampaignImageGenerator from './CampaignImageGenerator';
import CampaignDashboard from './CampaignDashboard';
import { toast } from '@/components/ui/use-toast';
import { publishToInstagram } from '@/services/instagramPublisher';
import InstagramPreview from './InstagramPreview';
import TukiChat from './TukiChat';

interface CampaignSummaryProps {
  campaign: Campaign;
  userData: UserData;
  onBack: () => void;
  onEdit: () => void;
  // Nuevas props para el dashboard económico
  metaAdAccountId?: string;
  metaCampaignId?: string;
  metaAccessToken?: string;
  ventaPromedio?: number;
}

const CampaignSummary: React.FC<CampaignSummaryProps> = ({ 
  campaign, 
  userData, 
  onBack, 
  onEdit,
  metaAdAccountId = "act_123456789", // Default values para testing
  metaCampaignId = "camp_987654321",
  metaAccessToken = "test_token_12345",
  ventaPromedio = 50 // Default $50 USD
}) => {
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [campaignWithImages, setCampaignWithImages] = useState<Campaign>(campaign);
  const [showInstagramPreview, setShowInstagramPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [publishedSuccessfully, setPublishedSuccessfully] = useState(false);
  const [showEditBriefing, setShowEditBriefing] = useState(false);

  const handleGenerateImages = () => {
    setShowImageGenerator(true);
  };

  const handleImagesGenerated = (images: string[]) => {
    setCampaignWithImages(prev => ({ ...prev, imagenes: images }));
    setShowImageGenerator(false);
  };

  const handlePublishCampaign = async () => {
    setIsPublishing(true);
    
    try {
      // Verificar si hay imágenes disponibles
      const imageToUse = campaignWithImages.imagenes?.[0];
      
      if (!imageToUse) {
        toast({
          title: "Imagen requerida",
          description: "Necesitás una imagen para publicar en Instagram",
          variant: "destructive"
        });
        return;
      }

      // Mostrar preview de Instagram primero
      setShowInstagramPreview(true);
      
      // Simular publicación en Instagram
      const instagramPost = await publishToInstagram(campaignWithImages, userData, imageToUse);
      
      // Marcar como publicado exitosamente
      setPublishedSuccessfully(true);
      
      // Mostrar resultado exitoso
      toast({
        title: "🎉 ¡Campaña publicada!",
        description: `Tu publicación de Instagram fue programada exitosamente. ID: ${instagramPost.id.slice(-8)}`,
      });
      
      // Ocultar preview después de mostrar el toast
      setTimeout(() => {
        setShowInstagramPreview(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error publicando campaña:', error);
      toast({
        title: "Error al publicar",
        description: "Hubo un problema al publicar tu campaña. Intentá de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBackFromImageGenerator = () => {
    setShowImageGenerator(false);
  };

  const handleViewDashboard = () => {
    setShowDashboard(true);
  };

  const handleBackFromDashboard = () => {
    setShowDashboard(false);
  };

  const handleEditBriefing = () => {
    setShowEditBriefing(true);
  };

  const handleBackFromEditBriefing = () => {
    setShowEditBriefing(false);
  };

  // Mostrar editor de briefing si está activado
  if (showEditBriefing) {
    return <TukiChat />;
  }

  if (showImageGenerator) {
    return (
      <CampaignImageGenerator
        campaign={campaignWithImages}
        userData={userData}
        onBack={handleBackFromImageGenerator}
        onContinue={handleImagesGenerated}
      />
    );
  }

  // Mostrar dashboard económico si está activado
  if (showDashboard) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header del dashboard */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBackFromDashboard}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                📊 Rendimiento Económico
              </h2>
              <p className="text-gray-600">
                Así está funcionando tu campaña de <strong>{userData.productoServicio}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard económico */}
        <CampaignDashboard
          adAccountId={metaAdAccountId}
          campaignId={metaCampaignId}
          accessToken={metaAccessToken}
          ventaPromedio={ventaPromedio}
        />

        {/* Botones de acción */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={onEdit}
            variant="outline"
            className="px-6 py-2"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Optimizar campaña
          </Button>
          
          <Button
            onClick={onBack}
            className="px-6 py-2"
          >
            Crear nueva campaña
          </Button>
        </div>
      </div>
    );
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
            ¡Tu campaña está lista! 🎉
          </h2>
          <p className="text-gray-600">
            Revisá los detalles y generá imágenes para tu campaña
          </p>
        </div>
      </div>

      {/* Instagram Preview Modal */}
      {showInstagramPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">
              📸 Preview de tu publicación en Instagram
            </h3>
            <InstagramPreview
              caption={campaignWithImages.texto}
              imageUrl={campaignWithImages.imagenes?.[0] || ''}
              hashtags={['#emprendimiento', '#argentina', '#negocio']}
              accountName={userData.productoServicio.toLowerCase().replace(/\s+/g, '_')}
            />
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-sm">Publicando en Instagram...</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <p className="text-gray-800 font-medium text-lg">{campaignWithImages.titulo}</p>
            </div>
          </div>

          {/* Texto del anuncio */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📝</span>
              <h3 className="text-lg font-semibold text-gray-800">Texto del anuncio</h3>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <p className="text-gray-700 leading-relaxed">{campaignWithImages.texto}</p>
            </div>
          </div>

          {/* Imágenes generadas */}
          {campaignWithImages.imagenes && campaignWithImages.imagenes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🖼️</span>
                <h3 className="text-lg font-semibold text-gray-800">Imágenes de la campaña</h3>
              </div>
              <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-500">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {campaignWithImages.imagenes.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Campaign image ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grid de detalles */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Público objetivo */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <h3 className="text-lg font-semibold text-gray-800">Público objetivo</h3>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-gray-700">{userData.clienteIdeal}</p>
              </div>
            </div>

            {/* Canal */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛰️</span>
                <h3 className="text-lg font-semibold text-gray-800">Canal</h3>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-gray-700 font-medium">{campaignWithImages.canal}</p>
              </div>
            </div>

            {/* Presupuesto */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💰</span>
                <h3 className="text-lg font-semibold text-gray-800">Presupuesto sugerido</h3>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-gray-700 font-medium">{campaignWithImages.presupuesto}</p>
              </div>
            </div>

            {/* Duración */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🗓️</span>
                <h3 className="text-lg font-semibold text-gray-800">Duración sugerida</h3>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-gray-700 font-medium">{campaignWithImages.duracion}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Mostrar botón de generar imágenes si no hay imágenes */}
              {!campaignWithImages.imagenes || campaignWithImages.imagenes.length === 0 ? (
                <Button
                  onClick={handleGenerateImages}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Image className="w-5 h-5 mr-2" />
                  Generar imágenes
                </Button>
              ) : (
                // Mostrar todas las acciones después de tener imágenes
                <>
                  <Button
                    onClick={handleGenerateImages}
                    variant="outline"
                    className="border-2 border-purple-300 hover:border-purple-400 px-8 py-3 text-lg font-semibold"
                  >
                    <Image className="w-5 h-5 mr-2" />
                    Cambiar imágenes
                  </Button>

                  <Button
                    onClick={handlePublishCampaign}
                    disabled={isPublishing}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    {isPublishing ? 'Publicando...' : 'Publicar en Instagram'}
                  </Button>

                  {/* Botón para ver dashboard - siempre visible después de publicar */}
                  {publishedSuccessfully && (
                    <Button
                      onClick={handleViewDashboard}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Ver rendimiento económico
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Info adicional */}
      <div className="text-center text-sm text-gray-500">
        <p>🤖 Esta campaña fue generada automáticamente por Tuki basándose en tu briefing</p>
        {publishedSuccessfully && (
          <p className="mt-2 text-green-600 font-medium">
            ✅ ¡Campaña publicada! Podés ver su rendimiento económico haciendo click en "Ver rendimiento económico"
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignSummary;
