import { useState } from 'react';
import { AlertTriangle, Shield, Map, Check, Play, Wrench, Clock, User } from 'lucide-react';
import { useEmergencyStore } from '@/store/useEmergencyStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useShelterStore } from '@/store/useShelterStore';

const alertLevels = [
  { level: 'green', name: '正常', color: 'bg-alert-green', textColor: 'text-green-900' },
  { level: 'blue', name: '三级预警', color: 'bg-tech-500', textColor: 'text-white' },
  { level: 'yellow', name: '二级预警', color: 'bg-alert-yellow', textColor: 'text-yellow-900' },
  { level: 'red', name: '一级警报', color: 'bg-alert-red', textColor: 'text-white' },
];

const EmergencyManagement = () => {
  const {
    alertLevel,
    currentPlan,
    maintenanceOrders,
    rerouteNotes,
    setAlertLevel,
    approvePlan,
    executePlan,
    updateMaintenanceStatus,
  } = useEmergencyStore();
  const { currentUser } = useAuthStore();
  const { doorStatus } = useShelterStore();
  const [activeTab, setActiveTab] = useState<'alert' | 'maintenance'>('alert');

  const canApprove = currentUser?.role === '指挥长' || currentUser?.role === '市人防办';

  return (
    <div className="space-y-6">
      <div className="data-card">
        <h3 className="font-display font-bold text-tech-300 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          空袭预警等级设置
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {alertLevels.map((item) => (
            <button
              key={item.level}
              onClick={() => setAlertLevel(item.level as any)}
              className={`p-4 rounded-lg tech-border transition-all duration-300 ${
                alertLevel === item.level
                  ? 'ring-2 ring-white shadow-lg scale-105'
                  : 'hover:bg-military-800/50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full ${item.color} mx-auto mb-3 flex items-center justify-center ${
                  alertLevel === item.level && item.level === 'red' ? 'animate-pulse' : ''
                }`}
              >
                <Shield className={`w-6 h-6 ${item.textColor}`} />
              </div>
              <p className={`font-display font-bold ${alertLevel === item.level ? 'text-white' : 'text-gray-400'}`}>
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('alert')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'alert'
              ? 'bg-tech-500/20 text-tech-300 border border-tech-400'
              : 'bg-military-800 text-gray-400 hover:bg-military-700'
          }`}
        >
          <Map className="w-4 h-4 inline mr-2" />
          掩蔽方案
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
            activeTab === 'maintenance'
              ? 'bg-tech-500/20 text-tech-300 border border-tech-400'
              : 'bg-military-800 text-gray-400 hover:bg-military-700'
          }`}
        >
          <Wrench className="w-4 h-4 inline mr-2" />
          维修工单
          {maintenanceOrders.filter((o) => o.status !== 'completed').length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-alert-orange text-white text-xs rounded-full flex items-center justify-center">
              {maintenanceOrders.filter((o) => o.status !== 'completed').length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'alert' ? (
        <div>
          {!currentPlan ? (
            <div className="data-card text-center py-12">
              <Shield className="w-16 h-16 text-alert-green mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-gray-300 mb-2">
                当前处于正常状态
              </h3>
              <p className="text-gray-500">提升预警等级以生成掩蔽方案</p>
            </div>
          ) : (
            <div className="data-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-tech-300">
                    应急掩蔽方案 #{currentPlan.id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    预警等级: {alertLevels.find((l) => l.level === currentPlan.alertLevel)?.name} |
                    创建时间: {new Date(currentPlan.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    currentPlan.isApproved
                      ? 'bg-alert-green/20 text-alert-green'
                      : 'bg-alert-yellow/20 text-alert-yellow'
                  }`}
                >
                  {currentPlan.isApproved ? '已审批' : '待审批'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">疏散路径</h4>
                  <div className="space-y-3">
                    {currentPlan.paths.map((path) => (
                      <div
                        key={path.id}
                        className="p-3 bg-military-800/50 rounded-lg border-l-4"
                        style={{
                          borderLeftColor:
                            path.color === 'green'
                              ? '#00ff88'
                              : path.color === 'blue'
                              ? '#00d4ff'
                              : path.color === 'yellow'
                              ? '#ffcc00'
                              : '#ff3366',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-200">
                              {path.fromArea} → {path.toShelter}
                            </p>
                            <p className="text-xs text-gray-500">
                              预计用时: {path.estimatedTime} 分钟
                            </p>
                          </div>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                path.color === 'green'
                                  ? '#00ff88'
                                  : path.color === 'blue'
                                  ? '#00d4ff'
                                  : path.color === 'yellow'
                                  ? '#ffcc00'
                                  : '#ff3366',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">方案详情</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-military-800/30 rounded">
                      <span className="text-gray-400">路径数量</span>
                      <span className="font-medium text-gray-200">{currentPlan.paths.length} 条</span>
                    </div>
                    <div className="flex justify-between p-2 bg-military-800/30 rounded">
                      <span className="text-gray-400">涉及防护单元</span>
                      <span className="font-medium text-gray-200">3 个</span>
                    </div>
                    <div className="flex justify-between p-2 bg-military-800/30 rounded">
                      <span className="text-gray-400">预计疏散人数</span>
                      <span className="font-medium text-gray-200">550 人</span>
                    </div>
                    <div className="flex justify-between p-2 bg-military-800/30 rounded">
                      <span className="text-gray-400">最长疏散时间</span>
                      <span className="font-medium text-gray-200">8 分钟</span>
                    </div>
                  </div>
                </div>
              </div>

              {rerouteNotes.length > 0 && (
                <div className="mb-6 p-4 bg-alert-orange/10 rounded-lg border border-alert-orange/30">
                  <h4 className="text-sm font-bold text-alert-orange mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    路线调整说明
                  </h4>
                  <ul className="space-y-1">
                    {rerouteNotes.map((note, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-alert-orange mt-1">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!currentPlan.isApproved ? (
                canApprove && (
                  <div className="border-t border-tech-500/20 pt-4 flex gap-4">
                    <button
                      onClick={() => approvePlan(currentPlan.id, currentUser?.name || '')}
                      className="flex-1 py-3 bg-alert-green/20 text-alert-green rounded-lg font-medium hover:bg-alert-green/30 transition-colors"
                    >
                      <Check className="w-5 h-5 inline mr-2" />
                      审批通过
                    </button>
                  </div>
                )
              ) : (
                <div className="border-t border-tech-500/20 pt-4">
                  <p className="text-sm text-alert-green mb-3">
                    ✓ 已由 {currentPlan.approver} 审批通过
                  </p>
                  {!currentPlan.executedAt ? (
                    <button
                      onClick={() => executePlan(currentPlan.id)}
                      className="w-full py-3 btn-primary"
                    >
                      <Play className="w-5 h-5 inline mr-2" />
                      执行方案
                    </button>
                  ) : (
                    <p className="text-center text-alert-green py-3">
                      ✓ 方案已于 {new Date(currentPlan.executedAt).toLocaleString('zh-CN')} 执行
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {maintenanceOrders.map((order) => (
            <div key={order.id} className="data-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-tech-300">
                    维修工单 #{order.id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    设备: {order.deviceName} | 创建时间: {order.createdAt}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    order.status === 'completed'
                      ? 'bg-alert-green/20 text-alert-green'
                      : order.status === 'processing'
                      ? 'bg-alert-yellow/20 text-alert-yellow'
                      : 'bg-gray-600/20 text-gray-400'
                  }`}
                >
                  {order.status === 'completed'
                    ? '已完成'
                    : order.status === 'processing'
                    ? '处理中'
                    : '待处理'}
                </span>
              </div>

              <p className="text-gray-300 mb-4">
                <span className="text-gray-500">故障描述: </span>
                {order.issue}
              </p>

              {order.assignee && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <User className="w-4 h-4" />
                  <span>处理人: {order.assignee}</span>
                </div>
              )}

              {order.status !== 'completed' && (
                <div className="border-t border-tech-500/20 pt-4 flex gap-3">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateMaintenanceStatus(order.id, 'processing')}
                      className="flex-1 py-2 bg-alert-yellow/20 text-alert-yellow rounded-lg font-medium hover:bg-alert-yellow/30 transition-colors"
                    >
                      <Wrench className="w-4 h-4 inline mr-2" />
                      开始处理
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button
                      onClick={() => updateMaintenanceStatus(order.id, 'completed')}
                      className="flex-1 py-2 bg-alert-green/20 text-alert-green rounded-lg font-medium hover:bg-alert-green/30 transition-colors"
                    >
                      <Check className="w-4 h-4 inline mr-2" />
                      完成维修
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyManagement;
