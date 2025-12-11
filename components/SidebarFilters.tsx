import React, { useState } from 'react';
import { Calendar, Filter, Users, Building2 } from 'lucide-react';
import { TimeRange, Role } from '../types';

export const SidebarFilters: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(TimeRange.TODAY);
  
  const depts = [
    "全院", "重症医学科 (ICU)", "外科", "儿科", "内科", "急诊科"
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center space-x-2 mb-6 text-slate-800">
        <Filter size={20} />
        <h2 className="font-semibold text-lg">多维筛选</h2>
      </div>

      {/* Time Range */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <Calendar size={14} className="mr-2" /> 时间范围
        </h3>
        <div className="space-y-2">
            {Object.values(TimeRange).map((range) => (
                <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedRange === range 
                        ? 'bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>
      </div>

      {/* Departments */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <Building2 size={14} className="mr-2" /> 科室/病区
        </h3>
        <div className="relative">
            <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 appearance-none">
                {depts.map(d => <option key={d}>{d}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
      </div>

      {/* Roles */}
      <div>
         <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <Users size={14} className="mr-2" /> 人员角色
        </h3>
        <div className="space-y-2">
            {Object.values(Role).map(role => (
                <label key={role} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{role}</span>
                </label>
            ))}
        </div>
      </div>
    </div>
  );
};