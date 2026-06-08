import { create } from 'zustand';
import type { AlertLevel, EmergencyPlan, MaintenanceOrder, ShelterPath, PathPoint, DoorStatus } from '@/types';
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

const entryDoorMap: Record<string, string> = {
  s1w: 'd1', s1e: 'd2', s2w: 'd4', s2e: 'd3', s3w: 'd5', s3e: 'd6',
};

const shelterAltEntries: Record<string, string[]> = {
  s1: ['s1w', 's1e'],
  s2: ['s2e', 's2w'],
  s3: ['s3w', 's3e'],
};

const generatePaths = (level: AlertLevel, faultyDoors: DoorStatus[]): { paths: ShelterPath[]; notes: string[] } => {
  const notes: string[] = [];
  const pathCount: Record<AlertLevel, number> = { green: 1, blue: 2, yellow: 3, red: 5 };
  const count = pathCount[level];
  const faultyDoorIds = new Set(faultyDoors.map((d) => d.id));

  const targetKeys = level === 'green'
    ? ['s3w']
    : level === 'blue'
    ? ['s1e', 's2e']
    : level === 'yellow'
    ? ['s1e', 's2e', 's3w']
    : ['s1w', 's1e', 's2e', 's3w', 's3e'];

  const paths: ShelterPath[] = [];

  for (let i = 0; i < Math.min(count, entryPoints.length); i++) {
    const start = entryPoints[i];
    const originalKey = targetKeys[i % targetKeys.length];
    const originalEntry = shelterEntries[originalKey];
    const doorId = entryDoorMap[originalKey];
    const isDoorFaulty = faultyDoorIds.has(doorId);

    let finalKey = originalKey;
    let finalEntry = originalEntry;
    let detoured = false;
    let faultyDoorName = '';

    if (isDoorFaulty) {
      const faultyDoor = faultyDoors.find((d) => d.id === doorId);
      faultyDoorName = faultyDoor?.name || '故障防护门';
      const shelterPrefix = originalKey.substring(0, 2);
      const alts = shelterAltEntries[shelterPrefix] || [];
      const altKey = alts.find((a) => a !== originalKey && !faultyDoorIds.has(entryDoorMap[a]));

      if (altKey) {
        finalKey = altKey;
        finalEntry = shelterEntries[altKey];
        notes.push(
          `路径${i + 1}原定经${originalEntry.label}进入，因${faultyDoorName}故障已改道至${finalEntry.label}，预计增加2-3分钟疏散时间`
        );
      } else {
        notes.push(
          `路径${i + 1}目标${originalEntry.label}附近${faultyDoorName}故障，路线已绕行避让，预计增加3-5分钟疏散时间`
        );
      }
      detoured = true;
    }

    const midX = (start.x + finalEntry.pos.x) / 2;
    const midZ = (start.z + finalEntry.pos.z) / 2;

    let waypoints: PathPoint[];

    if (detoured) {
      const faultyDoor = faultyDoors.find((d) => d.id === doorId);
      if (faultyDoor) {
        const dp = faultyDoor.position;
        const detourZ = dp.z > 0 ? dp.z - 15 : dp.z + 15;
        waypoints = [
          start,
          { x: (start.x + dp.x) / 2, y: 0, z: start.z + (detourZ - start.z) * 0.4 },
          { x: dp.x + (dp.x > 0 ? -8 : 8), y: 0, z: detourZ },
          { x: (dp.x + finalEntry.pos.x) / 2, y: 0, z: detourZ + (finalEntry.pos.z - detourZ) * 0.5 },
          finalEntry.pos,
        ];
      } else {
        waypoints = [
          start,
          { x: midX, y: 0, z: start.z + (finalEntry.pos.z - start.z) * 0.3 },
          { x: midX, y: 0, z: midZ },
          finalEntry.pos,
        ];
      }
    } else {
      waypoints = [
        start,
        { x: midX, y: 0, z: start.z + (finalEntry.pos.z - start.z) * 0.3 },
        { x: midX, y: 0, z: midZ },
        finalEntry.pos,
      ];
    }

    paths.push({
      id: `path-${level}-${i}`,
      color: level,
      points: waypoints,
      fromArea: `入口${i + 1}`,
      toShelter: detoured ? `${finalEntry.label}（绕行）` : finalEntry.label,
      estimatedTime: 3 + i * 2 + (detoured ? 3 : 0),
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
    const faultyDoors = doors.filter((d) => d.isFault);

    const { paths, notes } = generatePaths(level, faultyDoors);
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
