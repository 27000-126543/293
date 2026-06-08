import { useEffect } from 'react';
import { Users, AlertTriangle, MapPin, Shield } from 'lucide-react';
import { usePersonnelStore } from '@/store/usePersonnelStore';

const PersonnelTracking = () => {
  const { personnel, updatePositions, toggleTrack, trackedPersonnel } = usePersonnelStore();

  useEffect(() => {
    const timer = setInterval(updatePositions, 2000);
    return () => clearInterval(timer);
  }, [updatePositions]);

  const alertPersonnel = personnel.filter((p) => p.isInUnprotectedZone);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="data-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">总人数</p>
              <p className="text-3xl font-display font-bold text-tech-400 mt-1">
                {personnel.length}
              </p>
            </div>
            <Users className="w-10 h-10 text-tech-400/30" />
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">安全区域</p>
              <p className="text-3xl font-display font-bold text-alert-green mt-1">
                {personnel.filter((p) => !p.isInUnprotectedZone).length}
              </p>
            </div>
            <Shield className="w-10 h-10 text-alert-green/30" />
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">未防护区</p>
              <p className="text-3xl font-display font-bold text-alert-red mt-1">
                {alertPersonnel.length}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-alert-red/30" />
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">追踪中</p>
              <p className="text-3xl font-display font-bold text-alert-yellow mt-1">
                {trackedPersonnel.length}
              </p>
            </div>
            <MapPin className="w-10 h-10 text-alert-yellow/30" />
          </div>
        </div>
      </div>

      {alertPersonnel.length > 0 && (
        <div className="data-card border-alert-red/50 bg-alert-red/5">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-alert-red animate-blink" />
            <h3 className="font-display font-bold text-alert-red">人员越界警告</h3>
          </div>
          <div className="space-y-2">
            {alertPersonnel.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-3 bg-alert-red/10 rounded-lg border border-alert-red/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <p className="font-medium text-alert-red">{person.name}</p>
                    <p className="text-xs text-gray-400">
                      {person.role} | 进入未防护区域
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  位置: ({person.position.x.toFixed(1)}, {person.position.z.toFixed(1)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="data-card">
        <h3 className="font-display font-bold text-tech-300 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          人员列表
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-tech-500/20">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">姓名</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">角色</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">位置</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">状态</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">进入时间</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((person) => (
                <tr
                  key={person.id}
                  className={`border-b border-tech-500/10 transition-colors hover:bg-military-800/50 ${
                    person.isInUnprotectedZone ? 'bg-alert-red/5' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👤</span>
                      <span className="font-medium text-gray-200">{person.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{person.role}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    ({person.position.x.toFixed(1)}, {person.position.z.toFixed(1)})
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        person.isInUnprotectedZone
                          ? 'bg-alert-red/20 text-alert-red animate-blink'
                          : 'bg-alert-green/20 text-alert-green'
                      }`}
                    >
                      {person.isInUnprotectedZone ? '未防护区' : '安全'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{person.entryTime}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleTrack(person.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        trackedPersonnel.includes(person.id)
                          ? 'bg-alert-yellow/20 text-alert-yellow'
                          : 'bg-military-700 text-gray-400 hover:bg-military-600'
                      }`}
                    >
                      {trackedPersonnel.includes(person.id) ? '取消追踪' : '追踪'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonnelTracking;
