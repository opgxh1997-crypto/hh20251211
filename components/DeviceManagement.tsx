import React, { useState } from 'react';
import { 
  Server, Search, Filter, Plus, Upload, MoreHorizontal, 
  CheckCircle, XCircle, AlertTriangle, Monitor, Wifi, 
  HardDrive, Camera, Activity, History, ChevronRight, 
  ArrowLeft, Settings, Power, Video, FileText, ChevronDown, ChevronUp, MapPin, X, CloudUpload, Image as ImageIcon
} from 'lucide-react';
import { Device, DeviceStatus, OperatingRoom, WashRecord } from '../types';

// --- Mock Data Generation ---

const generateMockData = () => {
  const rooms: OperatingRoom[] = Array.from({ length: 8 }, (_, i) => ({
    id: `room-${i + 1}`,
    name: `手术间${i + 1}`,
  }));

  const devices: Device[] = [
    { id: 'SSJ-001', name: '术间1入口镜', roomId: 'room-1', status: DeviceStatus.ONLINE, location: '患者入口左侧', type: '智能洗手镜V2', sn: 'SN20240320001', installDate: '2024-03-20', lastActive: '2分钟前', network: 'Wi-Fi (信号强)', storageUsed: 85, storageTotal: 128, cameraStatus: 'normal', aiStatus: 'normal' },
    { id: 'SSJ-002', name: '术间1洗手台镜', roomId: 'room-1', status: DeviceStatus.ONLINE, location: '洗手台正上方', type: '智能洗手镜V2', sn: 'SN20240320002', installDate: '2024-03-20', lastActive: '5分钟前', network: 'Wi-Fi (信号强)', storageUsed: 42, storageTotal: 128, cameraStatus: 'normal', aiStatus: 'normal' },
    { id: 'SSJ-003', name: '术间1备用镜', roomId: 'room-1', status: DeviceStatus.OFFLINE, location: '器械台旁', type: '智能洗手镜V1', sn: 'SN20231105011', installDate: '2023-11-05', lastActive: '3天前', network: '离线', storageUsed: 110, storageTotal: 128, cameraStatus: 'normal', aiStatus: 'fault' },
    { id: 'SSJ-004', name: '术间2主镜', roomId: 'room-2', status: DeviceStatus.ONLINE, location: '医生入口处', type: '智能洗手镜V2', sn: 'SN20240321005', installDate: '2024-03-21', lastActive: '刚刚', network: 'LAN', storageUsed: 20, storageTotal: 128, cameraStatus: 'normal', aiStatus: 'normal' },
    { id: 'SSJ-005', name: '术间2洗手镜', roomId: 'room-2', status: DeviceStatus.ONLINE, location: '洗手池上方', type: '智能洗手镜V2', sn: 'SN20240321006', installDate: '2024-03-21', lastActive: '10分钟前', network: 'Wi-Fi', storageUsed: 55, storageTotal: 128, cameraStatus: 'normal', aiStatus: 'normal' },
    { id: 'SSJ-006', name: '术间3主镜', roomId: 'room-3', status: DeviceStatus.FAULT, location: '术间入口', type: '智能洗手镜V2', sn: 'SN20240115088', installDate: '2024-01-15', lastActive: '1小时前', network: 'Wi-Fi', storageUsed: 90, storageTotal: 128, cameraStatus: 'fault', aiStatus: 'normal' },
    { id: 'SSJ-007', name: '未匹配设备', roomId: 'unmatched', status: DeviceStatus.ONLINE, location: '-', type: '智能洗手镜V2', sn: 'SN20240401999', installDate: '-', lastActive: '刚刚', network: 'Wi-Fi', storageUsed: 1, storageTotal: 128, cameraStatus: 'normal', aiStatus: 'normal' },
  ];
  
  // Fill remaining rooms with some dummy data
  for(let i=4; i<=8; i++) {
      if(Math.random() > 0.5) {
        devices.push({
            id: `SSJ-0${i}1`, name: `术间${i}主镜`, roomId: `room-${i}`, status: DeviceStatus.ONLINE, location: '入口处', type: '智能洗手镜V2', sn: `SN20240${i}001`, installDate: '2024-02-01', lastActive: '30分钟前', network: 'Wi-Fi', storageUsed: 30, storageTotal: 128, cameraStatus: 'normal', aiStatus: 'normal'
        })
      }
  }

  const generateRecords = (deviceId: string): WashRecord[] => {
    return Array.from({ length: 15 }, (_, i) => {
        const isCompliant = Math.random() > 0.3;
        return {
            id: `REC-${deviceId}-${i}`,
            deviceId,
            timestamp: `10:${59 - i}:23`,
            personName: ['张医生', '李护士', '王医生', '实习生刘', '麻醉师周'][i % 5],
            role: ['医生', '护士', '医生', '实习生', '麻醉师'][i % 5],
            duration: 20 + Math.floor(Math.random() * 40),
            isCompliant,
            alertReason: isCompliant ? undefined : ['时间不足', '步骤缺失', '未用洗手液'][Math.floor(Math.random() * 3)]
        };
    });
  };

  return { rooms, devices, generateRecords };
};

const { rooms, devices: initialDevices, generateRecords } = generateMockData();

// --- Components ---

const StatusBadge = ({ status }: { status: DeviceStatus }) => {
  switch (status) {
    case DeviceStatus.ONLINE:
      return <span className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>在线</span>;
    case DeviceStatus.OFFLINE:
      return <span className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>离线</span>;
    case DeviceStatus.FAULT:
      return <span className="flex items-center text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>故障</span>;
  }
};

const DeviceIcon = ({ status }: { status: DeviceStatus }) => {
    switch (status) {
      case DeviceStatus.ONLINE: return <Monitor size={14} className="text-emerald-500" />;
      case DeviceStatus.OFFLINE: return <Monitor size={14} className="text-slate-400" />;
      case DeviceStatus.FAULT: return <Monitor size={14} className="text-red-500" />;
    }
  };

export const DeviceManagement: React.FC = () => {
  const [activeRoomId, setActiveRoomId] = useState<string | 'all'>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'records'>('list');
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal States
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMatchOpen, setIsMatchOpen] = useState(false);

  // Computed Data
  const filteredDevices = activeRoomId === 'all' 
    ? initialDevices 
    : initialDevices.filter(d => d.roomId === activeRoomId);

  const selectedDevice = initialDevices.find(d => d.id === selectedDeviceId);
  const records = selectedDevice ? generateRecords(selectedDevice.id) : [];

  // Handlers
  const toggleRoom = (roomId: string) => {
    setExpandedRooms(prev => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const handleRoomClick = (roomId: string | 'all') => {
    setActiveRoomId(roomId);
    setSelectedDeviceId(null);
    setCurrentView('list');
    setSelectedIds(new Set()); // Reset selection on room change
  };

  const handleDeviceClick = (deviceId: string) => {
    const device = initialDevices.find(d => d.id === deviceId);
    if (device) {
        if (device.roomId !== 'unmatched') {
            setActiveRoomId(device.roomId);
            if (!expandedRooms[device.roomId]) {
                toggleRoom(device.roomId);
            }
        } else {
            setActiveRoomId('unmatched');
        }
        setSelectedDeviceId(deviceId);
        setCurrentView('detail');
    }
  };

  const handleViewRecords = () => setCurrentView('records');
  const handleBackToDetail = () => setCurrentView('detail');
  const handleBackToList = () => {
    setSelectedDeviceId(null);
    setCurrentView('list');
  };

  // Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
        setSelectedIds(new Set(filteredDevices.map(d => d.id)));
    } else {
        setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
      const newSelected = new Set(selectedIds);
      if (checked) {
          newSelected.add(id);
      } else {
          newSelected.delete(id);
      }
      setSelectedIds(newSelected);
  };

  // Action Handlers
  const openMatchModal = () => {
      if (selectedIds.size > 0) {
          setIsMatchOpen(true);
      } else {
          alert("请先选择至少一台设备");
      }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 gap-4 pb-4 relative">
      {/* --- Modals --- */}
      
      {/* 1. Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">批量导入设备</h3>
                    <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-slate-700">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                            <CloudUpload size={24} className="text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">点击或拖拽上传文件</p>
                        <p className="text-xs text-slate-500 mt-1">支持 .xlsx, .csv 格式 (最大 5MB)</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm">
                        <a href="#" className="text-blue-600 hover:underline flex items-center">
                            <FileText size={14} className="mr-1" /> 下载导入模版
                        </a>
                        <span className="text-slate-400">未选择文件</span>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end space-x-3">
                    <button onClick={() => setIsImportOpen(false)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">取消</button>
                    <button onClick={() => setIsImportOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm">开始导入</button>
                </div>
            </div>
        </div>
      )}

      {/* 2. Add Device Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">新增设备</h3>
                    <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-700">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">设备名称 <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="例如：术间1入口镜" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">设备类型</label>
                                <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                    <option>智能洗手镜V2</option>
                                    <option>智能洗手镜V1</option>
                                    <option>普通监测终端</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">序列号 (SN) <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="扫码或输入SN码" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">所属手术间</label>
                                <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                    <option value="">未匹配</option>
                                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">安装位置描述</label>
                                <textarea placeholder="例如：患者入口左侧，距地面1.2m" rows={4} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end space-x-3">
                    <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">取消</button>
                    <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm">确认添加</button>
                </div>
            </div>
        </div>
      )}

      {/* 3. Match Modal */}
      {isMatchOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">匹配设备到手术间</h3>
                    <button onClick={() => setIsMatchOpen(false)} className="text-slate-400 hover:text-slate-700">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start">
                        <Monitor size={16} className="text-blue-600 mt-0.5 mr-2" />
                        <div className="text-sm text-blue-800">
                            正在对 <span className="font-bold">{selectedIds.size}</span> 台设备进行位置匹配操作
                            <div className="text-xs text-blue-600/80 mt-1 truncate max-w-[350px]">
                                {Array.from(selectedIds).join(', ')}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">选择目标手术间</label>
                        <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option>请选择...</option>
                            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">安装位置描述</label>
                        <div className="flex gap-2 mb-2">
                             <button className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-200 transition-colors">洗手池上方</button>
                             <button className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-200 transition-colors">入口处</button>
                             <button className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded border border-slate-200 transition-colors">器械台旁</button>
                        </div>
                        <textarea placeholder="请输入具体的安装位置信息..." rows={3} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"></textarea>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">上传位置照片 (可选)</label>
                         <div className="border border-slate-300 border-dashed rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                            <ImageIcon size={18} className="text-slate-400 mr-2" />
                            <span className="text-sm text-slate-500">点击上传照片</span>
                         </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end space-x-3">
                    <button onClick={() => setIsMatchOpen(false)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium">取消</button>
                    <button onClick={() => { setIsMatchOpen(false); setSelectedIds(new Set()); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm">保存匹配</button>
                </div>
            </div>
        </div>
      )}


      {/* --- Left Sidebar (Navigation) --- */}
      <div className="w-64 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0 ml-4 lg:ml-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-800 flex items-center">
            <Server size={18} className="mr-2 text-blue-600" />
            手术室设备导航
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* All Rooms Node */}
          <div 
            onClick={() => handleRoomClick('all')}
            className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeRoomId === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <Server size={14} className="mr-2" />
            <span className="text-sm font-medium flex-1">全部手术间</span>
            <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">{initialDevices.length}</span>
          </div>

          {/* Room List Tree */}
          {rooms.map(room => {
            const roomDevices = initialDevices.filter(d => d.roomId === room.id);
            if (roomDevices.length === 0) return null;
            const isExpanded = expandedRooms[room.id];

            return (
              <div key={room.id}>
                <div 
                    className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors group ${activeRoomId === room.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                    onClick={() => handleRoomClick(room.id)}
                >
                    <div 
                        className="p-1 mr-1 hover:bg-black/5 rounded"
                        onClick={(e) => { e.stopPropagation(); toggleRoom(room.id); }}
                    >
                         {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </div>
                    <span className="text-sm font-medium flex-1">{room.name}</span>
                    <span className="text-xs text-slate-400 group-hover:text-slate-500">({roomDevices.length}台)</span>
                </div>
                
                {/* Nested Devices */}
                {isExpanded && (
                    <div className="ml-4 pl-3 border-l border-slate-200 space-y-1 mt-1 mb-1">
                        {roomDevices.map(device => (
                            <div 
                                key={device.id}
                                onClick={(e) => { e.stopPropagation(); handleDeviceClick(device.id); }}
                                className={`flex items-center px-3 py-1.5 rounded-md cursor-pointer text-xs ${selectedDeviceId === device.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <div className="mr-2"><DeviceIcon status={device.status} /></div>
                                <span className="truncate">{device.name}</span>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 space-y-1">
             <div className="flex justify-between items-center">
                 <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>在线</span>
                 <span className="font-mono font-medium">{initialDevices.filter(d => d.status === DeviceStatus.ONLINE).length}台</span>
             </div>
             <div className="flex justify-between items-center">
                 <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-400 mr-2"></div>离线</span>
                 <span className="font-mono font-medium">{initialDevices.filter(d => d.status === DeviceStatus.OFFLINE).length}台</span>
             </div>
             <div className="flex justify-between items-center">
                 <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>故障</span>
                 <span className="font-mono font-medium">{initialDevices.filter(d => d.status === DeviceStatus.FAULT).length}台</span>
             </div>
        </div>
      </div>

      {/* --- Right Content Area --- */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden mr-4 lg:mr-0">
        
        {/* VIEW 1: Device List & Matching */}
        {currentView === 'list' && (
            <>
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">设备管理 - {activeRoomId === 'all' ? '全部手术间' : rooms.find(r => r.id === activeRoomId)?.name || '未匹配'}</h2>
                        <p className="text-xs text-slate-500 mt-1">共 {filteredDevices.length} 台设备</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => setIsImportOpen(true)} className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                            <Upload size={14} className="mr-2" /> 批量导入
                        </button>
                        <button onClick={() => setIsAddOpen(true)} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-sm">
                            <Plus size={14} className="mr-2" /> 新增设备
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                            <select className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 appearance-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300">
                                <option>全部状态</option>
                                <option>在线</option>
                                <option>离线</option>
                                <option>故障</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative w-64">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="搜索设备ID/名称..." className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                         <button 
                            onClick={openMatchModal}
                            disabled={selectedIds.size === 0}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${selectedIds.size > 0 ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'text-slate-400 hover:bg-slate-100 cursor-not-allowed'}`}
                         >
                            <MapPin size={14} className="mr-1.5" /> 批量匹配 {selectedIds.size > 0 && `(${selectedIds.size})`}
                         </button>
                         <button className="flex items-center px-3 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm transition-colors">
                            <FileText size={14} className="mr-1.5" /> 导出列表
                         </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200 w-12">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-slate-300 focus:ring-blue-500 text-blue-600"
                                        checked={filteredDevices.length > 0 && selectedIds.size === filteredDevices.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">设备ID</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">设备名称</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">状态</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">所属术间</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">安装位置描述</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDevices.map(device => (
                                <tr 
                                    key={device.id} 
                                    className={`transition-colors cursor-pointer ${selectedIds.has(device.id) ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'}`}
                                    onClick={() => handleDeviceClick(device.id)}
                                >
                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-slate-300 focus:ring-blue-500 text-blue-600" 
                                            checked={selectedIds.has(device.id)}
                                            onChange={(e) => handleSelectOne(device.id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-mono text-slate-600">{device.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{device.name}</td>
                                    <td className="px-6 py-4"><StatusBadge status={device.status} /></td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {device.roomId === 'unmatched' 
                                            ? <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs border border-amber-100">未匹配</span> 
                                            : rooms.find(r => r.id === device.roomId)?.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{device.location}</td>
                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                        <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        {/* VIEW 2: Device Detail */}
        {currentView === 'detail' && selectedDevice && (
             <div className="flex flex-col h-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center space-x-4">
                        <button onClick={handleBackToList} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 flex items-center">
                                {selectedDevice.name}
                                <span className="ml-3"><StatusBadge status={selectedDevice.status} /></span>
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 font-mono">{selectedDevice.id} | {rooms.find(r => r.id === selectedDevice.roomId)?.name || '未匹配'}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                         <button className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600">
                            <Settings size={14} className="mr-2" /> 设备配置
                        </button>
                         <button className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100">
                            <Power size={14} className="mr-2" /> 重启设备
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Basic Info Card */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                                <Monitor size={16} className="mr-2 text-blue-500" /> 基本信息
                            </h3>
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div><span className="text-slate-500 block text-xs mb-1">设备类型</span><span className="font-medium text-slate-700">{selectedDevice.type}</span></div>
                                <div><span className="text-slate-500 block text-xs mb-1">序列号 (SN)</span><span className="font-medium text-slate-700 font-mono">{selectedDevice.sn}</span></div>
                                <div><span className="text-slate-500 block text-xs mb-1">安装日期</span><span className="font-medium text-slate-700">{selectedDevice.installDate}</span></div>
                                <div><span className="text-slate-500 block text-xs mb-1">安装位置</span><span className="font-medium text-slate-700">{selectedDevice.location}</span></div>
                                <div className="col-span-2 pt-2 border-t border-slate-100 mt-2">
                                     <button className="text-blue-600 text-xs font-medium hover:underline">修改匹配信息</button>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                                <Activity size={16} className="mr-2 text-emerald-500" /> 运行状态
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg flex items-start space-x-3">
                                    <Wifi size={18} className="text-blue-500 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-slate-500">网络连接</div>
                                        <div className="font-medium text-sm">{selectedDevice.network}</div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg flex items-start space-x-3">
                                    <HardDrive size={18} className="text-purple-500 mt-0.5" />
                                    <div className="w-full">
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>存储</span>
                                            <span>{selectedDevice.storageUsed}G/{selectedDevice.storageTotal}G</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div style={{ width: `${(selectedDevice.storageUsed/selectedDevice.storageTotal)*100}%`}} className="h-full bg-purple-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg flex items-start space-x-3">
                                    <Camera size={18} className={selectedDevice.cameraStatus === 'normal' ? 'text-emerald-500 mt-0.5' : 'text-red-500 mt-0.5'} />
                                    <div>
                                        <div className="text-xs text-slate-500">摄像头</div>
                                        <div className={`font-medium text-sm ${selectedDevice.cameraStatus === 'normal' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {selectedDevice.cameraStatus === 'normal' ? '正常工作' : '异常'}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg flex items-start space-x-3">
                                    <Activity size={18} className={selectedDevice.aiStatus === 'normal' ? 'text-indigo-500 mt-0.5' : 'text-red-500 mt-0.5'} />
                                    <div>
                                        <div className="text-xs text-slate-500">AI识别模块</div>
                                        <div className={`font-medium text-sm ${selectedDevice.aiStatus === 'normal' ? 'text-indigo-600' : 'text-red-600'}`}>
                                            {selectedDevice.aiStatus === 'normal' ? '运行中' : '故障'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Stats Bar */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">今日监测统计</h3>
                            <p className="text-slate-500 text-sm">最后更新: {selectedDevice.lastActive}</p>
                        </div>
                        <div className="flex space-x-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-800">124</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">总监测次数</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-600">87%</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">规范洗手率</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-amber-500">16</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">预警次数</div>
                            </div>
                        </div>
                        <button 
                            onClick={handleViewRecords}
                            className="bg-white text-blue-600 px-5 py-2.5 rounded-lg shadow-sm font-medium text-sm border border-blue-100 hover:bg-blue-50 transition-colors flex items-center"
                        >
                            <History size={16} className="mr-2" /> 查看洗手记录
                        </button>
                    </div>
                </div>
             </div>
        )}

        {/* VIEW 3: Records */}
        {currentView === 'records' && selectedDevice && (
            <div className="flex flex-col h-full">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center space-x-4 bg-slate-50/50">
                     <button onClick={handleBackToDetail} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">洗手记录</h2>
                        <p className="text-xs text-slate-500 mt-1 font-mono">设备: {selectedDevice.name} ({selectedDevice.id})</p>
                    </div>
                </div>

                <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between gap-4">
                     <div className="flex items-center space-x-3">
                         <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600">
                             <History size={14} className="mr-2 text-slate-400" />
                             今天 (2023-10-27)
                             <ChevronDown size={12} className="ml-2 text-slate-400" />
                         </div>
                         <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600">
                             人员: 全部
                             <ChevronDown size={12} className="ml-2 text-slate-400" />
                         </div>
                     </div>
                     <button className="text-blue-600 text-sm font-medium hover:underline flex items-center">
                        <FileText size={14} className="mr-1" /> 导出记录
                     </button>
                </div>

                <div className="flex-1 overflow-auto bg-white">
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">时间</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">人员</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">洗手时长</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">结果</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200">预警原因</th>
                                <th className="px-6 py-3 font-semibold border-b border-slate-200 text-right">证据</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {records.map(record => (
                                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-600">{record.timestamp}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{record.personName}</div>
                                        <div className="text-xs text-slate-500">{record.role}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">{record.duration}秒</td>
                                    <td className="px-6 py-4">
                                        {record.isCompliant ? (
                                            <span className="flex items-center text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-1 rounded w-fit">
                                                <CheckCircle size={12} className="mr-1" /> 规范
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-amber-600 font-medium text-xs bg-amber-50 px-2 py-1 rounded w-fit">
                                                <AlertTriangle size={12} className="mr-1" /> 预警
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {record.alertReason || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded transition-colors" title="查看回放">
                                            <Video size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
                    <div>共 {records.length} 条记录</div>
                    <div className="flex space-x-1">
                        <button className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50 disabled:opacity-50">上一页</button>
                        <button className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-50">下一页</button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};