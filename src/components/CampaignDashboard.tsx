
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Eye, MousePointer, ShoppingCart, ArrowRight } from 'lucide-react';

// Función para manejar el botón de Tuki
const handleTryFree = () => {
  // Reemplaza esta URL con la URL de tu formulario de Google
  const googleFormUrl = 'https://forms.gle/FgSmcEL2c2HBopz49';
  window.open(googleFormUrl, '_blank');
};

interface KPI {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface InvestmentData {
  type: string;
  amount: number;
  color: string;
}

const kpiData: KPI[] = [
  {
    label: 'Impresiones',
    value: '2,847',
    subtitle: 'vs. 1,923 el mes pasado',
    icon: Eye,
  },
  {
    label: 'Clicks',
    value: '457',
    subtitle: 'vs. 289 el mes pasado',
    icon: MousePointer,
  },
  {
    label: 'Conversiones',
    value: '89',
    subtitle: 'vs. 67 el mes pasado',
    icon: ShoppingCart,
  },
  {
    label: 'Crecimiento de usuarios',
    value: '+47%',
    subtitle: 'vs. el mes pasado',
    icon: Users,
  },
];

// Datos para el gráfico de inversión vs ingresos
const investmentData: InvestmentData[] = [
  { type: 'Inversión', amount: 8500, color: '#ef4444' },
  { type: 'Ingresos', amount: 26700, color: '#10b981' },
];

const CampaignDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📊 Dashboard de tu campaña
        </h1>
      </div>

      {/* ROI Summary - First position */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            💰 Retorno de tu inversión
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Inversión total</p>
              <p className="text-2xl font-bold text-gray-800">$8,500</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ingresos generados</p>
              <p className="text-2xl font-bold text-green-600">$26,700</p>
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
        <div className="h-64 relative">
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

      {/* Call to Action Button */}
      <Card className="p-8 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            🚀 ¿Te gustan estos resultados?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tuki puede ayudarte a obtener resultados similares para tu negocio. 
            Estás a un click de probarlo gratis.
          </p>
          <Button 
            onClick={handleTryFree}
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg font-semibold"
          >
            Probar Tuki gratis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CampaignDashboard;
