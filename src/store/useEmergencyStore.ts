import { create } from 'zustand';
import type { AlertLevel, EmergencyPlan, MaintenanceOrder, ShelterPath, PathPoint } from '@/types';
import { mockEmergencyPlan, mockMaintenanceOrders, generateId } from '@/utils/mockData';

interface EmergencyState {
  alertLevel: AlertLevel;
  currentPlan: EmergencyPlan | null;
  maintenanceOrders: MaintenanceOrder[];
  setAlertLevel: (level: AlertLevel) => void;
  generateShelterPlan: (level: AlertLevel) => EmergencyPlan;
  approvePlan: (planId: string, approver: string) => void;
  executePlan: (planId: string) => void;
  createMaintenanceOrder: (deviceId: string, deviceName: string, issue: string) => void;
  updateMaintenanceStatus: (orderId: string, status: 'pending' | 'processing' | 'completed') => void;
}

const generatePaths = (level: AlertLevel): ShelterPath[] => {
  const basePaths: Record<AlertLevel, PathPoint[][]> = {
    green: [[{ x: -20, y: 0, z: -10 }, { x: -10, y: 0, z: 0 }, { x: 0, y: 0, z: 10 }]],
    blue: [
      [{ x: -30, y: 0, z: -20 }, { x: -20, y: 0, z: -10 }, { x: -10, y: 0, z: 0 }, { x: 0, y: 0, z: 15 }],
      [{ x: 30, y: 0, z: -20 }, { x: 20, y: 0, z: -10 }, { x: 10, y: 0, z: 0 }, { x: 0, y: 0, z: 15 }],
    ],
    yellow: [
      [{ x: -35, y: 0, z: -25 }, { x: -25, y: 0, z: -15 }, { x: -15, y: 0, z: -5 }, { x: 0, y: 0, z: 15 }],
      [{ x: 35, y: 0, z: -25 }, { x: 25, y: 0, z: -15 }, { x: 15, y: 0, z: -5 }, { x: 0, y: 0, z: 15 }],
      [{ x: 0, y: 0, z: -30 }, { x: 0, y: 0, z: -15 }, { x: 0, y: 0, z: 15 }],
    ],
    red: [
      [{ x: -35, y: 0, z: -25 }, { x: -25, y: 0, z: -15 }, { x: -15, y: 0, z: -5 }, { x: 0, y: 0, z: 15 }],
      [{ x: 35, y: 0, z: -25 }, { x: 25, y: 0, z: -15 }, { x: 15, y: 0, z: -5 }, { x: 0, y: 0, z: 15 }],
      [{ x: 0, y: 0, z: -30 }, { x: 0, y: 0, z: -15 }, { x: 0, y: 0, z: 15 }],
      [{ x: -25, y: 0, z: 25 }, { x: -15, y: 0, z: 20 }, { x: 0, y: 0, z: 15 }],
      [{ x: 25, y: 0, z: 25 }, { x: 15, y: 0, z: 20 }, { x: 0, y: 0, z: 15 }],
    ],
  };

  return basePaths[level].map((points, i) => ({
    id: `path-${i}`,
    color: level,
    points,
    fromArea: `入口${i + 1}`,
    toShelter: '3号防护单元',
    estimatedTime: 5 + i * 2,
  }));
};

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  alertLevel: 'green',
  currentPlan: null,
  maintenanceOrders: mockMaintenanceOrders,

  setAlertLevel: (level) => {
    set({ alertLevel: level });
    if (level !== 'green') {
      const plan = get().generateShelterPlan(level);
      set({ currentPlan: plan });
    } else {
      set({ currentPlan: null });
    }
  },

  generateShelterPlan: (level) => {
    return {
      id: generateId(),
      alertLevel: level,
      paths: generatePaths(level),
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
