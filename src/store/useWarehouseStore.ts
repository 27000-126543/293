import { create } from 'zustand';
import type { Material, PurchaseRequest, MaterialConsumption, DrillRecord } from '@/types';
import { mockMaterials, mockPurchaseRequests, mockMaterialConsumptions, mockDrillRecords, generateId } from '@/utils/mockData';

interface WarehouseState {
  materials: Material[];
  purchaseRequests: PurchaseRequest[];
  materialConsumptions: MaterialConsumption[];
  drillRecords: DrillRecord[];
  lowStockMaterials: string[];
  createPurchaseRequest: (materialItems: { materialId: string; quantity: number }[]) => void;
  approvePurchase: (requestId: string, level: number, comment?: string) => void;
  rejectPurchase: (requestId: string, level: number, comment: string) => void;
  checkStock: () => void;
}

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
  materials: mockMaterials,
  purchaseRequests: mockPurchaseRequests,
  materialConsumptions: mockMaterialConsumptions,
  drillRecords: mockDrillRecords,
  lowStockMaterials: mockMaterials
    .filter((m) => m.quantity / m.dailyConsumption < 7)
    .map((m) => m.id),

  createPurchaseRequest: (materialItems) => {
    const { materials } = get();
    const items = materialItems.map((item) => {
      const material = materials.find((m) => m.id === item.materialId);
      return {
        materialId: item.materialId,
        quantity: item.quantity,
        name: material?.name || '',
      };
    });

    const newRequest: PurchaseRequest = {
      id: generateId(),
      materials: items,
      applicant: '系统自动',
      currentLevel: 1,
      status: 'pending',
      approvalRecords: [
        { level: 1, approver: '', status: 'pending', date: '' },
        { level: 2, approver: '', status: 'pending', date: '' },
        { level: 3, approver: '', status: 'pending', date: '' },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      purchaseRequests: [newRequest, ...state.purchaseRequests],
    }));
  },

  approvePurchase: (requestId, level, comment) => {
    set((state) => {
      const request = state.purchaseRequests.find((r) => r.id === requestId);
      if (!request) return state;

      const updatedRecords = request.approvalRecords.map((r) =>
        r.level === level
          ? { ...r, approver: '当前用户', status: 'approved' as const, comment, date: new Date().toISOString().split('T')[0] }
          : r
      );

      const newLevel = level + 1;
      const isFinalApproved = level === 3;

      return {
        purchaseRequests: state.purchaseRequests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                currentLevel: isFinalApproved ? 3 : newLevel,
                status: isFinalApproved ? 'approved' : 'pending',
                approvalRecords: updatedRecords,
              }
            : r
        ),
      };
    });
  },

  rejectPurchase: (requestId, level, comment) => {
    set((state) => ({
      purchaseRequests: state.purchaseRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              approvalRecords: r.approvalRecords.map((rec) =>
                rec.level === level
                  ? { ...rec, approver: '当前用户', status: 'rejected' as const, comment, date: new Date().toISOString().split('T')[0] }
                  : rec
              ),
            }
          : r
      ),
    }));
  },

  checkStock: () => {
    const { materials } = get();
    const lowStock = materials
      .filter((m) => m.quantity / m.dailyConsumption < 7)
      .map((m) => m.id);
    set({ lowStockMaterials: lowStock });
  },
}));
