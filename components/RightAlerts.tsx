import React from 'react';
import { AlertCircle, Clock, User, ArrowRight } from 'lucide-react';
import { Alert } from '../types';

const alerts: Alert[] = [
    { id: '1', timestamp: '10:41 AM', staffName: '张志远', department: '普外科', issueType: '手部有配饰', severity: 'high' },
    { id: '2', timestamp: '10:38 AM', staffName: '李晓雯', department: '胸外科', issueType: '时长不足', severity: 'medium' },
    { id: '3', timestamp: '10:35 AM', staffName: '王建国', department: '泌尿外科', issueType: '步骤缺失', severity: 'medium' },
    { id: '4', timestamp: '10:30 AM', staffName: '赵雅芝', department: '骨科', issueType: '手部有配饰', severity: 'high' },
    { id: '5', timestamp: '10:15 AM', staffName: '刘志坚', department: '肝胆外科', issueType: '手部有配饰', severity: 'low' },
];

const problemDepts = [
    { name: '胸外科', issue: '洗手时长不足', rate: '76%' },
    { name: '神经外科', issue: '洗手时长不足', rate: '82%' },
    { name: '泌尿外科', issue: '步骤缺失', rate: '88%' },
];

export const RightAlerts: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Real-time Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-red-50/50">
            <h3 className="text-red-700 font-semibold text-sm flex items-center">
                <div className="relative mr-2">
                    <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <AlertCircle size={16} />
                </div>
                实时预警 (30分钟内)
            </h3>
            <span className="text-xs bg-white text-red-600 px-2 py-0.5 rounded-full border border-red-100 shadow-sm">{alerts.length} 条新预警</span>
        </div>
        
        <div className="overflow-y-auto p-2 space-y-2 flex-1 max-h-[400px]">
            {alerts.map(alert => (
                <div key={alert.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-red-200 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-700' : 
                            alert.severity === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {alert.issueType}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center">
                            <Clock size={10} className="mr-1" /> {alert.timestamp}
                        </span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-slate-700 mt-2">
                        <User size={14} className="mr-2 text-slate-400" /> {alert.staffName}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 pl-6">
                        {alert.department}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Top Problem Areas */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-slate-800 font-semibold mb-4 text-sm">TOP问题科室</h3>
        <div className="space-y-3">
            {problemDepts.map((dept, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                        <div className="font-semibold text-sm text-slate-700">{dept.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{dept.issue}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-red-500">{dept.rate}</div>
                        <div className="text-[10px] text-slate-400 uppercase">依从率</div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};