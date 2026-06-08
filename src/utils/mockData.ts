import type {
  ShelterUnit,
  EnvironmentData,
  DoorStatus,
  VentilationStatus,
  Material,
  PurchaseRequest,
  Person,
  EmergencyPlan,
  MaintenanceOrder,
  User,
  AlertMessage,
  DrillRecord,
  MaterialConsumption,
} from '@/types';

export const generateId = () => Math.random().toString(36).substring(2, 11);

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: '张明',
    role: '值班员',
    permissions: ['dashboard', 'shelter.view', 'personnel.view', 'alerts.handle'],
  },
  {
    id: 'u2',
    name: '李华',
    role: '站长',
    permissions: ['dashboard', 'shelter.manage', 'warehouse.view', 'purchase.approve1', 'drill.manage'],
  },
  {
    id: 'u3',
    name: '王强',
    role: '指挥长',
    permissions: ['dashboard', 'emergency.manage', 'plan.approve', 'route.adjust'],
  },
  {
    id: 'u4',
    name: '赵伟',
    role: '市人防办',
    permissions: ['*'],
  },
];

export const mockShelterUnits: ShelterUnit[] = [
  {
    id: 's1',
    name: '1号防护单元（地下停车场）',
    type: 'parking',
    position: { x: -15, y: 0, z: -10 },
    size: { width: 20, height: 4, depth: 15 },
    status: 'peacetime',
    capacity: 500,
    currentPopulation: 120,
    structuralHealth: 95,
    reinforcementRecords: [
      { id: 'r1', date: '2025-03-15', description: '主体结构加固', operator: '李工', result: '合格' },
      { id: 'r2', date: '2024-09-20', description: '墙体渗漏修复', operator: '张工', result: '合格' },
    ],
  },
  {
    id: 's2',
    name: '2号防护单元（地下商场）',
    type: 'mall',
    position: { x: 15, y: 0, z: -10 },
    size: { width: 25, height: 5, depth: 18 },
    status: 'peacetime',
    capacity: 800,
    currentPopulation: 350,
    structuralHealth: 88,
    reinforcementRecords: [
      { id: 'r3', date: '2025-01-10', description: '柱体碳纤维加固', operator: '王工', result: '合格' },
    ],
  },
  {
    id: 's3',
    name: '3号防护单元（人员掩蔽区）',
    type: 'shelter',
    position: { x: 0, y: 0, z: 15 },
    size: { width: 30, height: 4.5, depth: 20 },
    status: 'peacetime',
    capacity: 1200,
    currentPopulation: 80,
    structuralHealth: 98,
    reinforcementRecords: [
      { id: 'r4', date: '2025-05-01', description: '防爆门检修加固', operator: '赵工', result: '优秀' },
    ],
  },
];

export const generateEnvironmentData = (shelterId: string): EnvironmentData => ({
  id: generateId(),
  shelterId,
  oxygen: 19.5 + Math.random() * 2,
  co2: 0.3 + Math.random() * 1.2,
  temperature: 18 + Math.random() * 8,
  humidity: 40 + Math.random() * 30,
  timestamp: Date.now(),
});

export const mockDoors: DoorStatus[] = [
  { id: 'd1', shelterId: 's1', name: '1号防护门', position: { x: -25, y: 0, z: -10 }, isOpen: false, isFault: false, isLocked: false, lastMaintenance: '2026-05-01' },
  { id: 'd2', shelterId: 's1', name: '2号防护门', position: { x: -5, y: 0, z: -17.5 }, isOpen: true, isFault: false, isLocked: false, lastMaintenance: '2026-05-10' },
  { id: 'd3', shelterId: 's2', name: '3号防护门', position: { x: 27.5, y: 0, z: -10 }, isOpen: false, isFault: true, isLocked: true, lastMaintenance: '2026-04-15' },
  { id: 'd4', shelterId: 's2', name: '4号防护门', position: { x: 5, y: 0, z: -19 }, isOpen: false, isFault: false, isLocked: false, lastMaintenance: '2026-05-20' },
  { id: 'd5', shelterId: 's3', name: '5号防护门', position: { x: -15, y: 0, z: 25 }, isOpen: false, isFault: false, isLocked: false, lastMaintenance: '2026-05-25' },
  { id: 'd6', shelterId: 's3', name: '6号防护门', position: { x: 15, y: 0, z: 25 }, isOpen: false, isFault: false, isLocked: false, lastMaintenance: '2026-05-25' },
];

export const mockVentilation: VentilationStatus[] = [
  { id: 'v1', shelterId: 's1', isRunning: true, fanSpeed: 60, isFilterMode: false },
  { id: 'v2', shelterId: 's2', isRunning: true, fanSpeed: 100, isFilterMode: true },
  { id: 'v3', shelterId: 's3', isRunning: true, fanSpeed: 40, isFilterMode: false },
];

export const mockMaterials: Material[] = [
  { id: 'm1', type: 'food', name: '压缩饼干', quantity: 500, unit: '箱', dailyConsumption: 80, expiryDate: '2027-06-01', warehouseId: 'w1' },
  { id: 'm2', type: 'food', name: '军用罐头', quantity: 300, unit: '箱', dailyConsumption: 50, expiryDate: '2028-03-15', warehouseId: 'w1' },
  { id: 'm3', type: 'water', name: '瓶装饮用水', quantity: 1200, unit: '箱', dailyConsumption: 200, expiryDate: '2027-01-20', warehouseId: 'w1' },
  { id: 'm4', type: 'water', name: '桶装纯净水', quantity: 200, unit: '桶', dailyConsumption: 30, expiryDate: '2026-12-01', warehouseId: 'w1' },
  { id: 'm5', type: 'medicine', name: '急救包', quantity: 150, unit: '个', dailyConsumption: 2, expiryDate: '2027-08-10', warehouseId: 'w1' },
  { id: 'm6', type: 'medicine', name: '抗生素', quantity: 50, unit: '盒', dailyConsumption: 1, expiryDate: '2026-08-15', warehouseId: 'w1' },
  { id: 'm7', type: 'food', name: '方便面', quantity: 30, unit: '箱', dailyConsumption: 40, expiryDate: '2026-07-01', warehouseId: 'w1' },
];

export const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr1',
    materials: [{ materialId: 'm7', quantity: 100, name: '方便面' }],
    applicant: '李华',
    currentLevel: 1,
    status: 'pending',
    approvalRecords: [{ level: 1, approver: '', status: 'pending', date: '' }],
    createdAt: '2026-06-05',
  },
];

const names = ['陈刚', '刘芳', '周明', '吴丽', '郑浩', '孙艳', '马超', '朱婷', '胡军', '林静'];
const roles = ['群众', '工作人员', '安保人员', '医护人员'];

export const generatePersonnel = (): Person[] => {
  return names.map((name, i) => ({
    id: `p${i + 1}`,
    name,
    role: roles[i % roles.length],
    position: {
      x: -20 + Math.random() * 40,
      y: 0,
      z: -15 + Math.random() * 35,
    },
    status: i === 5 ? 'alert' : 'normal',
    isInUnprotectedZone: i === 5,
    entryTime: `2026-06-07 0${8 + (i % 3)}:${10 + i * 5}:00`,
    shelterId: i < 5 ? 's1' : i < 8 ? 's2' : 's3',
  }));
};

export const mockPersonnel = generatePersonnel();

export const mockEmergencyPlan: EmergencyPlan = {
  id: 'plan1',
  alertLevel: 'yellow',
  paths: [
    {
      id: 'path1',
      color: 'yellow',
      points: [
        { x: -30, y: 0, z: -20 },
        { x: -20, y: 0, z: -15 },
        { x: -10, y: 0, z: -5 },
        { x: 0, y: 0, z: 5 },
        { x: 0, y: 0, z: 15 },
      ],
      fromArea: '西入口',
      toShelter: '3号防护单元',
      estimatedTime: 5,
    },
    {
      id: 'path2',
      color: 'yellow',
      points: [
        { x: 30, y: 0, z: -20 },
        { x: 20, y: 0, z: -15 },
        { x: 10, y: 0, z: -5 },
        { x: 0, y: 0, z: 5 },
        { x: 0, y: 0, z: 15 },
      ],
      fromArea: '东入口',
      toShelter: '3号防护单元',
      estimatedTime: 6,
    },
  ],
  isApproved: false,
  createdAt: '2026-06-07 10:30:00',
};

export const mockMaintenanceOrders: MaintenanceOrder[] = [
  {
    id: 'mo1',
    deviceId: 'd3',
    deviceName: '3号防护门',
    issue: '液压系统故障，门无法正常开闭',
    status: 'processing',
    assignee: '维修组-王师傅',
    createdAt: '2026-06-07 09:15:00',
  },
];

export const generateAlerts = (): AlertMessage[] => [
  {
    id: 'a1',
    type: 'co2',
    level: 'danger',
    title: 'CO₂浓度超标',
    message: '2号防护单元CO₂浓度达到1.8%，已自动启动滤毒通风系统',
    timestamp: Date.now() - 300000,
    isRead: false,
  },
  {
    id: 'a2',
    type: 'material',
    level: 'warning',
    title: '物资库存预警',
    message: '方便面库存不足7天用量，请及时补充',
    timestamp: Date.now() - 1800000,
    isRead: false,
  },
  {
    id: 'a3',
    type: 'door',
    level: 'danger',
    title: '防护门故障',
    message: '3号防护门液压系统故障，已自动锁定并派发维修工单',
    timestamp: Date.now() - 3600000,
    isRead: true,
  },
  {
    id: 'a4',
    type: 'personnel',
    level: 'warning',
    title: '人员越界警告',
    message: '人员「孙艳」进入未防护区域，请及时引导',
    timestamp: Date.now() - 600000,
    isRead: false,
  },
];

export const mockDrillRecords: DrillRecord[] = [
  { id: 'dr1', date: '2026-05-15', name: '春季防空演练', participants: 500, duration: 120, result: '优秀', notes: '各部门配合良好，掩蔽及时' },
  { id: 'dr2', date: '2026-04-10', name: '消防应急演练', participants: 300, duration: 90, result: '良好', notes: '需加强物资调度效率' },
  { id: 'dr3', date: '2026-03-20', name: '医疗救援演练', participants: 150, duration: 60, result: '优秀', notes: '医护人员反应迅速' },
];

export const mockMaterialConsumptions: MaterialConsumption[] = [
  { id: 'mc1', materialId: 'm1', materialName: '压缩饼干', type: 'food', quantity: 50, date: '2026-05-15', purpose: '演练消耗' },
  { id: 'mc2', materialId: 'm3', materialName: '瓶装饮用水', type: 'water', quantity: 100, date: '2026-05-15', purpose: '演练消耗' },
  { id: 'mc3', materialId: 'm5', materialName: '急救包', type: 'medicine', quantity: 5, date: '2026-04-10', purpose: '演练使用' },
  { id: 'mc4', materialId: 'm1', materialName: '压缩饼干', type: 'food', quantity: 30, date: '2026-04-10', purpose: '演练消耗' },
  { id: 'mc5', materialId: 'm3', materialName: '瓶装饮用水', type: 'water', quantity: 80, date: '2026-03-20', purpose: '日常补给' },
];
