import { useState, useMemo } from 'react';
import { FileBarChart, Download, Calendar, Package, Users, TrendingUp } from 'lucide-react';
import { useWarehouseStore } from '@/store/useWarehouseStore';
import { exportMaterialConsumption, exportDrillRecords, exportMonthlyReport } from '@/utils/excel';

const ReportCenter = () => {
  const { materialConsumptions, drillRecords, purchaseRequests } = useWarehouseStore();
  const [selectedMonth, setSelectedMonth] = useState('2026-06');

  const months = [
    { value: '2026-06', label: '2026年6月' },
    { value: '2026-05', label: '2026年5月' },
    { value: '2026-04', label: '2026年4月' },
    { value: '2026-03', label: '2026年3月' },
  ];

  const filteredConsumptions = useMemo(
    () => materialConsumptions.filter((c) => c.date.startsWith(selectedMonth)),
    [materialConsumptions, selectedMonth]
  );

  const filteredDrills = useMemo(
    () => drillRecords.filter((d) => d.date.startsWith(selectedMonth)),
    [drillRecords, selectedMonth]
  );

  const filteredApprovals = useMemo(
    () => purchaseRequests.filter((r) => r.createdAt.startsWith(selectedMonth)),
    [purchaseRequests, selectedMonth]
  );

  const foodConsumption = filteredConsumptions.filter((c) => c.type === 'food');
  const waterConsumption = filteredConsumptions.filter((c) => c.type === 'water');
  const medicineConsumption = filteredConsumptions.filter((c) => c.type === 'medicine');

  const totalParticipants = filteredDrills.reduce((sum, r) => sum + r.participants, 0);
  const totalDuration = filteredDrills.reduce((sum, r) => sum + r.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-display font-bold text-tech-300">数据统计中心</h2>
          <div className="flex items-center gap-2 bg-military-800 rounded-lg px-4 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-gray-200 outline-none"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value} className="bg-military-800">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportMaterialConsumption(filteredConsumptions, selectedMonth)}
            className="btn-tech flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出物资消耗
          </button>
          <button
            onClick={() => exportDrillRecords(filteredDrills, selectedMonth)}
            className="btn-tech flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出演练统计
          </button>
          <button
            onClick={() =>
              exportMonthlyReport(filteredConsumptions, filteredDrills, filteredApprovals, selectedMonth)
            }
            className="btn-primary flex items-center gap-2"
          >
            <FileBarChart className="w-4 h-4" />
            导出月度报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="data-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">物资消耗记录</p>
              <p className="text-3xl font-display font-bold text-tech-400 mt-1">
                {filteredConsumptions.length}
              </p>
            </div>
            <Package className="w-10 h-10 text-tech-400/30" />
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">应急演练次数</p>
              <p className="text-3xl font-display font-bold text-alert-green mt-1">
                {filteredDrills.length}
              </p>
            </div>
            <Users className="w-10 h-10 text-alert-green/30" />
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">累计参与人次</p>
              <p className="text-3xl font-display font-bold text-alert-yellow mt-1">
                {totalParticipants}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-alert-yellow/30" />
          </div>
        </div>
        <div className="data-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">采购审批记录</p>
              <p className="text-3xl font-display font-bold text-alert-orange mt-1">
                {filteredApprovals.length}
              </p>
            </div>
            <FileBarChart className="w-10 h-10 text-alert-orange/30" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="data-card">
          <h3 className="font-display font-bold text-tech-300 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            物资消耗统计
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-military-800/50 rounded-lg">
              <p className="text-2xl font-display font-bold text-alert-green">
                {foodConsumption.reduce((s, c) => s + c.quantity, 0)}
              </p>
              <p className="text-xs text-gray-500">食品类</p>
            </div>
            <div className="text-center p-3 bg-military-800/50 rounded-lg">
              <p className="text-2xl font-display font-bold text-tech-400">
                {waterConsumption.reduce((s, c) => s + c.quantity, 0)}
              </p>
              <p className="text-xs text-gray-500">水类</p>
            </div>
            <div className="text-center p-3 bg-military-800/50 rounded-lg">
              <p className="text-2xl font-display font-bold text-alert-yellow">
                {medicineConsumption.reduce((s, c) => s + c.quantity, 0)}
              </p>
              <p className="text-xs text-gray-500">药品类</p>
            </div>
          </div>
          {filteredConsumptions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">该月份暂无物资消耗记录</p>
          ) : (
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-military-900">
                  <tr className="border-b border-tech-500/20">
                    <th className="text-left py-2 px-3 text-gray-400">日期</th>
                    <th className="text-left py-2 px-3 text-gray-400">物资名称</th>
                    <th className="text-left py-2 px-3 text-gray-400">数量</th>
                    <th className="text-left py-2 px-3 text-gray-400">用途</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsumptions.map((item) => (
                    <tr key={item.id} className="border-b border-tech-500/10">
                      <td className="py-2 px-3 text-gray-400">{item.date}</td>
                      <td className="py-2 px-3 text-gray-200">{item.materialName}</td>
                      <td className="py-2 px-3 text-tech-400">{item.quantity}</td>
                      <td className="py-2 px-3 text-gray-500">{item.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="data-card">
          <h3 className="font-display font-bold text-tech-300 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            应急演练统计
          </h3>
          {filteredDrills.length === 0 ? (
            <p className="text-center text-gray-500 py-8">该月份暂无演练记录</p>
          ) : (
            <div className="space-y-4">
              {filteredDrills.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-military-800/50 rounded-lg border border-tech-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-200">{record.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        record.result === '优秀'
                          ? 'bg-alert-green/20 text-alert-green'
                          : 'bg-alert-yellow/20 text-alert-yellow'
                      }`}
                    >
                      {record.result}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{record.date}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">参与人数</p>
                      <p className="font-medium text-tech-400">{record.participants} 人</p>
                    </div>
                    <div>
                      <p className="text-gray-500">演练时长</p>
                      <p className="font-medium text-alert-yellow">{record.duration} 分钟</p>
                    </div>
                    <div>
                      <p className="text-gray-500">评级</p>
                      <p className={`font-medium ${record.result === '优秀' ? 'text-alert-green' : 'text-alert-yellow'}`}>
                        {record.result}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-tech-500/10">
                    备注: {record.notes}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCenter;
