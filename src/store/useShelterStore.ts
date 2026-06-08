import { create } from 'zustand';
import type { ShelterUnit, EnvironmentData, DoorStatus, VentilationStatus, AlertMessage } from '@/types';
import { mockShelterUnits, mockDoors, mockVentilation, generateEnvironmentData, generateAlerts } from '@/utils/mockData';

export type SelectedObjectType = 'shelter' | 'door' | 'warehouse' | 'personnel' | null;

interface ShelterState {
  units: ShelterUnit[];
  selectedUnitId: string | null;
  selectedObjectType: SelectedObjectType;
  environmentData: EnvironmentData[];
  doorStatus: DoorStatus[];
  ventilationStatus: VentilationStatus[];
  alerts: AlertMessage[];
  environmentHistory: Record<string, EnvironmentData[]>;
  selectUnit: (id: string | null) => void;
  selectObject: (type: SelectedObjectType, id: string | null) => void;
  updateEnvironment: () => void;
  toggleDoor: (doorId: string) => void;
  toggleVentilation: (shelterId: string) => void;
  toggleShelterStatus: (shelterId: string) => void;
  markAlertRead: (alertId: string) => void;
  addAlert: (alert: Omit<AlertMessage, 'id' | 'timestamp'>) => void;
}

export const useShelterStore = create<ShelterState>((set, get) => ({
  units: mockShelterUnits,
  selectedUnitId: null,
  selectedObjectType: null,
  environmentData: mockShelterUnits.map((u) => generateEnvironmentData(u.id)),
  doorStatus: mockDoors,
  ventilationStatus: mockVentilation,
  alerts: generateAlerts(),
  environmentHistory: {},

  selectUnit: (id) => set({ selectedUnitId: id, selectedObjectType: id ? 'shelter' : null }),

  selectObject: (type, id) => set({ selectedObjectType: type, selectedUnitId: id }),

  updateEnvironment: () => {
    const { units, environmentHistory } = get();
    const newData = units.map((u) => generateEnvironmentData(u.id));

    const newHistory = { ...environmentHistory };
    newData.forEach((data) => {
      if (!newHistory[data.shelterId]) {
        newHistory[data.shelterId] = [];
      }
      newHistory[data.shelterId] = [...newHistory[data.shelterId].slice(-20), data];
    });

    newData.forEach((data) => {
      if (data.co2 > 1.5) {
        const existingAlert = get().alerts.find(
          (a) => a.type === 'co2' && a.message.includes(data.shelterId) && !a.isRead
        );
        if (!existingAlert) {
          get().addAlert({
            type: 'co2',
            level: 'danger',
            title: 'CO₂浓度超标',
            message: `${units.find((u) => u.id === data.shelterId)?.name} CO₂浓度达到${data.co2.toFixed(1)}%，已自动启动滤毒通风`,
            isRead: false,
          });
        }
        const vent = get().ventilationStatus.find((v) => v.shelterId === data.shelterId);
        if (vent && !vent.isFilterMode) {
          set((state) => ({
            ventilationStatus: state.ventilationStatus.map((v) =>
              v.shelterId === data.shelterId ? { ...v, isRunning: true, isFilterMode: true, fanSpeed: 100 } : v
            ),
          }));
        }
      }
    });

    set({ environmentData: newData, environmentHistory: newHistory });
  },

  toggleDoor: (doorId: string) => {
    set((state) => {
      const door = state.doorStatus.find((d) => d.id === doorId);
      if (door?.isFault) {
        get().addAlert({
          type: 'door',
          level: 'warning',
          title: '防护门操作失败',
          message: `${door.name}存在故障，已被锁定，请先维修`,
          isRead: false,
        });
        return state;
      }
      return {
        doorStatus: state.doorStatus.map((d) =>
          d.id === doorId ? { ...d, isOpen: !d.isOpen } : d
        ),
      };
    });
  },

  toggleVentilation: (shelterId: string) => {
    set((state) => ({
      ventilationStatus: state.ventilationStatus.map((v) =>
        v.shelterId === shelterId ? { ...v, isRunning: !v.isRunning } : v
      ),
    }));
  },

  toggleShelterStatus: (shelterId: string) => {
    set((state) => ({
      units: state.units.map((u) =>
        u.id === shelterId
          ? { ...u, status: u.status === 'peacetime' ? 'wartime' : 'peacetime' }
          : u
      ),
    }));
  },

  markAlertRead: (alertId: string) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)),
    }));
  },

  addAlert: (alert) => {
    const newAlert = {
      ...alert,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
    };
    set((state) => ({
      alerts: [newAlert, ...state.alerts].slice(0, 50),
    }));
  },
}));
