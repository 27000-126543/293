import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { DrillRecord, MaterialConsumption, PurchaseRequest } from '@/types';

const styleHeader = (sheet: ExcelJS.Worksheet) => {
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, size: 12, color: { argb: 'FF00D4FF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0A1628' },
  };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
};

const styleRows = (sheet: ExcelJS.Worksheet, rowCount: number) => {
  for (let i = 2; i <= rowCount; i++) {
    const row = sheet.getRow(i);
    row.alignment = { horizontal: 'center', vertical: 'middle' };
    if (i % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0F2038' },
      };
    }
  }
};

const typeLabel = (type: string) => type === 'food' ? '食品' : type === 'water' ? '水' : '药品';

export const exportMaterialConsumption = async (
  consumptions: MaterialConsumption[],
  month: string
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('物资消耗统计');

  worksheet.columns = [
    { header: '日期', key: 'date', width: 15 },
    { header: '物资名称', key: 'materialName', width: 20 },
    { header: '类型', key: 'type', width: 10 },
    { header: '数量', key: 'quantity', width: 10 },
    { header: '用途', key: 'purpose', width: 20 },
  ];

  styleHeader(worksheet);

  consumptions.forEach((item) => {
    worksheet.addRow({
      date: item.date,
      materialName: item.materialName,
      type: typeLabel(item.type),
      quantity: item.quantity,
      purpose: item.purpose,
    });
  });

  styleRows(worksheet, worksheet.rowCount);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `物资消耗统计_${month}.xlsx`);
};

export const exportDrillRecords = async (
  records: DrillRecord[],
  month: string
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('应急演练统计');

  worksheet.columns = [
    { header: '日期', key: 'date', width: 15 },
    { header: '演练名称', key: 'name', width: 25 },
    { header: '参与人数', key: 'participants', width: 12 },
    { header: '时长(分钟)', key: 'duration', width: 12 },
    { header: '结果', key: 'result', width: 10 },
    { header: '备注', key: 'notes', width: 30 },
  ];

  styleHeader(worksheet);

  records.forEach((item) => {
    const row = worksheet.addRow({
      date: item.date,
      name: item.name,
      participants: item.participants,
      duration: item.duration,
      result: item.result,
      notes: item.notes,
    });

    if (item.result === '优秀') {
      row.getCell('result').font = { color: { argb: 'FF00FF88' } };
    } else if (item.result === '良好') {
      row.getCell('result').font = { color: { argb: 'FFFFCC00' } };
    }
  });

  styleRows(worksheet, worksheet.rowCount);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `应急演练统计_${month}.xlsx`);
};

export const exportMonthlyReport = async (
  consumptions: MaterialConsumption[],
  records: DrillRecord[],
  approvals: PurchaseRequest[],
  month: string
) => {
  const workbook = new ExcelJS.Workbook();

  const consumptionSheet = workbook.addWorksheet('物资消耗统计');
  consumptionSheet.columns = [
    { header: '日期', key: 'date', width: 15 },
    { header: '物资名称', key: 'materialName', width: 20 },
    { header: '类型', key: 'type', width: 10 },
    { header: '数量', key: 'quantity', width: 10 },
    { header: '用途', key: 'purpose', width: 20 },
  ];
  styleHeader(consumptionSheet);
  consumptions.forEach((item) => {
    consumptionSheet.addRow({
      date: item.date,
      materialName: item.materialName,
      type: typeLabel(item.type),
      quantity: item.quantity,
      purpose: item.purpose,
    });
  });
  styleRows(consumptionSheet, consumptionSheet.rowCount);

  const drillSheet = workbook.addWorksheet('演练统计');
  drillSheet.columns = [
    { header: '日期', key: 'date', width: 15 },
    { header: '演练名称', key: 'name', width: 25 },
    { header: '参与人数', key: 'participants', width: 12 },
    { header: '时长(分钟)', key: 'duration', width: 12 },
    { header: '结果', key: 'result', width: 10 },
    { header: '备注', key: 'notes', width: 30 },
  ];
  styleHeader(drillSheet);
  records.forEach((item) => {
    drillSheet.addRow({
      date: item.date,
      name: item.name,
      participants: item.participants,
      duration: item.duration,
      result: item.result,
      notes: item.notes,
    });
  });
  styleRows(drillSheet, drillSheet.rowCount);

  const approvalSheet = workbook.addWorksheet('审批记录');
  approvalSheet.columns = [
    { header: '申请编号', key: 'requestId', width: 18 },
    { header: '申请日期', key: 'createdAt', width: 15 },
    { header: '申请人', key: 'applicant', width: 12 },
    { header: '物资明细', key: 'materials', width: 30 },
    { header: '当前状态', key: 'status', width: 12 },
    { header: '街道人防办', key: 'level1', width: 15 },
    { header: '区人防办', key: 'level2', width: 15 },
    { header: '市人防办', key: 'level3', width: 15 },
  ];
  styleHeader(approvalSheet);
  approvals.forEach((item) => {
    const getLevelStatus = (level: number) => {
      const record = item.approvalRecords.find((r) => r.level === level);
      if (!record || record.status === 'pending') return '待审批';
      if (record.status === 'approved') return `通过(${record.approver})`;
      return `拒绝(${record.approver})`;
    };

    approvalSheet.addRow({
      requestId: `#${item.id.slice(-6).toUpperCase()}`,
      createdAt: item.createdAt,
      applicant: item.applicant,
      materials: item.materials.map((m) => `${m.name}×${m.quantity}`).join(', '),
      status: item.status === 'approved' ? '已通过' : item.status === 'rejected' ? '已拒绝' : '待审批',
      level1: getLevelStatus(1),
      level2: getLevelStatus(2),
      level3: getLevelStatus(3),
    });
  });
  styleRows(approvalSheet, approvalSheet.rowCount);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `人防工程月度报告_${month}.xlsx`);
};
