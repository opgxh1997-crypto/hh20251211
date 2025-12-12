import React, { useState } from 'react';
import { Download, Search, Filter, Calendar, ChevronLeft, ChevronRight, ArrowUpDown, X, PlayCircle, Image as ImageIcon, AlertTriangle, Clock, ShieldAlert, Film, FileImage } from 'lucide-react';
import { Role } from '../types';

// Mock data for the report
const generateReportData = () => {
  const depts = ["普外科", "骨科", "泌尿外科", "神经外科", "胸外科", "肝胆外科"];
  const roles = Object.values(Role);
  const names = ["张", "李", "王", "赵", "刘", "陈", "杨", "黄", "周", "吴"];
  const givenNames = ["志远", "晓雯", "建国", "雅芝", "志坚", "伟", "芳", "敏", "杰", "强"];

  // Changed length from 25 to 10
  return Array.from({ length: 10 }, (_, i) => {
    const dept = depts[i % depts.length];
    const role = roles[i % roles.length];
    const name = names[i % names.length] + givenNames[i % givenNames.length];
    const totalWashes = 20 + Math.floor(Math.random() * 80);
    const complianceRate = 60 + Math.floor(Math.random() * 40);
    
    let mainIssue = '-';
    if (complianceRate < 80) {
        const issues = ['时长不足', '步骤缺失', '手部有配饰'];
        mainIssue = issues[Math.floor(Math.random() * issues.length)];
    }

    return {
      id: i,
      name,
      dept,
      role,
      totalWashes,
      validWashes: Math.floor(totalWashes * (complianceRate / 100)),
      complianceRate,
      avgDuration: 20 + Math.floor(Math.random() * 40),
      mainIssue,
    };
  });
};

const reportData = generateReportData();

// Mock media data for the modal with real image placeholders
const mockMediaList = [
    { 
        id: 1, 
        type: 'video', 
        date: '2023-10-27 10:42', 
        issue: '洗手时长不足', 
        duration: '00:24',
    },
    { 
        id: 2, 
        type: 'image', 
        date: '2023-10-26 15:30', 
        issue: '手部有配饰', 
        duration: '-',
    },
    { 
        id: 3, 
        type: 'video', 
        date: '2023-10-25 09:15', 
        issue: '步骤缺失', 
        duration: '00:45',
    },
    { 
        id: 4, 
        type: 'video', 
        date: '2023-10-24 11:20', 
        issue: '洗手时长不足', 
        duration: '00:18',
    },
];

export const StatisticalReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeMediaId, setActiveMediaId] = useState<number>(1);
  
  const handleOpenDetail = (item: any) => {
      setSelectedItem(item);
      setActiveMediaId(1); // Reset to first media item
  };

  const activeMedia = mockMediaList.find(m => m.id === activeMediaId) || mockMediaList[0];

  return (
    <div className="flex flex-col gap-4 h-full relative">
      {/* Filters & Controls Bar - Consolidated Layout */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
        {/* Date Filter */}
        <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <Calendar size={16} className="text-slate-400 mr-2" />
            <span className="text-sm text-slate-600">2023-10-27 ~ 2023-10-27</span>
        </div>
        
        {/* Department Filter */}
        <div className="relative">
            <select className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none hover:bg-slate-100 cursor-pointer">
                <option>全院科室</option>
                <option>普外科</option>
                <option>骨科</option>
                <option>泌尿外科</option>
                <option>神经外科</option>
                <option>胸外科</option>
            </select>
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Role Filter */}
        <div className="relative">
            <select className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none hover:bg-slate-100 cursor-pointer">
                <option>所有角色</option>
                <option>医生</option>
                <option>护士</option>
                <option>医辅人员</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>

        {/* Search - Shortened Width */}
        <div className="relative w-56">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="搜索人员姓名..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Flexible Spacer */}
        <div className="flex-1"></div>

        {/* Export Button - Moved to same line */}
        <button className="flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap">
            <Download size={16} className="mr-2" />
            导出 Excel
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th scope="col" className="px-6 py-3 font-semibold">姓名</th>
                        <th scope="col" className="px-6 py-3 font-semibold">科室</th>
                        <th scope="col" className="px-6 py-3 font-semibold">角色</th>
                        <th scope="col" className="px-6 py-3 font-semibold text-center">
                            <div className="flex items-center justify-center cursor-pointer hover:text-slate-700">
                                洗手总数 <ArrowUpDown size={12} className="ml-1" />
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold text-center">规范次数</th>
                        <th scope="col" className="px-6 py-3 font-semibold text-center">
                             <div className="flex items-center justify-center cursor-pointer hover:text-slate-700">
                                正确率 <ArrowUpDown size={12} className="ml-1" />
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 font-semibold text-center">平均时长(秒)</th>
                        <th scope="col" className="px-6 py-3 font-semibold">主要问题</th>
                        <th scope="col" className="px-6 py-3 font-semibold text-right">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((row) => (
                        <tr key={row.id} className="bg-white border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{row.name}</td>
                            <td className="px-6 py-4">{row.dept}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded bg-slate-100 text-xs text-slate-600">{row.role}</span>
                            </td>
                            <td className="px-6 py-4 text-center">{row.totalWashes}</td>
                            <td className="px-6 py-4 text-center">{row.validWashes}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    row.complianceRate >= 90 ? 'bg-emerald-100 text-emerald-700' :
                                    row.complianceRate >= 80 ? 'bg-blue-100 text-blue-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {row.complianceRate}%
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">{row.avgDuration}s</td>
                            <td className="px-6 py-4">
                                {row.mainIssue !== '-' ? (
                                    <span className="text-xs text-red-500 flex items-center">
                                        {row.mainIssue}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400">-</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => handleOpenDetail(row)}
                                    className="font-medium text-blue-600 hover:underline hover:text-blue-800"
                                >
                                    详情
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-700">
                        显示第 <span className="font-medium">1</span> 到 <span className="font-medium">10</span> 条，共 <span className="font-medium">10</span> 条
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                            <span className="sr-only">Previous</span>
                            <ChevronLeft size={16} aria-hidden="true" />
                        </button>
                        <button aria-current="page" className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">1</button>
                        <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                            <span className="sr-only">Next</span>
                            <ChevronRight size={16} aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                             <ShieldAlert className="text-blue-600 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{selectedItem.name} - 手卫生详情档案</h3>
                            <p className="text-xs text-slate-500">{selectedItem.dept} | {selectedItem.role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full p-1 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* 1. Summary Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-500 mb-1">洗手总数</div>
                            <div className="text-2xl font-bold text-slate-800">{selectedItem.totalWashes}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-500 mb-1">规范次数</div>
                            <div className="text-2xl font-bold text-emerald-600">{selectedItem.validWashes}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-500 mb-1">正确率</div>
                            <div className={`text-2xl font-bold ${selectedItem.complianceRate >= 80 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {selectedItem.complianceRate}%
                            </div>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-500 mb-1">主要问题</div>
                            <div className="text-lg font-bold text-slate-700 flex items-center h-8">
                                {selectedItem.mainIssue !== '-' ? (
                                    <span className="text-red-500 text-sm bg-red-50 px-2 py-1 rounded border border-red-100">
                                        {selectedItem.mainIssue}
                                    </span>
                                ) : '无'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 2. Alert History (Left Column) */}
                        <div className="flex flex-col">
                             <h4 className="font-bold text-slate-800 mb-3 flex items-center text-sm">
                                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                近7日问题类型统计
                            </h4>
                            <div className="border border-slate-200 rounded-lg overflow-hidden flex-1">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold">问题类型</th>
                                            <th className="px-4 py-2 text-center font-semibold">频次</th>
                                            <th className="px-4 py-2 font-semibold">严重程度</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {/* Mock dynamic history based on main issue */}
                                        <tr>
                                            <td className="px-4 py-2 text-slate-700">{selectedItem.mainIssue !== '-' ? selectedItem.mainIssue : '时长不足'}</td>
                                            <td className="px-4 py-2 text-center font-medium">12</td>
                                            <td className="px-4 py-2"><span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">严重</span></td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-slate-700">步骤缺失</td>
                                            <td className="px-4 py-2 text-center font-medium">4</td>
                                            <td className="px-4 py-2"><span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200">中度</span></td>
                                        </tr>
                                         <tr>
                                            <td className="px-4 py-2 text-slate-700">手部有配饰</td>
                                            <td className="px-4 py-2 text-center font-medium">1</td>
                                            <td className="px-4 py-2"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">轻微</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. Keyframe Snapshots (Right Column) */}
                        <div>
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center text-sm">
                                <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                                关键帧抓拍 (最近)
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="group relative rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100 cursor-pointer">
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-200 group-hover:bg-slate-300 transition-colors">
                                            <ImageIcon size={24} />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] p-2 pt-4">
                                            <span>2023-10-27 10:42:{10+i}</span>
                                        </div>
                                         <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                                            不规范
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. Behavior Records (Video/Media) - Improved Layout */}
                    <div className="border-t border-slate-100 pt-6">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                            <Film className="w-5 h-5 mr-2 text-blue-500" />
                            不规范行为记录
                        </h4>
                        
                        <div className="flex flex-col md:flex-row gap-4 h-[320px]">
                            {/* Left: Playlist / List */}
                            <div className="w-full md:w-1/3 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex flex-col">
                                <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    记录列表 ({mockMediaList.length})
                                </div>
                                <div className="overflow-y-auto flex-1">
                                    {mockMediaList.map((item) => (
                                        <div 
                                            key={item.id}
                                            onClick={() => setActiveMediaId(item.id)}
                                            className={`p-3 border-b border-slate-100 cursor-pointer transition-colors flex items-start gap-3 hover:bg-white ${activeMediaId === item.id ? 'bg-white border-l-4 border-l-blue-500 shadow-sm' : 'border-l-4 border-l-transparent'}`}
                                        >
                                            <div className="w-16 h-12 bg-slate-200 rounded shrink-0 flex items-center justify-center text-slate-400">
                                                {item.type === 'video' ? <Film size={16} /> : <FileImage size={16} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-slate-800 truncate">{item.issue}</div>
                                                <div className="text-xs text-slate-500 mt-1 flex justify-between">
                                                    <span>{item.date}</span>
                                                    {item.duration !== '-' && <span>{item.duration}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Player / Preview */}
                            <div className="w-full md:w-2/3 bg-black rounded-lg overflow-hidden relative group shadow-md flex flex-col">
                                <div className="flex-1 relative bg-slate-900 flex items-center justify-center">
                                    {/* Placeholder Content */}
                                    <div className="text-center text-white/80">
                                        {activeMedia.type === 'video' ? (
                                            <>
                                                <PlayCircle size={56} className="mx-auto mb-3 opacity-80 group-hover:scale-110 transition-transform cursor-pointer hover:text-blue-400" />
                                                <p className="text-sm font-medium">播放视频</p>
                                            </>
                                        ) : (
                                            <>
                                                 <ImageIcon size={56} className="mx-auto mb-3 opacity-50" />
                                                 <p className="text-sm font-medium">查看高清抓拍</p>
                                            </>
                                        )}
                                    </div>
                                    
                                    {/* Overlay Info */}
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm border border-white/10">
                                        <div className="font-medium text-red-400 flex items-center">
                                            <AlertTriangle size={14} className="mr-1.5" />
                                            {activeMedia.issue}
                                        </div>
                                        <div className="text-xs text-slate-300 mt-0.5">{activeMedia.date}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                
                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};