
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, Eye, MousePointer, ShoppingCart } from 'lucide-react';

interface CampaignDashboardProps {
  adAccountId: string;
  campaignId: string;
  accessToken: string;
  ventaPromedio: number; // Ticket promedio en USD
}

interface MetaInsights {
  spend: string;
  impressions: string;
  clicks: string;
  actions?: Array<{
    action_type: string;
    value: string;
  }>;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  adAccountId,
  campaignId,
  accessToken,
  ventaPromedio
}) => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<MetaInsights | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        
        const url = `https://graph.facebook.com/v19.0/${adAccountId}/insights`;
        const params = new URLSearchParams({
          access_token: accessToken,
          filtering: JSON.stringify([{
            field: 'campaign.id',
            operator: 'IN',
            value: [campaignId]
          }]),
          fields: 'spend,impressions,clicks,actions',
          date_preset: 'lifetime'
        });

        const response = await fetch(`${url}?${params}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          setInsights(data.data[0]);
        } else {
          setInsights({
            spend: '0',
            impressions: '0',
            clicks: '0'
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [adAccountId, campaignId, accessToken]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="font-medium">Error al cargar datos</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No hay datos disponibles aún</p>
        </CardContent>
      </Card>
    );
  }

  // Calcular métricas
  const gastoTotal = parseFloat(insights.spend || '0');
  const impresiones = parseInt(insights.impressions || '0');
  const clicks = parseInt(insights.clicks || '0');
  
  // Buscar conversiones en actions
  const conversiones = insights.actions?.find(
    action => action.action_type === 'purchase' || action.action_type === 'lead'
  );
  const numConversiones = conversiones ? parseInt(conversiones.value) : 0;
  
  // Calcular métricas económicas
  const ventasEstimadas = numConversiones * ventaPromedio;
  const roi = gastoTotal > 0 ? ((ventasEstimadas - gastoTotal) / gastoTotal) * 100 : 0;
  const cpc = clicks > 0 ? gastoTotal / clicks : 0;
  const ctr = impresiones > 0 ? (clicks / impresiones) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Rendimiento de tu Campaña</h2>
        <p className="text-gray-600 mt-1">Datos económicos actualizados</p>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Gasto Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${gastoTotal.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Dinero invertido en publicidad
            </p>
          </CardContent>
        </Card>

        {/* Ventas Estimadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Generadas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${ventasEstimadas.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {numConversiones} conversiones × ${ventaPromedio}
            </p>
          </CardContent>
        </Card>

        {/* ROI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retorno (ROI)</CardTitle>
            <TrendingUp className={`h-4 w-4 ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {roi >= 0 ? 'Ganancia' : 'Pérdida'} sobre inversión
            </p>
          </CardContent>
        </Card>

        {/* Ganancia/Pérdida */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ventasEstimadas >= gastoTotal ? 'Ganancia' : 'Pérdida'}
            </CardTitle>
            <DollarSign className={`h-4 w-4 ${ventasEstimadas >= gastoTotal ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${ventasEstimadas >= gastoTotal ? 'text-green-600' : 'text-red-600'}`}>
              {ventasEstimadas >= gastoTotal ? '+' : ''}${(ventasEstimadas - gastoTotal).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Resultado neto del anuncio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de Rendimiento</CardTitle>
          <CardDescription>
            Métricas técnicas de tu campaña publicitaria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Impresiones</p>
                <p className="text-2xl font-bold">{impresiones.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Personas que vieron tu anuncio</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <MousePointer className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Clicks</p>
                <p className="text-2xl font-bold">{clicks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">CTR: {ctr.toFixed(2)}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Costo por Click</p>
                <p className="text-2xl font-bold">${cpc.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Precio promedio por click</p>
              </div>
            </div>
          </div>

          {/* Barra de progreso ROI */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso hacia rentabilidad</span>
              <span>{Math.min(Math.max((ventasEstimadas / gastoTotal) * 100, 0), 200).toFixed(0)}%</span>
            </div>
            <Progress 
              value={Math.min(Math.max((ventasEstimadas / gastoTotal) * 100, 0), 100)} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              {ventasEstimadas >= gastoTotal 
                ? '¡Tu campaña es rentable!' 
                : `Necesitás $${(gastoTotal - ventasEstimadas).toFixed(2)} más en ventas para ser rentable`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resumen ejecutivo */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Resumen Ejecutivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose text-sm">
            <p className="mb-2">
              <strong>Estado de tu campaña:</strong> {' '}
              {roi >= 20 && 'Excelente rentabilidad'}
              {roi >= 0 && roi < 20 && 'Campaña rentable pero mejorable'}
              {roi >= -20 && roi < 0 && 'Campaña en pérdida, necesita optimización'}
              {roi < -20 && 'Campaña con pérdidas significativas'}
            </p>
            
            {numConversiones === 0 && gastoTotal > 0 && (
              <p className="text-amber-700 bg-amber-50 p-2 rounded text-xs">
                ⚠️ <strong>Sin conversiones aún:</strong> Tu anuncio está generando impresiones y clicks, 
                pero aún no registramos ventas. Esto es normal en campañas nuevas.
              </p>
            )}
            
            {roi >= 0 && (
              <p className="text-green-700 bg-green-50 p-2 rounded text-xs">
                ✅ <strong>¡Felicitaciones!</strong> Tu campaña está generando ganancias. 
                Por cada $1 invertido, estás obteniendo ${((ventasEstimadas/gastoTotal) || 0).toFixed(2)} en ventas.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDashboard;
