
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Eye, MousePointer, Users, RefreshCw } from 'lucide-react';

interface CampaignDashboardProps {
  adAccountId: string;
  campaignId: string;
  accessToken: string;
  ventaPromedio: number;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  adAccountId,
  campaignId,
  accessToken,
  ventaPromedio
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data
  const metricas = {
    impresiones: 8820,
    clicks: 444,
    ctr: 5.03,
    cpm: 12.50,
    cpc: 0.28,
    gasto: 124.32,
    ventas: 5,
    ingresos: ventaPromedio * 5
  };

  const inversionVsVentas = [
    { name: 'Inversión', value: Math.round(metricas.gasto), color: '#ef4444' },
    { name: 'Ventas', value: Math.round(metricas.ingresos), color: '#22c55e' }
  ];

  const rendimientoDiario = [
    { dia: 'Lun', impresiones: 1200, clicks: 60, ventas: 1 },
    { dia: 'Mar', impresiones: 1400, clicks: 70, ventas: 1 },
    { dia: 'Mié', impresiones: 1600, clicks: 85, ventas: 1 },
    { dia: 'Jue', impresiones: 1800, clicks: 95, ventas: 1 },
    { dia: 'Vie', impresiones: 1920, clicks: 89, ventas: 1 },
    { dia: 'Sáb', impresiones: 900, clicks: 45, ventas: 0 }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Conectando con Meta Ads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Ganancia</p>
              <p className="text-2xl font-bold text-green-600">
                +${(metricas.ingresos - metricas.gasto).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Resultado neto del anuncio</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Impresiones</p>
              <p className="text-2xl font-bold">{metricas.impresiones.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Personas que vieron tu anuncio</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <MousePointer className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Clicks</p>
              <p className="text-2xl font-bold">{metricas.clicks}</p>
              <p className="text-xs text-gray-500">CTR: {metricas.ctr}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Ventas</p>
              <p className="text-2xl font-bold">{metricas.ventas}</p>
              <p className="text-xs text-gray-500">Conversiones confirmadas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inversión vs Ventas */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Inversión vs Ventas</h3>
          <p className="text-sm text-gray-600 mb-4">Comparación visual de tu inversión y las ventas generadas</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={inversionVsVentas}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
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
                <Tooltip 
                  formatter={(value: any) => [`$${value}`, '']}
                  labelStyle={{ color: '#333' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill={(entry: any) => entry.color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                >
                  {inversionVsVentas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Detalles de Rendimiento */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detalles de Rendimiento</h3>
          <p className="text-sm text-gray-600 mb-6">Métricas técnicas de tu campaña publicitaria</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Impresiones</span>
              </div>
              <span className="text-lg font-bold">{metricas.impresiones.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <MousePointer className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Clicks</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{metricas.clicks}</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${metricas.ctr * 10}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">CTR: {metricas.ctr}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium">Costo por Click</span>
              </div>
              <span className="text-lg font-bold">${metricas.cpc}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="font-medium">CPM</span>
              </div>
              <span className="text-lg font-bold">${metricas.cpm}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Rendimiento por día */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Rendimiento Diario</h3>
        <p className="text-sm text-gray-600 mb-4">Evolución de impresiones, clicks y ventas día a día</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={rendimientoDiario}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dia" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="impresiones" fill="#3b82f6" name="Impresiones" radius={[2, 2, 0, 0]} />
              <Bar dataKey="clicks" fill="#8b5cf6" name="Clicks" radius={[2, 2, 0, 0]} />
              <Bar dataKey="ventas" fill="#10b981" name="Ventas" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default CampaignDashboard;
