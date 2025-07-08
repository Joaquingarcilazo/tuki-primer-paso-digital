
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Eye, MousePointer, ShoppingCart, ArrowRight } from 'lucide-react';

// Función para manejar el botón de Tuki
const handleTryFree = () => {
  // Reemplaza esta URL con la URL de tu formulario de Google
  const googleFormUrl = 'https://forms.gle/TU_GOOGLE_FORM_ID';
  window.open(googleFormUrl, '_blank');
};

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

interface InvestmentData {
  type: string;
  amount: number;
  color: string;
}

const kpiData: KPI[] = [
  {
    label: 'Impresiones',
    value: '124,890',
    subtitle: 'vs. 98,760 el mes pasado',
    icon: Eye,
  },
  {
    label: 'Clicks',
    value: '28,730',
    subtitle: 'vs. 22,450 el mes pasado',
    icon: MousePointer,
  },
  {
    label: 'Conversiones',
    value: '6,340',
    subtitle: 'vs. 5,120 el mes pasado',
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
  { day: 'Lunes', impresiones: 12000, clicks: 2400, ventas: 450 },
  { day: 'Martes', impresiones: 15000, clicks: 3000, ventas: 500 },
  { day: 'Miércoles', impresiones: 13000, clicks: 2600, ventas: 480 },
  { day: 'Jueves', impresiones: 14000, clicks: 2800, ventas: 520 },
  { day: 'Viernes', impresiones: 16000, clicks: 3200, ventas: 550 },
  { day: 'Sábado', impresiones: 18000, clicks: 3600, ventas: 600 },
  { day: 'Domingo', impresiones: 20000, clicks: 4000, ventas: 650 },
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
  'Considera aumentar tu presupuesto en Instagram para maximizar el retorno.',
  'Experimenta con anuncios de video para atraer a una audiencia más amplia.',
  'A/B test diferentes textos de anuncios para mejorar tu CTR.',
];

// Datos para el gráfico de inversión vs ingresos
const investmentData: InvestmentData[] = [
  { type: 'Inversión total', amount: 25000, color: '#ef4444' },
  { type: 'Ingresos generados', amount: 78500, color: '#10b981' },
];

const CampaignDashboard: React.FC = () => {
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

      {/* ROI Summary - Moved to first position */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            💰 Retorno de tu inversión
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Inversión total</p>
              <p className="text-2xl font-bold text-gray-800">$25,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ingresos generados</p>
              <p className="text-2xl font-bold text-green-600">$78,500</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Retorno</p>
              <p className="text-3xl font-bold text-green-600">314%</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Por cada $1 invertido, obtuviste $3.14 de retorno
          </p>
        </div>
      </Card>

      {/* Investment vs Income Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Inversión vs Ingresos
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={investmentData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              maxBarSize={120}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="type" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                domain={[0, 'dataMax + 5000']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {investmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Inversión</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Ingresos</span>
          </div>
        </div>
      </Card>

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
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                maxBarSize={40}
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
                  domain={[0, 'dataMax + 1000']}
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
    </div>
  );
};

export default CampaignDashboard;
