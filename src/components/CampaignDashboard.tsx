
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, Eye, MousePointer, ShoppingCart, AlertTriangle, CheckCircle, AlertCircle, Bot } from 'lucide-react';

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

  useEffect(() => {
    const simulateMetaInsights = async () => {
      try {
        setLoading(true);
        
        // Simular delay de API real
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generar datos simulados realistas para una campaña
        const simulatedInsights: MetaInsights = {
          spend: (Math.random() * 200 + 50).toFixed(2), // Entre $50-$250
          impressions: Math.floor(Math.random() * 8000 + 2000).toString(), // Entre 2k-10k
          clicks: Math.floor(Math.random() * 400 + 100).toString(), // Entre 100-500
          actions: [
            {
              action_type: 'purchase',
              value: Math.floor(Math.random() * 8 + 2).toString() // Entre 2-10 conversiones
            }
          ]
        };
        
        setInsights(simulatedInsights);
        
        console.log('📊 Datos simulados del dashboard:', simulatedInsights);
        
      } catch (err) {
        console.error('Error simulando insights:', err);
        // Datos de fallback
        setInsights({
          spend: '85.50',
          impressions: '4500',
          clicks: '280',
          actions: [{ action_type: 'purchase', value: '5' }]
        });
      } finally {
        setLoading(false);
      }
    };

    simulateMetaInsights();
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

      {/* Resumen ejecutivo con estilo de cards */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {/* Estado de la campaña */}
        <Card className={`${
          roi >= 20 ? 'bg-green-50 border-green-200' :
          roi >= 0 ? 'bg-blue-50 border-blue-200' :
          roi >= -20 ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado de Campaña</CardTitle>
            {roi >= 20 && <CheckCircle className="h-4 w-4 text-green-600" />}
            {roi >= 0 && roi < 20 && <TrendingUp className="h-4 w-4 text-blue-600" />}
            {roi >= -20 && roi < 0 && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
            {roi < -20 && <AlertCircle className="h-4 w-4 text-red-600" />}
          </CardHeader>
          <CardContent>
            <p className={`text-sm font-medium ${
              roi >= 20 ? 'text-green-700' :
              roi >= 0 ? 'text-blue-700' :
              roi >= -20 ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {roi >= 20 && 'Excelente rentabilidad'}
              {roi >= 0 && roi < 20 && 'Campaña rentable pero mejorable'}
              {roi >= -20 && roi < 0 && 'Campaña en pérdida, necesita optimización'}
              {roi < -20 && 'Campaña con pérdidas significativas'}
            </p>
          </CardContent>
        </Card>

        {/* Alert para sin conversiones */}
        {numConversiones === 0 && gastoTotal > 0 && (
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Conversiones</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 text-sm">
                Tu anuncio está generando impresiones y clicks, pero aún no registramos ventas. 
                Esto es normal en campañas nuevas.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Success para campaña rentable */}
        {roi >= 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">¡Felicitaciones!</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-sm">
                Tu campaña está generando ganancias. Por cada $1 invertido, 
                estás obteniendo ${((ventasEstimadas/gastoTotal) || 0).toFixed(2)} en ventas.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info de datos simulados */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Datos Simulados</CardTitle>
            <Bot className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 text-sm">
              Este dashboard muestra datos realistas simulados para demostración. 
              En producción se conectaría con Meta Marketing API.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDashboard;
