
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Image, Sparkles, Download, RefreshCw } from 'lucide-react';
import { Campaign, UserData } from '../types/campaign';

interface CampaignImageGeneratorProps {
  campaign: Campaign;
  userData: UserData;
  onBack: () => void;
  onContinue: (images: string[]) => void;
}

const CampaignImageGenerator: React.FC<CampaignImageGeneratorProps> = ({ 
  campaign, 
  userData, 
  onBack, 
  onContinue 
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generar prompt automático basado en la campaña
  const generateAutoPrompt = () => {
    return `Imagen promocional para ${userData.productoServicio}, estilo moderno y profesional, colores atractivos, alta calidad, para redes sociales`;
  };

  const handleGenerateImages = async () => {
    setIsGenerating(true);
    
    // Simular generación de imágenes (aquí se integraría con una API real)
    setTimeout(() => {
      const mockImages = [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop'
      ];
      setGeneratedImages(mockImages);
      setIsGenerating(false);
    }, 3000);
  };

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages(prev => 
      prev.includes(imageUrl) 
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  const handleContinue = () => {
    onContinue(selectedImages);
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
            Generá imágenes para tu campaña
          </h2>
          <p className="text-gray-600">
            Creá imágenes atractivas que complementen tu mensaje publicitario
          </p>
        </div>
      </div>

      {/* Prompt Section */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Image className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Describí la imagen que querés</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt sugerido (podés editarlo):
              </label>
              <Textarea
                value={customPrompt || generateAutoPrompt()}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describí el tipo de imagen que querés generar..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateImages}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generando imágenes...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generar imágenes
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isGenerating && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              ¡Creando tus imágenes!
            </h3>
            <p className="text-gray-600">
              Estoy generando imágenes únicas para tu campaña...
            </p>
          </div>
        </Card>
      )}

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Elegí las imágenes que más te gusten:
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div 
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                      selectedImages.includes(imageUrl) 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleImageSelection(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    {selectedImages.includes(imageUrl) && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-gray-600">
                {selectedImages.length} imagen(es) seleccionada(s)
              </p>
              
              <div className="space-x-3">
                <Button
                  onClick={handleGenerateImages}
                  variant="outline"
                  disabled={isGenerating}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generar más
                </Button>
                
                <Button
                  onClick={handleContinue}
                  disabled={selectedImages.length === 0}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Continuar con {selectedImages.length} imagen(es)
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Skip Option */}
      {!isGenerating && generatedImages.length === 0 && (
        <div className="text-center">
          <Button
            onClick={() => onContinue([])}
            variant="outline"
            className="text-gray-600"
          >
            Saltar generación de imágenes
          </Button>
        </div>
      )}
    </div>
  );
};

export default CampaignImageGenerator;
