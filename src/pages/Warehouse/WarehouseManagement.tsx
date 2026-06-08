import { useState } from 'react';
import { Package, AlertTriangle, Check, X, Clock, User, Truck } from 'lucide-react';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { useAuthStore } from '@/store/useAuthStore';

const WarehouseManagement = () => {
  const { materials, purchaseRequests, lowStockMaterials, restockRecords, approvePurchase, rejectPurchase } = useWarehouseStore();
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'stock' | 'purchase' | 'restock'>('stock');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const getDaysRemaining = (material: typeof materials[0]) => {
    return Math.floor(material.quantity / material.dailyConsumption);
  };

  const getApprovalLevelForRole = () => {
    switch (currentUser?.role) {
      case '站长': return 1;
      case '指挥长': return 2;
      case '市人防办': return 3;
      default: return 0;
    }
  };

  const userApprovalLevel = getApprovalLevelForRole();

  const materialRestockMap: Record<string, typeof restockRecords> = {};
  restockRecords.forEach((r) => {
    if (!materialRestockMap[r.materialId]) materialRestockMap[r.materialId] = [];
    materialRestockMap[r.materialId].push(r);
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'stock'
              ? 'bg-tech-500/20 text-tech-300 border border-tech-400'
              : 'bg-military-800 text-gray-400 hover:bg-military-700'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          库存管理
        </button>
        <button
          onClick={() => setActiveTab('purchase')}
          className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
            activeTab === 'purchase'
              ? 'bg-tech-500/20 text-tech-300 border border-tech-400'
              : 'bg-military-800 text-gray-400 hover:bg-military-700'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          采购审批
          {purchaseRequests.filter((r) => r.status === 'pending').length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-alert-red text-white text-xs rounded-full flex items-center justify-center">
              {purchaseRequests.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('restock')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'restock'
              ? 'bg-tech-500/20 text-tech-300 border border-tech-400'
              : 'bg-military-800 text-gray-400 hover:bg-military-700'
          }`}
        >
          <Truck className="w-4 h-4 inline mr-2" />
          补货记录
        </button>
      </div>

      {activeTab === 'stock' ? (
        <div className="grid grid-cols-3 gap-6">
          {materials.map((material) => {
            const daysRemaining = getDaysRemaining(material);
            const isLowStock = lowStockMaterials.includes(material.id);
            const isExpiringSoon = new Date(material.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            const restocks = materialRestockMap[material.id] || [];

            return (
              <div
                key={material.id}
                className={`data-card transition-all ${
                  isLowStock ? 'border-alert-orange/50 animate-pulse' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-gray-200">
                      {material.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {material.type === 'food' ? '食品' : material.type === 'water' ? '水' : '药品'}
                    </p>
                  </div>
                  {isLowStock && (
                    <span className="px-2 py-1 bg-alert-orange/20 text-alert-orange text-xs font-bold rounded animate-blink">
                      库存不足
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-display font-bold text-tech-400">
                      {material.quantity}
                      <span className="text-sm text-gray-500 ml-1">{material.unit}</span>
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        isLowStock ? 'text-alert-orange' : daysRemaining < 14 ? 'text-alert-yellow' : 'text-alert-green'
                      }`}
                    >
                      可用 {daysRemaining} 天
                    </span>
                  </div>
                  <div className="h-2 bg-military-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isLowStock
                          ? 'bg-alert-orange'
                          : daysRemaining < 14
                          ? 'bg-alert-yellow'
                          : 'bg-alert-green'
                      }`}
                      style={{ width: `${Math.min(100, (material.quantity / (material.dailyConsumption * 30)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">日消耗量</p>
                    <p className="font-medium text-gray-300">
                      {material.dailyConsumption} {material.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">有效期至</p>
                    <p className={`font-medium ${isExpiringSoon ? 'text-alert-orange' : 'text-gray-300'}`}>
                      {material.expiryDate}
                    </p>
                  </div>
                </div>

                {restocks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-tech-500/20">
                    <p className="text-xs text-gray-500 mb-1">近期补货</p>
                    {restocks.slice(0, 2).map((r) => (
                      <div key={r.id} className="flex items-center justify-between text-xs">
                        <span className="text-tech-400">+{r.quantity}{material.unit}</span>
                        <span className="text-gray-600">{r.date} {r.source}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : activeTab === 'purchase' ? (
        <div className="space-y-4">
          {purchaseRequests.length === 0 ? (
            <div className="data-card text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">暂无采购申请</p>
            </div>
          ) : (
            purchaseRequests.map((request) => (
              <div
                key={request.id}
                className={`data-card ${
                  selectedRequest === request.id ? 'ring-2 ring-tech-400' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-tech-300">
                      采购申请 #{request.id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      申请人: {request.applicant} | 申请时间: {request.createdAt}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-bold ${
                      request.status === 'approved'
                        ? 'bg-alert-green/20 text-alert-green'
                        : request.status === 'rejected'
                        ? 'bg-alert-red/20 text-alert-red'
                        : 'bg-alert-yellow/20 text-alert-yellow'
                    }`}
                  >
                    {request.status === 'approved' ? '已通过' : request.status === 'rejected' ? '已拒绝' : '待审批'}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">申请物资</h4>
                  <div className="flex flex-wrap gap-2">
                    {request.materials.map((m, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-military-800 rounded text-sm text-gray-300"
                      >
                        {m.name} × {m.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {[1, 2, 3].map((level) => {
                    const record = request.approvalRecords.find((r) => r.level === level);
                    const levelNames = ['', '街道人防办', '区人防办', '市人防办'];
                    return (
                      <div key={level} className="flex-1 text-center">
                        <div
                          className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                            record?.status === 'approved'
                              ? 'bg-alert-green/20 text-alert-green'
                              : record?.status === 'rejected'
                              ? 'bg-alert-red/20 text-alert-red'
                              : 'bg-military-700 text-gray-500'
                          }`}
                        >
                          {record?.status === 'approved' ? (
                            <Check className="w-5 h-5" />
                          ) : record?.status === 'rejected' ? (
                            <X className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{levelNames[level]}</p>
                        {record?.approver && (
                          <p className="text-xs text-gray-500">{record.approver}</p>
                        )}
                        {record?.date && (
                          <p className="text-[10px] text-gray-600">{record.date}</p>
                        )}
                        {record?.comment && (
                          <p className="text-[10px] text-gray-500 mt-0.5">意见: {record.comment}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {request.status === 'pending' &&
                  request.currentLevel === userApprovalLevel &&
                  userApprovalLevel > 0 && (
                    <div className="border-t border-tech-500/20 pt-4">
                      <p className="text-sm text-alert-yellow mb-2">
                        当前需 <strong>{['', '街道人防办', '区人防办', '市人防办'][userApprovalLevel]}</strong> 审批
                      </p>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="审批意见（可选）"
                        className="w-full p-3 bg-military-800 rounded-lg text-gray-200 text-sm resize-none mb-3"
                        rows={2}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            approvePurchase(request.id, userApprovalLevel, comment);
                            setComment('');
                          }}
                          className="flex-1 py-2 bg-alert-green/20 text-alert-green rounded-lg font-medium hover:bg-alert-green/30 transition-colors"
                        >
                          <Check className="w-4 h-4 inline mr-2" />
                          通过
                        </button>
                        <button
                          onClick={() => {
                            rejectPurchase(request.id, userApprovalLevel, comment || '需补充材料');
                            setComment('');
                          }}
                          className="flex-1 py-2 bg-alert-red/20 text-alert-red rounded-lg font-medium hover:bg-alert-red/30 transition-colors"
                        >
                          <X className="w-4 h-4 inline mr-2" />
                          拒绝
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {restockRecords.length === 0 ? (
            <div className="data-card text-center py-12">
              <Truck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">暂无补货记录</p>
              <p className="text-xs text-gray-600 mt-1">采购申请三级审批通过后将自动补入库存</p>
            </div>
          ) : (
            restockRecords.map((record) => (
              <div key={record.id} className="data-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-alert-green/20 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-alert-green" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-200">{record.materialName}</p>
                      <p className="text-xs text-gray-500">补货数量: +{record.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-tech-400 font-medium">{record.date}</p>
                    <p className="text-xs text-gray-500">{record.source}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default WarehouseManagement;
