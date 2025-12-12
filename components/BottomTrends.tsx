import React from 'react';
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Video, Search } from 'lucide-react';

const trendData = [
  { time: '08:00', '普外科': 90, '骨科': 85, '泌尿外科': 80 },
  { time: '09:00', '普外科': 92, '骨科': 88, '泌尿外科': 78 },
  { time: '10:00', '普外科': 95, '骨科': 82, '泌尿外科': 85 },
  { time: '11:00', '普外科': 88, '骨科': 90, '泌尿外科': 89 },
  { time: '12:00', '普外科': 85, '骨科': 95, '泌尿外科': 92 },
  { time: '13:00', '普外科': 91, '骨科': 92, '泌尿外科': 88 },
  { time: '14:00', '普外科': 94, '骨科': 88, '泌尿外科': 86 },
];

const radarData = [
  { step: '掌心相对揉搓', A: 98, fullMark: 100 },
  { step: '手心手背互搓', A: 85, fullMark: 100 },
  { step: '手指交叉揉搓', A: 92, fullMark: 100 },
  { step: '指关节揉搓', A: 78, fullMark: 100 },
  { step: '大拇指揉搓', A: 88, fullMark: 100 },
  { step: '五指并拢揉搓', A: 75, fullMark: 100 },
  { step: '旋转揉搓至上臂', A: 65, fullMark: 100 },
];

export const BottomTrends: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 h-96">
      {/* Trend Line */}
      <div className="md:col-span-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide">正确率趋势对比</h3>
            <div className="flex space-x-4">
                 <div className="flex items-center text-xs text-slate-500">
                    <span className="w-3 h-1 bg-blue-500 rounded-full mr-1"></span> 普外科
                 </div>
                 <div className="flex items-center text-xs text-slate-500">
                    <span className="w-3 h-1 bg-emerald-500 rounded-full mr-1"></span> 骨科
                 </div>
                 <div className="flex items-center text-xs text-slate-500">
                    <span className="w-3 h-1 bg-purple-500 rounded-full mr-1"></span> 泌尿外科
                 </div>
            </div>
        </div>
        <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                {/* Updated YAxis domain to start from 70 */}
                <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="普外科" stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="骨科" stroke="#10b981" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="泌尿外科" stroke="#a855f7" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart & Traceability */}
      <div className="md:col-span-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col">
         <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide mb-2">洗手步骤完成率 (七步法)</h3>
         <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="step" tick={{fontSize: 10, fill: '#64748b'}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="完成率" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
            
            <div className="absolute bottom-0 right-0">
                 <button className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg flex items-center shadow-lg hover:bg-slate-800 transition-colors">
                    <Video size={14} className="mr-2" />
                    查看回放
                </button>
            </div>
         </div>
         
         {/* Search/Traceability Input */}
         <div className="mt-4 pt-4 border-t border-slate-50">
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="按人员搜索查看视频回放..." 
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                />
            </div>
         </div>
      </div>
    </div>
  );
};