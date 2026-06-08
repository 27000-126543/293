import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { DrillRecord, MaterialConsumption } from '@/types';

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

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, size: 12, color: { argb: 'FF00D4FF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0A1628' },
  };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  consumptions.forEach((item, index) => {
    const row = worksheet.addRow({
      date: item.date,
      materialName: item.materialName,
      type: item.type === 'food' ? '食品' : item.type === 'water' ? '水' : '药品',
      quantity: item.quantity,
      purpose: item.purpose,
    });

    row.alignment = { horizontal: 'center', vertical: 'middle' };

    if (index % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0F2038' },
      };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
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

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, size: 12, color: { argb: 'FF00D4FF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0A1628' },
  };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  records.forEach((item, index) => {
    const row = worksheet.addRow({
      date: item.date,
      name: item.name,
      participants: item.participants,
      duration: item.duration,
      result: item.result,
      notes: item.notes,
    });

    row.alignment = { horizontal: 'center', vertical: 'middle' };

    if (item.result === '优秀') {
      row.getCell('result').font = { color: { argb: 'FF00FF88' } };
    } else if (item.result === '良好') {
      row.getCell('result').font = { color: { argb: 'FFFFCC00' } };
    }

    if (index % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0F2038' },
      };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `应急演练统计_${month}.xlsx`);
};

export const exportMonthlyReport = async (
  consumptions: MaterialConsumption[],
  records: DrillRecord[],
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

  const drillSheet = workbook.addWorksheet('应急演练统计');
  drillSheet.columns = [
    { header: '日期', key: 'date', width: 15 },
    { header: '演练名称', key: 'name', width: 25 },
    { header: '参与人数', key: 'participants', width: 12 },
    { header: '时长(分钟)', key: 'duration', width: 12 },
    { header: '结果', key: 'result', width: 10 },
    { header: '备注', key: 'notes', width: 30 },
  ];

  [consumptionSheet, drillSheet].forEach((sheet) => {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, size: 12, color: { argb: 'FF00D4FF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0A1628' },
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  consumptions.forEach((item, index) => {
    const row = consumptionSheet.addRow({
      date: item.date,
      materialName: item.materialName,
      type: item.type === 'food' ? '食品' : item.type === 'water' ? '水' : '药品',
      quantity: item.quantity,
      purpose: item.purpose,
    });
    row.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  records.forEach((item, index) => {
    const row = drillSheet.addRow({
      date: item.date,
      name: item.name,
      participants: item.participants,
      duration: item.duration,
      result: item.result,
      notes: item.notes,
    });
    row.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `人防工程月度报告_${month}.xlsx`);
};
