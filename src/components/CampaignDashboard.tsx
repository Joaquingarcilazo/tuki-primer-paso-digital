import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Eye, MousePointer, ShoppingCart, ArrowRight } from 'lucide-react';

interface KPI {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface DailyMetric {
  day: string;
  impresiones: number;
  clicks: number;
  ventas: number;
}

interface SocialMediaPerformance {
  platform: string;
  ctr: number;
  color: string;
}

interface Insight {
  type: string;
  text: string;
}

const kpiData: KPI[] = [
  {
    label: 'Impresiones',
    value: '12,489',
    subtitle: 'vs. 9,876 el mes pasado',
    icon: Eye,
  },
  {
    label: 'Clicks',
    value: '2,873',
    subtitle: 'vs. 2,245 el mes pasado',
    icon: MousePointer,
  },
  {
    label: 'Conversiones',
    value: '634',
    subtitle: 'vs. 512 el mes pasado',
    icon: ShoppingCart,
  },
  {
    label: 'Crecimiento de usuarios',
    value: '+23%',
    subtitle: 'vs. el mes pasado',
    icon: Users,
  },
];

const dailyMetrics: DailyMetric[] = [
  { day: 'Lunes', impresiones: 1200, clicks: 240, ventas: 45 },
  { day: 'Martes', impresiones: 1500, clicks: 300, ventas: 50 },
  { day: 'Miércoles', impresiones: 1300, clicks: 260, ventas: 48 },
  { day: 'Jueves', impresiones: 1400, clicks: 280, ventas: 52 },
  { day: 'Viernes', impresiones: 1600, clicks: 320, ventas: 55 },
  { day: 'Sábado', impresiones: 1800, clicks: 360, ventas: 60 },
  { day: 'Domingo', impresiones: 2000, clicks: 400, ventas: 65 },
];

const socialMediaPerformance: SocialMediaPerformance[] = [
  { platform: 'Facebook', ctr: 8, color: '#1877F2' },
  { platform: 'Instagram', ctr: 12, color: '#E4405F' },
  { platform: 'Twitter', ctr: 6, color: '#1DA1F2' },
  { platform: 'LinkedIn', ctr: 4, color: '#2867B2' },
];

const insights: Insight[] = [
  { type: 'CTR', text: 'Tu CTR ha aumentado un 15% en la última semana gracias a los nuevos creativos.' },
  { type: 'Audiencia', text: 'La mayoría de tus conversiones provienen de usuarios entre 25 y 34 años.' },
  { type: 'Plataforma', text: 'Instagram está generando el mayor retorno de inversión en este momento.' },
];

const recommendations: string[] = [
  'Considera aumentar tu presupuesto en Instagram para maximizar el ROI.',
  'Experimenta con anuncios de video para atraer a una audiencia más amplia.',
  'A/B test diferentes textos de anuncios para mejorar tu CTR.',
];

const CampaignDashboard: React.FC = () => {
  const handleTryFree = () => {
    // Reemplaza esta URL con la URL de tu formulario de Google
    const googleFormUrl = 'https://forms.gle/TU_GOOGLE_FORM_ID';
    window.open(googleFormUrl, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📊 Dashboard de tu campaña
        </h1>
        <p className="text-gray-600 text-lg">
          Así está funcionando tu campaña publicitaria en tiempo real
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.subtitle}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <kpi.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Métricas por Día */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Métricas por día
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={dailyMetrics} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                maxBarSize={60}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                  domain={[0, 'dataMax + 50']}
                />
                <Bar dataKey="impresiones" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ventas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Impresiones</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Clicks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Ventas</span>
            </div>
          </div>
        </Card>

        {/* Performance por Red Social */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Performance por red social
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={socialMediaPerformance} 
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                maxBarSize={80}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="platform" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                  domain={[0, 'dataMax + 10']}
                />
                <Bar dataKey="ctr" radius={[4, 4, 0, 0]}>
                  {socialMediaPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {socialMediaPerformance.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.platform}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Insights y Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🔍 Insights clave
          </h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">
                  {insight.type}
                </Badge>
                <p className="text-sm text-gray-700">{insight.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💡 Recomendaciones
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ROI Summary */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            💰 Retorno de Inversión (ROI)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Inversión total</p>
              <p className="text-2xl font-bold text-gray-800">$2,500</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ingresos generados</p>
              <p className="text-2xl font-bold text-green-600">$7,850</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-3xl font-bold text-green-600">314%</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Por cada $1 invertido, obtuviste $3.14 de retorno
          </p>
        </div>
      </Card>

      {/* CTA Section */}
      <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          ¿Te gustó lo que viste? 🚀
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Tuki puede crear campañas así de efectivas para tu negocio en minutos
        </p>
        <Button 
          onClick={handleTryFree}
          size="lg" 
          className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
        >
          Probar Tuki gratis
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <p className="text-sm mt-3 opacity-75">
          Sin tarjeta de crédito • Configuración en 5 minutos
        </p>
      </Card>
    </div>
  );
};

export default CampaignDashboard;
