import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Department } from '../types';

const deptData: Department[] = [
    { id: '1', name: '重症医学科(ICU)', complianceRate: 98, totalWashes: 3400, warningCount: 12 },
    { id: '2', name: '外科', complianceRate: 95, totalWashes: 2100, warningCount: 45 },
    { id: '3', name: '儿科', complianceRate: 88, totalWashes: 1200, warningCount: 89 },
    { id: '4', name: '内科', complianceRate: 82, totalWashes: 1800, warningCount: 130 },
    { id: '5', name: '急诊科', complianceRate: 76, totalWashes: 4500, warningCount: 420 },
    { id: '6', name: '神经科', complianceRate: 91, totalWashes: 900, warningCount: 30 },
];

// Sort for visual hierarchy
const sortedData = [...deptData].sort((a, b) => b.complianceRate - a.complianceRate);

// Heatmap Mock Data
const heatmapData = Array.from({ length: 6 }, (_, row) => 
    Array.from({ length: 8 }, (_, col) => ({
        id: `sink-${row}-${col}`,
        usage: Math.floor(Math.random() * 50),
        rate: 60 + Math.floor(Math.random() * 40)
    }))
);

const CustomBarLabel = (props: any) => {
    const { x, y, width, height, value, payload } = props;
    if (!payload) return null;

    return (
        <text 
            x={x + width + 8} 
            y={y + height / 2} 
            fill="#334155" 
            textAnchor="start" 
            dominantBaseline="middle" 
            fontSize={12}
            fontWeight={600}
        >
            {value}% <tspan fill="#94a3b8" fontSize={11} fontWeight={400}>({payload.totalWashes}次)</tspan>
        </text>
    );
};

export const CenterAnalysis: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Department Rankings */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 min-h-[300px]">
        <h3 className="text-slate-800 font-semibold mb-4 text-sm uppercase tracking-wide">科室依从率排行榜</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={sortedData}
            layout="vertical"
            // Increased right margin to accommodate text labels (120px)
            margin={{ top: 5, right: 120, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                width={100}
                axisLine={false}
                tickLine={false}
            />
            <Tooltip cursor={{fill: '#f8fafc'}} />
            <Bar 
                dataKey="complianceRate" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
                label={<CustomBarLabel />}
                isAnimationActive={true}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={
                        entry.complianceRate > 90 ? '#10b981' : 
                        entry.complianceRate > 80 ? '#3b82f6' : 
                        entry.complianceRate > 70 ? '#f59e0b' : '#ef4444'
                    } 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sink Location Heatmap */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
             <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide">洗手位置热力图</h3>
             <div className="flex space-x-2 text-xs text-slate-500">
                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-200 mr-1"></div>低</span>
                <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>高</span>
             </div>
        </div>
       
        <div className="flex flex-col gap-1">
            {heatmapData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 justify-center">
                    {row.map((sink) => (
                        <div 
                            key={sink.id}
                            className="group relative h-10 w-full rounded-md transition-all hover:scale-110 hover:z-10 cursor-pointer"
                            style={{
                                backgroundColor: `rgba(59, 130, 246, ${sink.usage / 50})`, // Blue opacity based on usage
                                border: sink.usage === 0 ? '1px solid #f1f5f9' : 'none'
                            }}
                        >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-32 p-2 bg-slate-800 text-white text-xs rounded shadow-lg pointer-events-none">
                                <div className="font-semibold">洗手池 {sink.id}</div>
                                <div>频次: {sink.usage}</div>
                                <div>依从率: {sink.rate}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
        <div className="mt-4 text-center text-xs text-slate-400">
            网格代表监测区域内的物理洗手池分布。
        </div>
      </div>
    </div>
  );
};