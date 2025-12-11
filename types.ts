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
  issueType: '未洗手' | '时长不足' | '步骤缺失';
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