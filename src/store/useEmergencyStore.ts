import { create } from 'zustand';
import type { AlertLevel, EmergencyPlan, MaintenanceOrder, ShelterPath, PathPoint } from '@/types';
import { mockMaintenanceOrders, generateId } from '@/utils/mockData';
import { useShelterStore } from './useShelterStore';

interface EmergencyState {
  alertLevel: AlertLevel;
  currentPlan: EmergencyPlan | null;
  maintenanceOrders: MaintenanceOrder[];
  rerouteNotes: string[];
  setAlertLevel: (level: AlertLevel) => void;
  generateShelterPlan: (level: AlertLevel) => EmergencyPlan;
  approvePlan: (planId: string, approver: string) => void;
  executePlan: (planId: string) => void;
  createMaintenanceOrder: (deviceId: string, deviceName: string, issue: string) => void;
  updateMaintenanceStatus: (orderId: string, status: 'pending' | 'processing' | 'completed') => void;
}

const shelterEntries: Record<string, { label: string; pos: PathPoint }> = {
  s1w: { label: '1号单元西门', pos: { x: -25, y: 0, z: -10 } },
  s1e: { label: '1号单元东门', pos: { x: -5, y: 0, z: -10 } },
  s2w: { label: '2号单元西门', pos: { x: 5, y: 0, z: -10 } },
  s2e: { label: '2号单元东门', pos: { x: 27.5, y: 0, z: -10 } },
  s3w: { label: '3号单元西门', pos: { x: -15, y: 0, z: 25 } },
  s3e: { label: '3号单元东门', pos: { x: 15, y: 0, z: 25 } },
};

const entryPoints: PathPoint[] = [
  { x: -35, y: 0, z: -25 },
  { x: 35, y: 0, z: -25 },
  { x: 0, y: 0, z: -30 },
  { x: -25, y: 0, z: 25 },
  { x: 25, y: 0, z: 25 },
];

const isNearFaultyDoor = (point: PathPoint, faultyDoorPositions: PathPoint[]): boolean => {
  return faultyDoorPositions.some(
    (dp) => Math.abs(point.x - dp.x) < 5 && Math.abs(point.z - dp.z) < 5
  );
};

const generatePaths = (level: AlertLevel, faultyDoorPositions: PathPoint[]): { paths: ShelterPath[]; notes: string[] } => {
  const notes: string[] = [];
  const pathCount: Record<AlertLevel, number> = { green: 1, blue: 2, yellow: 3, red: 5 };
  const count = pathCount[level];

  const targetKeys = level === 'green'
    ? ['s3w']
    : level === 'blue'
    ? ['s1e', 's3w']
    : ['s1e', 's2w', 's3w'];

  const paths: ShelterPath[] = [];

  for (let i = 0; i < Math.min(count, entryPoints.length); i++) {
    const start = entryPoints[i];
    const target = shelterEntries[targetKeys[i % targetKeys.length]];
    const midX = (start.x + target.pos.x) / 2;
    const midZ = (start.z + target.pos.z) / 2;

    let waypoints: PathPoint[] = [
      start,
      { x: midX, y: 0, z: start.z + (target.pos.z - start.z) * 0.3 },
      { x: midX, y: 0, z: midZ },
      target.pos,
    ];

    const passesFaultyDoor = waypoints.some((wp) => isNearFaultyDoor(wp, faultyDoorPositions));

    if (passesFaultyDoor) {
      const detourZ = midZ > 0 ? midZ + 8 : midZ - 8;
      waypoints = [
        start,
        { x: start.x, y: 0, z: detourZ * 0.5 },
        { x: midX, y: 0, z: detourZ },
        { x: target.pos.x, y: 0, z: detourZ * 0.5 + target.pos.z * 0.5 },
        target.pos,
      ];

      const faultyDoorNames = faultyDoorPositions
        .map((dp) => {
          const doors = useShelterStore.getState().doorStatus;
          const found = doors.find((d) => Math.abs(d.position.x - dp.x) < 3 && Math.abs(d.position.z - dp.z) < 3);
          return found?.name || '故障防护门';
        })
        .filter(Boolean);

      notes.push(
        `路径${i + 1}（${target.label}方向）因${faultyDoorNames.join('、')}故障已自动绕行，预计增加2-3分钟疏散时间`
      );
    }

    paths.push({
      id: `path-${level}-${i}`,
      color: level,
      points: waypoints,
      fromArea: `入口${i + 1}`,
      toShelter: target.label,
      estimatedTime: 3 + i * 2 + (passesFaultyDoor ? 3 : 0),
    });
  }

  return { paths, notes };
};

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  alertLevel: 'green',
  currentPlan: null,
  maintenanceOrders: mockMaintenanceOrders,
  rerouteNotes: [],

  setAlertLevel: (level) => {
    if (level !== 'green') {
      const plan = get().generateShelterPlan(level);
      set({ alertLevel: level, currentPlan: plan });
    } else {
      set({ alertLevel: level, currentPlan: null, rerouteNotes: [] });
    }
  },

  generateShelterPlan: (level) => {
    const doors = useShelterStore.getState().doorStatus;
    const faultyDoorPositions = doors
      .filter((d) => d.isFault)
      .map((d) => d.position);

    const { paths, notes } = generatePaths(level, faultyDoorPositions);
    set({ rerouteNotes: notes });

    return {
      id: generateId(),
      alertLevel: level,
      paths,
      isApproved: false,
      createdAt: new Date().toISOString(),
    };
  },

  approvePlan: (planId, approver) => {
    set((state) => ({
      currentPlan: state.currentPlan?.id === planId
        ? { ...state.currentPlan, isApproved: true, approver }
        : state.currentPlan,
    }));
  },

  executePlan: (planId) => {
    set((state) => ({
      currentPlan: state.currentPlan?.id === planId
        ? { ...state.currentPlan, executedAt: new Date().toISOString() }
        : state.currentPlan,
    }));
  },

  createMaintenanceOrder: (deviceId, deviceName, issue) => {
    const newOrder: MaintenanceOrder = {
      id: generateId(),
      deviceId,
      deviceName,
      issue,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      maintenanceOrders: [newOrder, ...state.maintenanceOrders],
    }));
  },

  updateMaintenanceStatus: (orderId, status) => {
    set((state) => ({
      maintenanceOrders: state.maintenanceOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              completedAt: status === 'completed' ? new Date().toISOString() : undefined,
              assignee: status === 'processing' ? '维修组-王师傅' : o.assignee,
            }
          : o
      ),
    }));
  },
}));
