
export interface Metric {
  label: string;
  value: number | string;
  change?: number; // percentage change
  trend?: 'up' | 'down' | 'neutral';
  unit?: string;
}

export interface Department {
  id: string;
  name: string;
  complianceRate: number;
  totalWashes: number;
  warningCount: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  staffName: string;
  department: string;
  issueType: string; // Changed from union to string to support multiple issues
  severity: 'high' | 'medium' | 'low';
}

export interface WashStep {
  step: string; // e.g., "Palms", "Back of Hands"
  completionRate: number; // 0-100
}

export interface HeatmapData {
  zone: string;
  sinkId: string;
  count: number;
  compliance: number;
}

export enum TimeRange {
  TODAY = '今日',
  WEEK = '本周',
  MONTH = '本月',
  CUSTOM = '自定义',
}

export enum Role {
  DOCTOR = '医生',
  NURSE = '护士',
  MEDICAL_ASSISTANT = '医辅人员',
  OTHER = '其他'
}

// Device Management Types
export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  FAULT = 'fault'
}

export interface Device {
  id: string;
  name: string;
  roomId: string; // 'unmatched' for unmatched devices
  status: DeviceStatus;
  location: string;
  type: string;
  sn: string;
  ipAddress: string; // Added IP Address
  installDate: string;
  lastActive: string;
  network: string;
  // storage fields removed from individual device since it is unified, but keeping in type if needed for legacy or mock, 
  // will effectively ignore or repurpose if needed. 
  // However, prompts says "Unified storage", so I won't display per-device storage.
  cameraStatus: 'normal' | 'fault';
  aiStatus: 'normal' | 'fault';
}

export interface OperatingRoom {
  id: string;
  name: string;
}

export interface WashRecord {
  id: string;
  deviceId: string;
  timestamp: string;
  personName: string;
  role: string;
  duration: number; // seconds
  isCompliant: boolean;
  alertReason?: string;
}