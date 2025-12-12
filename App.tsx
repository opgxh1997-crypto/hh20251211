import React, { useState } from 'react';
import { TopOverview } from './components/TopOverview';
import { SidebarFilters } from './components/SidebarFilters';
import { CenterAnalysis } from './components/CenterAnalysis';
import { RightAlerts } from './components/RightAlerts';
import { BottomTrends } from './components/BottomTrends';
import { StatisticalReport } from './components/StatisticalReport';
import { ShieldCheck, Bell, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'report'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Global Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
             <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">手卫生 <span className="text-blue-600">统计分析平台</span></h1>
            <p className="text-xs text-slate-500 font-medium">院感管理视图 (Infection Control)</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-500">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`transition-colors ${currentView === 'dashboard' ? 'text-blue-600 font-bold' : 'hover:text-slate-800'}`}
                >
                  仪表盘
                </button>
                <button 
                  onClick={() => setCurrentView('report')}
                  className={`transition-colors ${currentView === 'report' ? 'text-blue-600 font-bold' : 'hover:text-slate-800'}`}
                >
                  统计报表
                </button>
                <a href="#" className="hover:text-slate-800 transition-colors">设备管理</a>
                <a href="#" className="hover:text-slate-800 transition-colors">系统设置</a>
            </nav>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-4">
                <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                    <UserCircle size={24} className="text-slate-400" />
                    <div className="hidden lg:block text-right">
                        <div className="text-xs font-bold text-slate-700">管理员</div>
                        <div className="text-[10px] text-slate-400">院感科</div>
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        <div className="max-w-[1920px] mx-auto h-full flex flex-col">
            
            {currentView === 'dashboard' ? (
              <>
                {/* Top Stats */}
                <TopOverview />

                {/* Middle Section: Filters | Analysis | Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Filters */}
                    <div className="lg:col-span-2 hidden lg:block">
                        <SidebarFilters />
                    </div>
                    
                    {/* Center Main Analysis */}
                    <div className="lg:col-span-7 h-[600px] lg:h-auto">
                        <CenterAnalysis />
                    </div>
                    
                    {/* Right Alerts */}
                    <div className="lg:col-span-3 h-[600px] lg:h-auto">
                        <RightAlerts />
                    </div>
                </div>

                {/* Bottom Trends */}
                <BottomTrends />
              </>
            ) : (
              <StatisticalReport />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;