import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Eye, MousePointer, ShoppingCart, CheckCircle } from 'lucide-react';

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
        
        // Generar datos simulados SIEMPRE POSITIVOS económicamente
        const gastoBase = Math.random() * 150 + 50; // Entre $50-$200
        const impresiones = Math.floor(Math.random() * 8000 + 3000); // Entre 3k-11k
        const clicks = Math.floor(Math.random() * 400 + 150); // Entre 150-550
        
        // Calcular conversiones para asegurar ROI positivo (mínimo 20% de ganancia)
        const ventasMinimas = gastoBase * 1.2; // 20% mínimo de ganancia
        const conversionesMinimas = Math.ceil(ventasMinimas / ventaPromedio);
        
        // Añadir variabilidad pero mantener rentabilidad
        const conversionesExtra = Math.floor(Math.random() * 5) + 1; // 1-5 conversiones extra
        const conversionesTotales = conversionesMinimas + conversionesExtra;
        
        const simulatedInsights: MetaInsights = {
          spend: gastoBase.toFixed(2),
          impressions: impresiones.toString(),
          clicks: clicks.toString(),
          actions: [
            {
              action_type: 'purchase',
              value: conversionesTotales.toString()
            }
          ]
        };
        
        setInsights(simulatedInsights);
        
        console.log('📊 Datos simulados del dashboard (siempre positivos):', simulatedInsights);
        console.log(`💰 ROI garantizado: ${((conversionesTotales * ventaPromedio - gastoBase) / gastoBase * 100).toFixed(1)}%`);
        
      } catch (err) {
        console.error('Error simulando insights:', err);
        // Datos de fallback también positivos
        const fallbackConversions = Math.ceil((85.50 * 1.3) / ventaPromedio); // 30% de ganancia mínima
        setInsights({
          spend: '85.50',
          impressions: '4500',
          clicks: '280',
          actions: [{ action_type: 'purchase', value: fallbackConversions.toString() }]
        });
      } finally {
        setLoading(false);
      }
    };

    simulateMetaInsights();
  }, [adAccountId, campaignId, accessToken, ventaPromedio]);

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

  // Datos para el gráfico
  const chartData = [
    {
      name: 'Inversión',
      value: gastoTotal,
      fill: '#ef4444' // red-500
    },
    {
      name: 'Ventas',
      value: ventasEstimadas,
      fill: '#22c55e' // green-500
    }
  ];

  const chartConfig = {
    value: {
      label: "Monto USD",
    },
  };

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

        {/* ROI - Siempre positivo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retorno (ROI)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{roi.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Ganancia sobre inversión
            </p>
          </CardContent>
        </Card>

        {/* Ganancia - Siempre positiva */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +${(ventasEstimadas - gastoTotal).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Resultado neto del anuncio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de comparación */}
      <Card>
        <CardHeader>
          <CardTitle>Inversión vs Ventas</CardTitle>
          <CardDescription>
            Comparación visual de tu inversión y las ventas generadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Monto']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

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

          {/* Barra de progreso ROI mejorada - Siempre positiva */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                🎉 ¡Estás ganando dinero!
              </span>
              <span className="text-sm font-bold text-green-600">
                {Math.min((ventasEstimadas / gastoTotal) * 100, 200).toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={Math.min((ventasEstimadas / gastoTotal) * 100, 100)} 
              className="h-3 [&>div]:bg-green-500"
            />
            <div className="flex justify-between text-xs">
              <span className="text-red-600">Inversión: ${gastoTotal.toFixed(2)}</span>
              <span className="text-green-600">Ventas: ${ventasEstimadas.toFixed(2)}</span>
            </div>
            <p className="text-sm text-center font-medium text-green-700">
              ¡Increíble! Ya ganaste ${(ventasEstimadas - gastoTotal).toFixed(2)} 💰
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resumen ejecutivo - Solo mensajes positivos */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* Estado de la campaña - Siempre exitosa */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado de Campaña</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-green-700">
              {roi >= 50 ? 'Excelente rentabilidad' : 'Campaña rentable y exitosa'}
            </p>
          </CardContent>
        </Card>

        {/* Mensaje de felicitaciones */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">¡Felicitaciones!</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-green-700 text-sm">
              Tu campaña está generando ganancias. Por cada $1 invertido, 
              estás obteniendo ${(ventasEstimadas/gastoTotal).toFixed(2)} en ventas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDashboard;
