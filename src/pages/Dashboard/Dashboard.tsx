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
} from 'lucide-react';
import MainScene from '@/components3d/Scene/MainScene';
import { useAuthStore } from '@/store/useAuthStore';
import { useShelterStore } from '@/store/useShelterStore';
import { useEmergencyStore } from '@/store/useEmergencyStore';
import { usePersonnelStore } from '@/store/usePersonnelStore';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: '3D主控台' },
  { path: '/shelter', icon: Building2, label: '防护单元' },
  { path: '/warehouse', icon: Package, label: '物资仓库' },
  { path: '/personnel', icon: Users, label: '人员定位' },
  { path: '/emergency', icon: AlertTriangle, label: '应急调度' },
  { path: '/reports', icon: FileBarChart, label: '统计报表' },
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthStore();
  const { environmentData, alerts, markAlertRead, updateEnvironment, units } = useShelterStore();
  const { alertLevel } = useEmergencyStore();
  const { personnel, updatePositions } = usePersonnelStore();
  const [showAlerts, setShowAlerts] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
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
                {currentTime.toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2 rounded-lg hover:bg-military-800 transition-colors"
              >
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
                    <button
                      onClick={() => setShowAlerts(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-2 space-y-2">
                    {alerts.slice(0, 10).map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => markAlertRead(alert.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          alert.isRead
                            ? 'bg-military-800/50'
                            : alert.level === 'danger'
                            ? 'bg-alert-red/10 border border-alert-red/30'
                            : 'bg-alert-yellow/10 border border-alert-yellow/30'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            className={`w-4 h-4 mt-0.5 ${
                              alert.level === 'danger' ? 'text-alert-red' : 'text-alert-yellow'
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-200">{alert.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(alert.timestamp).toLocaleTimeString('zh-CN')}
                            </p>
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
              <h3 className="font-display font-bold text-tech-300 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                实时监控数据
              </h3>

              <div className="space-y-4">
                {units.map((unit, idx) => {
                  const env = environmentData.find((e) => e.shelterId === unit.id);
                  return (
                    <div key={unit.id} className="data-card">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-tech-300 text-sm">{unit.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            unit.status === 'peacetime'
                              ? 'bg-tech-500/20 text-tech-300'
                              : 'bg-alert-red/20 text-alert-red'
                          }`}
                        >
                          {unit.status === 'peacetime' ? '平时' : '战时'}
                        </span>
                      </div>

                      {env && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <Wind className="w-4 h-4 text-alert-green" />
                            <div>
                              <p className="text-xs text-gray-500">O₂</p>
                              <p className="text-sm font-bold text-gray-200">
                                {env.oxygen.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wind
                              className={`w-4 h-4 ${
                                env.co2 > 1.5 ? 'text-alert-red animate-pulse' : 'text-gray-400'
                              }`}
                            />
                            <div>
                              <p className="text-xs text-gray-500">CO₂</p>
                              <p
                                className={`text-sm font-bold ${
                                  env.co2 > 1.5 ? 'text-alert-red' : 'text-gray-200'
                                }`}
                              >
                                {env.co2.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-alert-orange" />
                            <div>
                              <p className="text-xs text-gray-500">温度</p>
                              <p className="text-sm font-bold text-gray-200">
                                {env.temperature.toFixed(1)}°C
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-tech-400" />
                            <div>
                              <p className="text-xs text-gray-500">湿度</p>
                              <p className="text-sm font-bold text-gray-200">
                                {env.humidity.toFixed(0)}%
                              </p>
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
                    <p className="text-2xl font-display font-bold text-tech-400">
                      {personnel.length}
                    </p>
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
