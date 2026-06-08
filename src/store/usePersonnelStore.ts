import { create } from 'zustand';
import type { Person } from '@/types';
import { mockPersonnel, generateId } from '@/utils/mockData';

interface PersonnelState {
  personnel: Person[];
  trackedPersonnel: string[];
  updatePositions: () => void;
  toggleTrack: (personId: string) => void;
  checkUnprotectedZones: () => string[];
}

const unprotectedZones = [
  { x: -30, z: -25, width: 10, depth: 10 },
  { x: 25, z: -25, width: 10, depth: 10 },
];

const isInUnprotectedZone = (x: number, z: number): boolean => {
  return unprotectedZones.some(
    (zone) =>
      x >= zone.x &&
      x <= zone.x + zone.width &&
      z >= zone.z &&
      z <= zone.z + zone.depth
  );
};

export const usePersonnelStore = create<PersonnelState>((set, get) => ({
  personnel: mockPersonnel,
  trackedPersonnel: [],

  updatePositions: () => {
    set((state) => ({
      personnel: state.personnel.map((p) => {
        const newX = p.position.x + (Math.random() - 0.5) * 2;
        const newZ = p.position.z + (Math.random() - 0.5) * 2;
        const inUnprotected = isInUnprotectedZone(newX, newZ);

        return {
          ...p,
          position: {
            x: Math.max(-35, Math.min(35, newX)),
            y: 0,
            z: Math.max(-30, Math.min(30, newZ)),
          },
          isInUnprotectedZone: inUnprotected,
          status: inUnprotected ? 'alert' : 'normal',
        };
      }),
    }));
  },

  toggleTrack: (personId) => {
    set((state) => {
      const isTracked = state.trackedPersonnel.includes(personId);
      return {
        trackedPersonnel: isTracked
          ? state.trackedPersonnel.filter((id) => id !== personId)
          : [...state.trackedPersonnel, personId],
      };
    });
  },

  checkUnprotectedZones: () => {
    const { personnel } = get();
    return personnel
      .filter((p) => p.isInUnprotectedZone)
      .map((p) => p.id);
  },
}));
