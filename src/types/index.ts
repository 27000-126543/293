export type UserRole = '值班员' | '站长' | '指挥长' | '市人防办';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  faceData?: string;
  permissions: string[];
}

export type ShelterStatus = 'peacetime' | 'wartime';

export interface ShelterUnit {
  id: string;
  name: string;
  type: 'parking' | 'mall' | 'shelter';
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  status: ShelterStatus;
  capacity: number;
  currentPopulation: number;
  structuralHealth: number;
  reinforcementRecords: ReinforcementRecord[];
}

export interface ReinforcementRecord {
  id: string;
  date: string;
  description: string;
  operator: string;
  result: string;
}

export interface EnvironmentData {
  id: string;
  shelterId: string;
  oxygen: number;
  co2: number;
  temperature: number;
  humidity: number;
  timestamp: number;
}

export interface DoorStatus {
  id: string;
  shelterId: string;
  name: string;
  position: { x: number; y: number; z: number };
  isOpen: boolean;
  isFault: boolean;
  isLocked: boolean;
  lastMaintenance: string;
}

export interface VentilationStatus {
  id: string;
  shelterId: string;
  isRunning: boolean;
  fanSpeed: number;
  isFilterMode: boolean;
}

export type MaterialType = 'food' | 'water' | 'medicine';

export interface Material {
  id: string;
  type: MaterialType;
  name: string;
  quantity: number;
  unit: string;
  dailyConsumption: number;
  expiryDate: string;
  warehouseId: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRecord {
  level: number;
  approver: string;
  status: ApprovalStatus;
  comment?: string;
  date: string;
}

export interface PurchaseRequest {
  id: string;
  materials: { materialId: string; quantity: number; name: string }[];
  applicant: string;
  currentLevel: number;
  status: ApprovalStatus;
  approvalRecords: ApprovalRecord[];
  createdAt: string;
}

export type PersonnelStatus = 'normal' | 'alert' | 'safe';

export interface Person {
  id: string;
  name: string;
  role: string;
  position: { x: number; y: number; z: number };
  status: PersonnelStatus;
  isInUnprotectedZone: boolean;
  entryTime: string;
  shelterId?: string;
}

export type AlertLevel = 'green' | 'blue' | 'yellow' | 'red';

export interface PathPoint {
  x: number;
  y: number;
  z: number;
}

export interface ShelterPath {
  id: string;
  color: AlertLevel;
  points: PathPoint[];
  fromArea: string;
  toShelter: string;
  estimatedTime: number;
}

export interface EmergencyPlan {
  id: string;
  alertLevel: AlertLevel;
  paths: ShelterPath[];
  isApproved: boolean;
  approver?: string;
  createdAt: string;
  executedAt?: string;
}

export interface MaintenanceOrder {
  id: string;
  deviceId: string;
  deviceName: string;
  issue: string;
  status: 'pending' | 'processing' | 'completed';
  assignee?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AlertMessage {
  id: string;
  type: 'co2' | 'door' | 'material' | 'personnel' | 'system';
  level: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

export interface DrillRecord {
  id: string;
  date: string;
  name: string;
  participants: number;
  duration: number;
  result: string;
  notes: string;
}

export interface MaterialConsumption {
  id: string;
  materialId: string;
  materialName: string;
  type: MaterialType;
  quantity: number;
  date: string;
  purpose: string;
}

export interface RestockRecord {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  date: string;
  source: string;
}
