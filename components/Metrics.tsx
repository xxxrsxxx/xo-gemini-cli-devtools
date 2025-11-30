
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { MetricPoint } from '../types';
import { monitor } from '../services/monitor';
import { useLanguage } from '../contexts/LanguageContext';

export const Metrics: React.FC = () => {
  const [data, setData] = useState<MetricPoint[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    return monitor.subscribeMetrics(setData);
  }, []);

  // Format timestamp for XAxis
  const formattedData = data.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded shadow-xl text-xs">
          <p className="text-gray-400 mb-2">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }} className="font-mono">
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto bg-[#0a0a0a]">
      {/* Latency Chart */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex flex-col h-[300px]">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          {t('metrics.latencyTitle')}
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="latency" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLatency)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Token Usage Chart */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex flex-col h-[300px]">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-purple-500"></span>
           {t('metrics.tokenTitle')}
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="tokens" 
                fill="#a855f7" 
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{t('metrics.totalRequests')}</p>
            <p className="text-2xl font-mono text-white mt-1">{data.length}</p>
         </div>
         <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{t('metrics.avgLatency')}</p>
            <p className="text-2xl font-mono text-blue-400 mt-1">
              {data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.latency, 0) / data.length) : 0}ms
            </p>
         </div>
         <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{t('metrics.totalTokens')}</p>
            <p className="text-2xl font-mono text-purple-400 mt-1">
              {data.reduce((acc, curr) => acc + curr.tokens, 0).toLocaleString()}
            </p>
         </div>
         <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{t('metrics.lastModel')}</p>
            <p className="text-lg font-mono text-green-400 mt-1 truncate">
              {data.length > 0 ? data[data.length - 1].model : '-'}
            </p>
         </div>
      </div>
    </div>
  );
};
