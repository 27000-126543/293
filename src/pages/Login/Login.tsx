import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Scan, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';

const roles: { role: UserRole; icon: string; description: string }[] = [
  { role: '值班员', icon: '👁️', description: '日常监控与预警处理' },
  { role: '站长', icon: '🏭', description: '防护单元与物资管理' },
  { role: '指挥长', icon: '🎖️', description: '应急调度与方案审批' },
  { role: '市人防办', icon: '🏛️', description: '全局管理与数据统计' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, selectedRole, setSelectedRole } = useAuthStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isScanning && selectedRole) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleLogin();
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isScanning, selectedRole]);

  const handleLogin = async () => {
    if (!selectedRole) return;
    try {
      const success = await login(selectedRole, false);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('人脸识别失败，请重试');
        setIsScanning(false);
        setScanProgress(0);
      }
    } catch (e) {
      setError('系统错误，请稍后再试');
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const startScan = () => {
    if (!selectedRole) {
      setError('请先选择角色');
      return;
    }
    setError('');
    setIsScanning(true);
    setScanProgress(0);
  };

  return (
    <div className="w-full h-full grid-bg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tech-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-alert-red/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Shield className="w-16 h-16 text-tech-400" />
          </div>
          <h1 className="text-4xl font-display font-bold text-tech-400 mb-2 hud-text">
            智慧人防工程综合管控平台
          </h1>
          <p className="text-gray-400 text-lg">3D Visualized Civil Defense Management System</p>
        </div>

        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-display text-tech-300 mb-6 flex items-center gap-2">
              <User className="w-6 h-6" />
              选择登录角色
            </h2>
            <div className="space-y-3">
              {roles.map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    setSelectedRole(item.role);
                    setError('');
                  }}
                  className={`w-full p-4 rounded-lg tech-border transition-all duration-300 text-left flex items-center gap-4 ${
                    selectedRole === item.role
                      ? 'bg-tech-500/20 shadow-glow-tech'
                      : 'bg-military-900/60 hover:bg-military-800/60'
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className={`font-display font-bold ${
                      selectedRole === item.role ? 'text-tech-300' : 'text-gray-300'
                    }`}>
                      {item.role}
                    </p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  {selectedRole === item.role && (
                    <div className="ml-auto w-3 h-3 rounded-full bg-tech-400 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <div className={`w-72 h-80 rounded-xl tech-border bg-military-900/80 flex items-center justify-center relative overflow-hidden ${
                isScanning ? 'shadow-glow-tech' : ''
              }`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-tech-500/5 to-transparent" />
                
                <div className="w-48 h-56 rounded-lg border-2 border-tech-500/50 bg-military-800/50 flex items-center justify-center relative overflow-hidden">
                  {!isScanning ? (
                    <div className="text-center">
                      <div className="text-6xl mb-2">👤</div>
                      <p className="text-gray-500 text-sm">等待人脸识别</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl">😊</div>
                      </div>
                      <div
                        className="absolute left-0 right-0 h-0.5 bg-tech-400 shadow-glow-tech"
                        style={{ top: `${scanProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-tech-400" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-tech-400" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-tech-400" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-tech-400" />
                </div>

                {isScanning && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-tech-400 text-sm">
                      <Scan className="w-4 h-4 animate-spin" />
                      <span>识别中... {scanProgress}%</span>
                    </div>
                    <div className="mt-2 h-1 bg-military-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-tech-500 to-tech-300 transition-all duration-100"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 text-alert-red text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                onClick={startScan}
                disabled={isScanning}
                className={`mt-6 w-72 py-4 rounded-lg font-display font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isScanning
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                <Scan className="w-5 h-5" />
                {isScanning ? '正在识别...' : '开始人脸识别'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>© 2026 智慧人防工程综合管控平台 | 市人民防空办公室</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
