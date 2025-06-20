
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, SkipForward, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PreviewProps {
  creativeId: string;
  onContinue: () => void;
  token: string;
}

const PreviewAd: React.FC<PreviewProps> = ({ creativeId, onContinue, token }) => {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Función para limpiar el intervalo y continuar
  const handleContinue = useCallback(() => {
    console.log('🚀 Continuando con la siguiente funcionalidad de Tuki');
    onContinue();
  }, [onContinue]);

  // Efecto para obtener la vista previa de Meta
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setIsLoading(true);
        const metaToken = token || process.env.META_TOKEN;
        
        if (!metaToken) {
          throw new Error('Token de Meta no disponible');
        }

        const response = await fetch(
          `https://graph.facebook.com/v19.0/${creativeId}/previews?ad_format=DESKTOP_FEED_STANDARD&access_token=${metaToken}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Error al obtener vista previa');
        }

        if (data.data && data.data.length > 0) {
          setPreviewHtml(data.data[0].body);
          console.log('✅ Vista previa obtenida exitosamente');
        } else {
          throw new Error('No se encontró vista previa para este creative');
        }
      } catch (err) {
        console.error('❌ Error obteniendo vista previa:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        toast({
          title: "Error en vista previa",
          description: "No se pudo cargar la vista previa del anuncio",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (creativeId) {
      fetchPreview();
    }
  }, [creativeId, token]);

  // Efecto para el countdown
  useEffect(() => {
    if (secondsLeft <= 0) {
      handleContinue();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(interval);
          handleContinue();
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, handleContinue]);

  const handleSkip = () => {
    console.log('⏭️ Usuario saltó la vista previa');
    handleContinue();
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-red-50 border-red-200 p-8 text-center">
          <div className="text-red-600 mb-4">
            <h3 className="text-lg font-semibold">Error al cargar vista previa</h3>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <Button onClick={handleContinue} className="mt-4">
            Continuar de todas formas
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header con countdown */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                🎯 Vista previa de tu anuncio
              </h2>
              <p className="text-gray-600">
                Así se va a ver tu publicidad en Facebook e Instagram
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Countdown */}
              <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="font-mono text-lg font-bold text-orange-600">
                  🔥 {secondsLeft}s
                </span>
              </div>
              
              {/* Botón saltar */}
              <Button
                onClick={handleSkip}
                variant="outline"
                className="border-2 border-blue-300 hover:border-blue-400"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Saltar vista previa
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Vista previa del anuncio */}
      <Card className="bg-white shadow-xl border-0">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">📱</span>
            <h3 className="text-lg font-semibold text-gray-800">
              Preview del anuncio en Meta
            </h3>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-600">Cargando vista previa...</span>
              </div>
              <Skeleton className="h-64 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ) : previewHtml ? (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div 
                dangerouslySetInnerHTML={{ __html: previewHtml }}
                className="meta-ad-preview"
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No se pudo cargar la vista previa</p>
            </div>
          )}
        </div>
      </Card>

      {/* Info adicional */}
      <div className="text-center text-sm text-gray-500">
        <p>
          🤖 Esta vista previa es generada automáticamente por Meta Marketing API
        </p>
        <p className="mt-1">
          Segundos restantes: <span className="font-mono font-bold">{secondsLeft}</span>
        </p>
      </div>
    </div>
  );
};

export default PreviewAd;
