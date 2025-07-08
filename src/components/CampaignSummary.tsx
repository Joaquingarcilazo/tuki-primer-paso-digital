import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Rocket, Target, DollarSign, Calendar, Radio, Image, BarChart3, Sparkles, CheckCircle, Hand } from 'lucide-react';
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
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [publishedSuccessfully, setPublishedSuccessfully] = useState(false);
  const [showEditBriefing, setShowEditBriefing] = useState(false);
  const [showPublishedPost, setShowPublishedPost] = useState(false);

  // Imágenes específicas para cada tipo de negocio
  const businessImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', // Frente de tienda de ropa deportiva
    'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400&h=300&fit=crop', // Personas dibujando planos de arquitectura
    'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop', // Fábrica de muebles
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'  // Interior de gimnasio con gente ejercitándose
  ];

  // Función para obtener la imagen correspondiente según el ID
  const getImageForId = (imageId: string) => {
    const index = parseInt(imageId.split('-')[1]) - 1;
    return {
      url: businessImages[index] || businessImages[0],
      alt: `Opción ${index + 1}`
    };
  };

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

      // Obtener la URL real de la imagen
      const imageData = getImageForId(imageToUse);
      
      // Simular publicación en Instagram
      const instagramPost = await publishToInstagram(campaignWithImages, userData, imageData.url);
      
      // Marcar como publicado exitosamente
      setPublishedSuccessfully(true);
      
      // Mostrar resultado exitoso
      toast({
        title: "🎉 ¡Campaña publicada!",
        description: `Tu publicación de Instagram fue publicada exitosamente. ID: ${instagramPost.id.slice(-8)}`,
      });
      
      // Mostrar el paso intermedio del posteo publicado
      setShowPublishedPost(true);
      
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

  const handleBackFromPublishedPost = () => {
    setShowPublishedPost(false);
  };

  const handleContinueFromPublishedPost = () => {
    setShowPublishedPost(false);
    setShowDashboard(true);
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

  // Mostrar paso intermedio del posteo publicado
  if (showPublishedPost) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBackFromPublishedPost}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🎉 ¡Posteo publicado!
            </h2>
            <p className="text-gray-600">
              Tu campaña ya está corriendo en Instagram. Mirá cómo quedó:
            </p>
          </div>
        </div>

        {/* Instagram Post Display */}
        <div className="flex justify-center">
          <InstagramPreview
            caption={campaignWithImages.texto}
            imageUrl={getImageForId(campaignWithImages.imagenes![0]).url}
            hashtags={['#emprendimiento', '#argentina', '#negocio']}
            accountName={userData.productoServicio.split(' ')[0].toLowerCase()}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleContinueFromPublishedPost}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Impacto de tu inversión
          </Button>
        </div>

        {/* Info adicional */}
        <div className="text-center text-sm text-gray-500">
          <p><Hand className="w-4 h-4 inline mr-1" /> Aquí arriba podés ver en tiempo real cómo está funcionando tu campaña</p>
        </div>
      </div>
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
                Así está funcionando tu campaña en tiempo real
              </h2>
              <p className="text-gray-600">
                Campaña de <strong>{userData.productoServicio}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard económico */}
        <CampaignDashboard />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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

      <div className="grid lg:grid-cols-1 gap-6">
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
                    {campaignWithImages.imagenes.map((imageId, index) => {
                      const imageData = getImageForId(imageId);
                      return (
                        <div key={index} className="w-full h-20 relative rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={imageData.url}
                            alt={imageData.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
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

              {/* Canal digital */}
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
                      className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      {isPublishing ? 'Publicando...' : 'Publicar en Instagram'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Info adicional */}
      <div className="text-center text-sm text-gray-500">
        <p>🤖 Esta campaña fue generada por Tuki a partir de tu negocio</p>
      </div>
    </div>
  );
};

export default CampaignSummary;
