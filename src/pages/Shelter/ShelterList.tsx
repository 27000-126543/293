import { useState } from 'react';
import { useShelterStore } from '@/store/useShelterStore';
import { Building2, Thermometer, Wind, Users, Activity, Shield, Wrench, ToggleLeft } from 'lucide-react';

const ShelterList = () => {
  const { units, environmentData, doorStatus, toggleShelterStatus, toggleDoor } = useShelterStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedUnit = units.find((u) => u.id === selectedId);
  const selectedEnv = environmentData.find((e) => e.shelterId === selectedId);
  const unitDoors = doorStatus.filter((d) => d.shelterId === selectedId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {units.map((unit) => {
          const env = environmentData.find((e) => e.shelterId === unit.id);
          return (
            <div
              key={unit.id}
              onClick={() => setSelectedId(unit.id)}
              className={`data-card cursor-pointer transition-all duration-300 ${
                selectedId === unit.id ? 'ring-2 ring-tech-400 shadow-glow-tech' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-tech-400" />
                  <div>
                    <h3 className="font-display font-bold text-tech-300">{unit.name}</h3>
                    <p className="text-xs text-gray-500">
                      {unit.type === 'parking' ? '地下停车场' : unit.type === 'mall' ? '地下商场' : '人员掩蔽区'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShelterStatus(unit.id);
                  }}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    unit.status === 'peacetime'
                      ? 'bg-tech-500/20 text-tech-300 hover:bg-tech-500/30'
                      : 'bg-alert-red/20 text-alert-red hover:bg-alert-red/30'
                  }`}
                >
                  {unit.status === 'peacetime' ? '平时状态' : '战时状态'}
                </button>
              </div>

              {env && (
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-2 bg-military-800/50 rounded">
                    <Wind className="w-5 h-5 text-alert-green mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-200">{env.oxygen.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">含氧量</p>
                  </div>
                  <div className="text-center p-2 bg-military-800/50 rounded">
                    <Wind className={`w-5 h-5 mx-auto mb-1 ${env.co2 > 1.5 ? 'text-alert-red animate-pulse' : 'text-gray-400'}`} />
                    <p className={`text-lg font-bold ${env.co2 > 1.5 ? 'text-alert-red' : 'text-gray-200'}`}>
                      {env.co2.toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500">CO₂</p>
                  </div>
                  <div className="text-center p-2 bg-military-800/50 rounded">
                    <Thermometer className="w-5 h-5 text-alert-orange mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-200">{env.temperature.toFixed(1)}°C</p>
                    <p className="text-xs text-gray-500">温度</p>
                  </div>
                  <div className="text-center p-2 bg-military-800/50 rounded">
                    <Users className="w-5 h-5 text-tech-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-200">
                      {unit.currentPopulation}/{unit.capacity}
                    </p>
                    <p className="text-xs text-gray-500">人员</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-alert-green" />
                  <span className="text-gray-400">结构健康: </span>
                  <span className={`font-bold ${unit.structuralHealth > 90 ? 'text-alert-green' : unit.structuralHealth > 70 ? 'text-alert-yellow' : 'text-alert-red'}`}>
                    {unit.structuralHealth}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-tech-400" />
                  <span className="text-gray-400">{doorStatus.filter((d) => d.shelterId === unit.id && !d.isFault).length}/
                    {doorStatus.filter((d) => d.shelterId === unit.id).length} 防护门正常
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedUnit && (
        <div className="grid grid-cols-2 gap-6">
          <div className="data-card">
            <h3 className="font-display font-bold text-tech-300 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              结构健康与加固记录
            </h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">结构健康评分</span>
                <span className="font-display font-bold text-2xl text-alert-green">
                  {selectedUnit.structuralHealth}分
                </span>
              </div>
              <div className="h-3 bg-military-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-tech-500 to-alert-green transition-all duration-500"
                  style={{ width: `${selectedUnit.structuralHealth}%` }}
                />
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-300 mb-3">加固历史记录</h4>
            <div className="space-y-3">
              {selectedUnit.reinforcementRecords.map((record) => (
                <div
                  key={record.id}
                  className="p-3 bg-military-800/50 rounded-lg border-l-2 border-tech-500"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-200">{record.description}</span>
                    <span className="text-xs text-gray-500">{record.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">施工人员: {record.operator}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        record.result === '优秀'
                          ? 'bg-alert-green/20 text-alert-green'
                          : 'bg-tech-500/20 text-tech-300'
                      }`}
                    >
                      {record.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="data-card">
            <h3 className="font-display font-bold text-tech-300 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              防护门状态控制
            </h3>
            <div className="space-y-3">
              {unitDoors.map((door) => (
                <div
                  key={door.id}
                  className={`p-4 rounded-lg border ${
                    door.isFault
                      ? 'bg-alert-red/10 border-alert-red/30'
                      : 'bg-military-800/50 border-tech-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-200">{door.name}</p>
                      <p className="text-xs text-gray-500">
                        最后维护: {door.lastMaintenance}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          door.isFault
                            ? 'bg-alert-red/20 text-alert-red'
                            : door.isOpen
                            ? 'bg-alert-green/20 text-alert-green'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {door.isFault ? '故障锁定' : door.isOpen ? '开启' : '关闭'}
                      </span>
                      <button
                        onClick={() => toggleDoor(door.id)}
                        disabled={door.isFault}
                        className={`p-2 rounded transition-colors ${
                          door.isFault
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-tech-400 hover:bg-tech-500/20'
                        }`}
                      >
                        <ToggleLeft className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedEnv && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">环境参数详情</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-military-800/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">含氧量趋势</p>
                    <p className="text-2xl font-display font-bold text-alert-green">
                      {selectedEnv.oxygen.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">正常范围: 19.5%~23.5%</p>
                  </div>
                  <div className="p-3 bg-military-800/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">CO₂浓度</p>
                    <p className={`text-2xl font-display font-bold ${selectedEnv.co2 > 1.5 ? 'text-alert-red' : 'text-gray-200'}`}>
                      {selectedEnv.co2.toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500">阈值: 1.5%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterList;
