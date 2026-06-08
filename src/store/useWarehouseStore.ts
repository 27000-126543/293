import { create } from 'zustand';
import type { Material, PurchaseRequest, MaterialConsumption, DrillRecord, RestockRecord } from '@/types';
import { mockMaterials, mockPurchaseRequests, mockMaterialConsumptions, mockDrillRecords, generateId } from '@/utils/mockData';

interface WarehouseState {
  materials: Material[];
  purchaseRequests: PurchaseRequest[];
  materialConsumptions: MaterialConsumption[];
  drillRecords: DrillRecord[];
  lowStockMaterials: string[];
  restockRecords: RestockRecord[];
  createPurchaseRequest: (materialItems: { materialId: string; quantity: number }[]) => void;
  approvePurchase: (requestId: string, level: number, comment?: string) => void;
  rejectPurchase: (requestId: string, level: number, comment: string) => void;
  checkStock: () => void;
}

const roleLevelMap: Record<number, string> = {
  1: '街道人防办',
  2: '区人防办',
  3: '市人防办',
};

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
  materials: mockMaterials,
  purchaseRequests: mockPurchaseRequests,
  materialConsumptions: mockMaterialConsumptions,
  drillRecords: mockDrillRecords,
  lowStockMaterials: mockMaterials
    .filter((m) => m.quantity / m.dailyConsumption < 7)
    .map((m) => m.id),
  restockRecords: [],

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
        { level: 1, approver: '', status: 'pending', date: '', comment: '' },
        { level: 2, approver: '', status: 'pending', date: '', comment: '' },
        { level: 3, approver: '', status: 'pending', date: '', comment: '' },
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

      if (request.currentLevel !== level) return state;

      const now = new Date().toLocaleString('zh-CN');
      const approverTitle = roleLevelMap[level] || '审批人';

      const updatedRecords = request.approvalRecords.map((r) =>
        r.level === level
          ? { ...r, approver: `${approverTitle}审批人`, status: 'approved' as const, comment: comment || '', date: now }
          : r
      );

      const nextLevel = level + 1;
      const isFinalApproved = level === 3;

      let updatedMaterials = state.materials;
      let updatedRestockRecords = state.restockRecords;

      if (isFinalApproved) {
        updatedMaterials = state.materials.map((m) => {
          const purchasedItem = request.materials.find((item) => item.materialId === m.id);
          if (purchasedItem) {
            return { ...m, quantity: m.quantity + purchasedItem.quantity };
          }
          return m;
        });

        updatedRestockRecords = [
          ...request.materials.map((item) => ({
            id: generateId(),
            materialId: item.materialId,
            materialName: item.name,
            quantity: item.quantity,
            date: new Date().toISOString().split('T')[0],
            source: `采购申请 #${requestId.slice(-6).toUpperCase()}`,
          })),
          ...state.restockRecords,
        ];
      }

      const lowStock = updatedMaterials
        .filter((m) => m.quantity / m.dailyConsumption < 7)
        .map((m) => m.id);

      return {
        purchaseRequests: state.purchaseRequests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                currentLevel: isFinalApproved ? 3 : nextLevel,
                status: isFinalApproved ? 'approved' : 'pending',
                approvalRecords: updatedRecords,
              }
            : r
        ),
        materials: updatedMaterials,
        restockRecords: updatedRestockRecords,
        lowStockMaterials: lowStock,
      };
    });
  },

  rejectPurchase: (requestId, level, comment) => {
    set((state) => {
      const request = state.purchaseRequests.find((r) => r.id === requestId);
      if (!request || request.currentLevel !== level) return state;

      const now = new Date().toLocaleString('zh-CN');
      const approverTitle = roleLevelMap[level] || '审批人';

      return {
        purchaseRequests: state.purchaseRequests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: 'rejected',
                approvalRecords: r.approvalRecords.map((rec) =>
                  rec.level === level
                    ? { ...rec, approver: `${approverTitle}审批人`, status: 'rejected' as const, comment, date: now }
                    : rec
                ),
              }
            : r
        ),
      };
    });
  },

  checkStock: () => {
    const { materials } = get();
    const lowStock = materials
      .filter((m) => m.quantity / m.dailyConsumption < 7)
      .map((m) => m.id);
    set({ lowStockMaterials: lowStock });
  },
}));
