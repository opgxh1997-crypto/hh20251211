import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowUp, ArrowDown, Activity, AlertTriangle, CheckCircle, Users } from 'lucide-react';

const COLORS = ['#10b981', '#e2e8f0']; // Green for success, Gray for background

// Generate data that fluctuates between 72 and 98 to show obvious variance on a 70-100 scale
const mockTrendData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: 72 + Math.random() * 26
}));

export const TopOverview: React.FC = () => {
  const overallRate = 87.5;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
      {/* Compliance Rate - Donut */}
      <div className="md:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">实时全院正确率</h3>
          <div className="text-3xl font-bold text-slate-800">{overallRate}%</div>
          <div className="text-xs text-emerald-600 flex items-center mt-1">
            <ArrowUp size={12} className="mr-1" />
            2.4% 较昨日
          </div>
        </div>
        <div className="h-20 w-20 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: overallRate }, { value: 100 - overallRate }]}
                innerRadius={25}
                outerRadius={35}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[1]} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Activity size={16} className="text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="md:col-span-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Card: Today's Total Persons */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider">今日洗手总人数</h3>
                    <div className="text-2xl font-bold mt-2">892</div>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Users size={18} className="text-indigo-500" />
                </div>
            </div>
            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[92%]"></div>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider">今日洗手总次数</h3>
                    <div className="text-2xl font-bold mt-2">12,450</div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Activity size={18} className="text-blue-500" />
                </div>
            </div>
            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4"></div>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider">规范次数</h3>
                    <div className="text-2xl font-bold mt-2 text-emerald-600">10,893</div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <CheckCircle size={18} className="text-emerald-500" />
                </div>
            </div>
             <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[87%]"></div>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider">预警次数</h3>
                    <div className="text-2xl font-bold mt-2 text-amber-600">1,557</div>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                    <AlertTriangle size={18} className="text-amber-500" />
                </div>
            </div>
             <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[12%]"></div>
            </div>
        </div>
      </div>

      {/* Mini Trend Line */}
      <div className="md:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <h3 className="text-slate-500 text-xs font-medium mb-1">近7天趋势</h3>
         <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    {/* Explicitly set domain to start from 70 for more obvious variance */}
                    <YAxis domain={[70, 100]} hide />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            </ResponsiveContainer>
         </div>
         <div className="text-xs text-slate-400 text-right mt-1">数据更新时间: 10:42</div>
      </div>
    </div>
  );
};