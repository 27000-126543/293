import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Package,
  Users,
  AlertTriangle,
  FileBarChart,
  LogOut,
  Bell,
  Shield,
  ChevronRight,
  X,
  Wind,
  Thermometer,
  Droplets,
  Activity,
  Wrench,
  ToggleLeft,
  MapPin,
  ArrowLeft,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import MainScene from '@/components3d/Scene/MainScene';
import { useAuthStore } from '@/store/useAuthStore';
import { useShelterStore, type SelectedObjectType } from '@/store/useShelterStore';
import { useEmergencyStore } from '@/store/useEmergencyStore';
import { usePersonnelStore } from '@/store/usePersonnelStore';
import { useWarehouseStore } from '@/store/useWarehouseStore';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: '3D主控台' },
  { path: '/shelter', icon: Building2, label: '防护单元' },
  { path: '/warehouse', icon: Package, label: '物资仓库' },
  { path: '/personnel', icon: Users, label: '人员定位' },
  { path: '/emergency', icon: AlertTriangle, label: '应急调度' },
  { path: '/reports', icon: FileBarChart, label: '统计报表' },
];

const ShelterDetail = ({ unitId }: { unitId: string }) => {
  const { units, environmentData, environmentHistory, doorStatus } = useShelterStore();
  const unit = units.find((u) => u.id === unitId);
  const env = environmentData.find((e) => e.shelterId === unitId);
  const history = environmentHistory[unitId] || [];

  if (!unit) return null;

  return (
    <div className="space-y-4">
      <div className="data-card">
        <h4 className="font-display font-bold text-tech-300 mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          {unit.name}
        </h4>
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-0.5 rounded text-xs ${unit.status === 'peacetime' ? 'bg-tech-500/20 text-tech-300' : 'bg-alert-red/20 text-alert-red'}`}>
            {unit.status === 'peacetime' ? '平时' : '战时'}
          </span>
          <span className="text-xs text-gray-500">
            {unit.type === 'parking' ? '地下停车场' : unit.type === 'mall' ? '地下商场' : '人员掩蔽区'}
          </span>
        </div>
        {env && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-alert-green" />
              <div>
                <p className="text-xs text-gray-500">O₂</p>
                <p className="text-sm font-bold text-gray-200">{env.oxygen.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className={`w-4 h-4 ${env.co2 > 1.5 ? 'text-alert-red animate-pulse' : 'text-gray-400'}`} />
              <div>
                <p className="text-xs text-gray-500">CO₂</p>
                <p className={`text-sm font-bold ${env.co2 > 1.5 ? 'text-alert-red' : 'text-gray-200'}`}>{env.co2.toFixed(2)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-alert-orange" />
              <div>
                <p className="text-xs text-gray-500">温度</p>
                <p className="text-sm font-bold text-gray-200">{env.temperature.toFixed(1)}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-tech-400" />
              <div>
                <p className="text-xs text-gray-500">湿度</p>
                <p className="text-sm font-bold text-gray-200">{env.humidity.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="data-card">
        <h4 className="font-display font-bold text-tech-300 mb-3">结构健康</h4>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">健康评分</span>
          <span className={`font-display font-bold text-xl ${unit.structuralHealth > 90 ? 'text-alert-green' : unit.structuralHealth > 70 ? 'text-alert-yellow' : 'text-alert-red'}`}>
            {unit.structuralHealth}分
          </span>
        </div>
        <div className="h-2 bg-military-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${unit.structuralHealth > 90 ? 'bg-alert-green' : unit.structuralHealth > 70 ? 'bg-alert-yellow' : 'bg-alert-red'}`}
            style={{ width: `${unit.structuralHealth}%` }}
          />
        </div>
      </div>

      <div className="data-card">
        <h4 className="font-display font-bold text-tech-300 mb-3">加固记录</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {unit.reinforcementRecords.map((r) => (
            <div key={r.id} className="p-2 bg-military-800/50 rounded border-l-2 border-tech-500">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-200">{r.description}</span>
                <span className="text-xs text-gray-500">{r.date}</span>
              </div>
              <p className="text-xs text-gray-500">施工: {r.operator} | 结果: {r.result}</p>
            </div>
          ))}
        </div>
      </div>

      {history.length > 1 && (
        <div className="data-card">
          <h4 className="font-display font-bold text-tech-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            CO₂趋势
          </h4>
          <div className="h-20 flex items-end gap-1">
            {history.slice(-12).map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${h.co2 > 1.5 ? 'bg-alert-red' : 'bg-tech-500'}`}
                  style={{ height: `${Math.max(4, (h.co2 / 3) * 60)}px` }}
                />
                <span className="text-[8px] text-gray-600">{h.co2.toFixed(1)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[9px] text-gray-600">← 历史</span>
            <span className="text-[9px] text-gray-600">最新 →</span>
          </div>
        </div>
      )}
    </div>
  );
};

const DoorDetail = ({ doorId }: { doorId: string }) => {
  const { doorStatus, toggleDoor } = useShelterStore();
  const { maintenanceOrders } = useEmergencyStore();
  const door = doorStatus.find((d) => d.id === doorId);
  if (!door) return null;

  const relatedOrders = maintenanceOrders.filter((o) => o.deviceId === door.id);

  return (
    <div className="space-y-4">
      <div className="data-card">
        <h4 className="font-display font-bold text-tech-300 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {door.name}
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">开闭状态</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${door.isOpen ? 'bg-alert-green/20 text-alert-green' : 'bg-gray-600/20 text-gray-400'}`}>
              {door.isOpen ? '开启' : '关闭'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">锁定状态</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${door.isLocked ? 'bg-alert-yellow/20 text-alert-yellow' : 'bg-alert-green/20 text-alert-green'}`}>
              {door.isLocked ? '已锁定' : '未锁定'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">故障状态</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${door.isFault ? 'bg-alert-red/20 text-alert-red animate-pulse' : 'bg-alert-green/20 text-alert-green'}`}>
              {door.isFault ? '故障' : '正常'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">最后维护</span>
            <span className="text-sm text-gray-300">{door.lastMaintenance}</span>
          </div>
        </div>
        <button
          onClick={() => toggleDoor(door.id)}
          disabled={door.isFault}
          className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            door.isFault ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-tech-500/20 text-tech-300 hover:bg-tech-500/30'
          }`}
        >
          <ToggleLeft className="w-4 h-4 inline mr-2" />
          {door.isOpen ? '关闭防护门' : '开启防护门'}
        </button>
      </div>

      <div className="data-card">
        <h4 className="font-display font-bold text-tech-300 mb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4" />
          维修记录
        </h4>
        {relatedOrders.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">暂无维修记录</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {relatedOrders.map((order) => (
              <div key={order.id} className="p-2 bg-military-800/50 rounded border-l-2 border-alert-orange">
                <p className="text-sm text-gray-200">{order.issue}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${order.status === 'completed' ? 'text-alert-green' : 'text-alert-yellow'}`}>
                    {order.status === 'completed' ? '已完成' : '处理中'}
                  </span>
                  <span className="text-xs text-gray-500">{order.createdAt}</span>
                </div>
                {order.assignee && <p className="text-xs text-gray-500 mt-1">处理人: {order.assignee}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const WarehouseDetail = () => {
  const { materials, lowStockMaterials } = useWarehouseStore();
  const lowItems = materials.filter((m) => lowStockMaterials.includes(m.id));

  return (
    <div className="space-y-4">
      <div className="data-card">
        <h4 className="font-display font-bold text-tech-300 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          战备物资仓库
        </h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 bg-military-800/50 rounded">
            <p className="text-xl font-display font-bold text-tech-400">{materials.length}</p>
            <p className="text-xs text-gray-500">物资种类</p>
          </div>
          <div className="text-center p-2 bg-military-800/50 rounded">
            <p className={`text-xl font-display font-bold ${lowItems.length > 0 ? 'text-alert-orange' : 'text-alert-green'}`}>{lowItems.length}</p>
            <p className="text-xs text-gray-500">库存不足</p>
          </div>
        </div>
      </div>

      {lowItems.length > 0 && (
        <div className="data-card">
          <h4 className="font-display font-bold text-alert-orange mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            低库存物资
          </h4>
          <div className="space-y-2">
            {lowItems.map((m) => {
              const days = Math.floor(m.quantity / m.dailyConsumption);
              return (
                <div key={m.id} className="p-2 bg-alert-orange/10 rounded border-l-2 border-alert-orange">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-200">{m.name}</span>
                    <span className="text-xs text-alert-orange font-bold">可用 {days} 天</span>
                  </div>
                  <p className="text-xs text-gray-500">库存: {m.quantity}{m.unit} | 日耗: {m.dailyConsumption}{m.unit}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const PersonnelDetail = ({ personId }: { personId: string }) => {
  const { personnel } = usePersonnelStore();
  const person = personnel.find((p) => p.id === personId);
  if (!person) return null;

  return (
    <div className="space-y-4">
      <div className="data-card">
        <h4 className="font-display font-bold text-tech-300 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          人员信息
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${person.isInUnprotectedZone ? 'bg-alert-red/20 border border-alert-red' : 'bg-tech-500/20 border border-tech-500'}`}>
              <span className="text-sm">{person.name[0]}</span>
            </div>
            <div>
              <p className="font-medium text-gray-200">{person.name}</p>
              <p className="text-xs text-gray-500">{person.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">当前状态</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${person.isInUnprotectedZone ? 'bg-alert-red/20 text-alert-red animate-pulse' : 'bg-alert-green/20 text-alert-green'}`}>
              {person.isInUnprotectedZone ? '越界' : '正常'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">进入时间</span>
            <span className="text-sm text-gray-300">{person.entryTime}</span>
          </div>
        </div>
      </div>

      <div className="data-card">
        <h4 className="font-display font-bold text-tech-300 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          位置信息
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">X坐标</span>
            <span className="text-sm text-gray-200">{person.position.x.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Z坐标</span>
            <span className="text-sm text-gray-200">{person.position.z.toFixed(1)}</span>
          </div>
          {person.isInUnprotectedZone && (
            <div className="p-2 bg-alert-red/10 rounded border border-alert-red/30 mt-2">
              <p className="text-xs text-alert-red flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                该人员处于未防护区域，请立即引导转移！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthStore();
  const { environmentData, alerts, markAlertRead, updateEnvironment, units, selectedUnitId, selectedObjectType, selectObject } = useShelterStore();
  const { alertLevel } = useEmergencyStore();
  const { personnel, updatePositions } = usePersonnelStore();
  const [showAlerts, setShowAlerts] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    updateEnvironment();
    const envTimer = setInterval(updateEnvironment, 5000);
    return () => clearInterval(envTimer);
  }, [updateEnvironment]);

  useEffect(() => {
    const posTimer = setInterval(updatePositions, 3000);
    return () => clearInterval(posTimer);
  }, [updatePositions]);

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  const alertLevelColors: Record<string, string> = {
    green: 'bg-alert-green text-green-900',
    blue: 'bg-tech-500 text-white',
    yellow: 'bg-alert-yellow text-yellow-900',
    red: 'bg-alert-red text-white animate-pulse',
  };

  const alertLevelText: Record<string, string> = {
    green: '正常',
    blue: '三级预警',
    yellow: '二级预警',
    red: '一级警报',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isMainDashboard = location.pathname === '/dashboard';

  const renderDetailPanel = () => {
    if (!selectedObjectType || !selectedUnitId) {
      return (
        <>
          <h3 className="font-display font-bold text-tech-300 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            实时监控数据
          </h3>
          <div className="space-y-4">
            {units.map((unit) => {
              const env = environmentData.find((e) => e.shelterId === unit.id);
              return (
                <div
                  key={unit.id}
                  className="data-card cursor-pointer hover:ring-1 hover:ring-tech-400 transition-all"
                  onClick={() => selectObject('shelter', unit.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-tech-300 text-sm">{unit.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs ${unit.status === 'peacetime' ? 'bg-tech-500/20 text-tech-300' : 'bg-alert-red/20 text-alert-red'}`}>
                      {unit.status === 'peacetime' ? '平时' : '战时'}
                    </span>
                  </div>
                  {env && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-alert-green" />
                        <div>
                          <p className="text-xs text-gray-500">O₂</p>
                          <p className="text-sm font-bold text-gray-200">{env.oxygen.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className={`w-4 h-4 ${env.co2 > 1.5 ? 'text-alert-red animate-pulse' : 'text-gray-400'}`} />
                        <div>
                          <p className="text-xs text-gray-500">CO₂</p>
                          <p className={`text-sm font-bold ${env.co2 > 1.5 ? 'text-alert-red' : 'text-gray-200'}`}>{env.co2.toFixed(2)}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-alert-orange" />
                        <div>
                          <p className="text-xs text-gray-500">温度</p>
                          <p className="text-sm font-bold text-gray-200">{env.temperature.toFixed(1)}°C</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-tech-400" />
                        <div>
                          <p className="text-xs text-gray-500">湿度</p>
                          <p className="text-sm font-bold text-gray-200">{env.humidity.toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 data-card">
            <h4 className="font-medium text-tech-300 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              人员统计
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-tech-400">{personnel.length}</p>
                <p className="text-xs text-gray-500">总人数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-display font-bold text-alert-red">
                  {personnel.filter((p) => p.isInUnprotectedZone).length}
                </p>
                <p className="text-xs text-gray-500">未防护区</p>
              </div>
            </div>
          </div>
        </>
      );
    }

    const typeLabels: Record<SelectedObjectType, string> = {
      shelter: '防护单元',
      door: '防护门',
      warehouse: '物资仓库',
      personnel: '人员',
    };

    return (
      <>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => selectObject(null, null)}
            className="p-1 rounded hover:bg-military-800 transition-colors text-gray-400 hover:text-tech-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-display font-bold text-tech-300">
            {typeLabels[selectedObjectType]}详情
          </h3>
        </div>
        {selectedObjectType === 'shelter' && <ShelterDetail unitId={selectedUnitId} />}
        {selectedObjectType === 'door' && <DoorDetail doorId={selectedUnitId} />}
        {selectedObjectType === 'warehouse' && <WarehouseDetail />}
        {selectedObjectType === 'personnel' && <PersonnelDetail personId={selectedUnitId} />}
      </>
    );
  };

  return (
    <div className="w-full h-full flex bg-military-950">
      <aside className="w-64 h-full glass-panel border-r border-tech-500/30 flex flex-col">
        <div className="p-4 border-b border-tech-500/20">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-tech-400" />
            <div>
              <h1 className="font-display font-bold text-tech-400 text-sm">人防管控平台</h1>
              <p className="text-xs text-gray-500">Civil Defense System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-tech-500/20 text-tech-300 shadow-glow-tech'
                    : 'text-gray-400 hover:bg-military-800 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-tech-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-tech-500/20 flex items-center justify-center border border-tech-500/50">
              <span className="text-lg">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">{currentUser?.name}</p>
              <p className="text-xs text-tech-400">{currentUser?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:bg-alert-red/10 hover:text-alert-red transition-colors"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 glass-panel border-b border-tech-500/30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-bold text-lg text-tech-300">
              {navItems.find((n) => location.pathname.startsWith(n.path))?.label || '3D主控台'}
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${alertLevelColors[alertLevel]}`}>
              {alertLevelText[alertLevel]}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-display text-tech-400 text-lg">
                {currentTime.toLocaleTimeString('zh-CN')}
              </p>
              <p className="text-xs text-gray-500">
                {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </p>
            </div>

            <div className="relative">
              <button onClick={() => setShowAlerts(!showAlerts)} className="relative p-2 rounded-lg hover:bg-military-800 transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-alert-red text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              {showAlerts && (
                <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto glass-panel rounded-lg tech-border z-50">
                  <div className="p-3 border-b border-tech-500/20 flex items-center justify-between">
                    <h3 className="font-display font-bold text-tech-300">预警信息</h3>
                    <button onClick={() => setShowAlerts(false)} className="text-gray-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-2 space-y-2">
                    {alerts.slice(0, 10).map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => markAlertRead(alert.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          alert.isRead ? 'bg-military-800/50' : alert.level === 'danger' ? 'bg-alert-red/10 border border-alert-red/30' : 'bg-alert-yellow/10 border border-alert-yellow/30'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`w-4 h-4 mt-0.5 ${alert.level === 'danger' ? 'text-alert-red' : 'text-alert-yellow'}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-200">{alert.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleTimeString('zh-CN')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {isMainDashboard ? (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 relative">
              <MainScene />
            </div>

            <aside className="w-80 glass-panel border-l border-tech-500/30 p-4 overflow-y-auto">
              {renderDetailPanel()}
            </aside>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
