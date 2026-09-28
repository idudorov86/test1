import * as XLSX from 'xlsx';
import type { Manager, DailyData, Totals, ManagerPlan, ParsedData } from '../types';
import { excelDateToMoscowString } from './dateUtils';

export function parseExcelFile(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) { reject(new Error('Не удалось прочитать файл')); return; }
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false, dateNF: 'yyyy-mm-dd' });
        const parseLog: string[] = [];
        parseLog.push(`Файл прочитан. Строк: ${rows.length}`);

        const managers = parseManagers(rows, parseLog);
        parseLog.push(`Найдено менеджеров: ${managers.length}`);

        const { dailyData, plansData } = parseAllData(rows, managers, parseLog);
        parseLog.push(`Распарсено дней: ${dailyData.length}`);
        parseLog.push(`Распарсено планов: ${plansData.length}`);

        const totals = extractTotals(rows, parseLog);

        const plans = plansData.map(p => ({
          ...p,
          avgCheck: p.successful > 0 ? p.fact / p.successful : 0,
        }));

        parseLog.push(`ИТОГО: План=${totals.totalPlan}, Факт=${totals.totalFact}, %=${(totals.totalPercent * 100).toFixed(1)}%, Заказы=${totals.totalSuccessful}, Ср.чек=${totals.avgCheck}`);

        resolve({ managers, dailyData, totals, plans, rawRowCount: rows.length, parseLog });
      } catch (error) { reject(error); }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsArrayBuffer(file);
  });
}

function parseManagers(rows: any[][], log: string[]): Manager[] {
  const managers: Manager[] = [];
  const row1 = rows[1] || [];

  for (let c = 2; c <= 30; c += 4) {
    const name = String(row1[c] || '').trim();
    if (!name || name.includes('Автоматические заказы') || name.includes('автоматические')) {
      if (name) log.push(`Пропущен: "${name}" (столбец ${c})`);
      continue;
    }

    let department = '';
    if (c >= 2 && c <= 18) {
      department = 'МРК';
    } else if (c >= 22 && c <= 30) {
      department = 'МВЛ';
    }

    managers.push({ name, department, startCol: c });
  }

  return managers;
}

function parseAllData(rows: any[][], managers: Manager[], log: string[]): { dailyData: DailyData[]; plansData: ManagerPlan[] } {
  const dailyData: DailyData[] = [];
  const plansData: ManagerPlan[] = [];

  let plansHeaderRow = -1;
  let totalsRow = -1;

  for (let r = 3; r < rows.length; r++) {
    const row = rows[r];
    if (!row) continue;

    for (let c = 0; c < Math.min(row.length, 10); c++) {
      const cell = String(row[c] || '').trim().toUpperCase();
      if (cell.includes('ПЛАНЫ ЛИЧНЫЕ')) {
        plansHeaderRow = r;
        log.push(`Заголовок ПЛАНЫ ЛИЧНЫЕ найден на строке ${r}`);
        break;
      }
    }

    const firstCell = String(row[0] || '').trim().toUpperCase();
    const secondCell = String(row[1] || '').trim().toUpperCase();
    if (firstCell.includes('ИТОГО') || secondCell.includes('ИТОГО')) {
      totalsRow = r;
      log.push(`Строка ИТОГО найдена на индексе ${r}`);
    }
  }

  const dailyEnd = plansHeaderRow > 0 ? plansHeaderRow : (totalsRow > 0 ? totalsRow : rows.length);

  for (let r = 3; r < dailyEnd; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const dateValue = row[0];
    const dateStr = excelDateToMoscowString(dateValue);
    if (!dateStr) continue;

    const dayData: DailyData = { date: dateStr, managers: {} };

    for (const manager of managers) {
      const sc = manager.startCol;
      dayData.managers[manager.name] = {
        purchased: parseNumber(row[sc]),
        ordered: parseNumber(row[sc + 1]),
        successful: parseNumber(row[sc + 2]),
        cancelled: parseNumber(row[sc + 3]),
      };
    }

    dailyData.push(dayData);
  }

  if (plansHeaderRow > 0) {
    const plansEnd = totalsRow > 0 ? totalsRow : rows.length;

    for (let r = plansHeaderRow + 1; r < plansEnd; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      const shortName = String(row[1] || '').trim();
      if (!shortName) continue;

      const surname = shortName.split(' ')[0].toLowerCase();
      const matchedManager = managers.find(m => {
        const mSurname = m.name.split(' ')[0].toLowerCase();
        return mSurname === surname;
      });

      if (!matchedManager) {
        log.push(`Не найден менеджер для имени: "${shortName}"`);
        continue;
      }

      const plan = matchedManager.department === 'МРК' ? parseNumber(row[3]) : 0;
      const fact = parseNumber(row[4]);
      const percentRaw = parseNumber(row[5]);
      const successful = parseNumber(row[7]);
      const avgCheck = parseNumber(row[11]);

      const percent = percentRaw > 1 ? percentRaw / 100 : percentRaw;

      log.push(`План: ${matchedManager.name} (${matchedManager.department}), План=${plan}, Факт=${fact}, Заказы=${successful}, Ср.чек=${avgCheck}`);

      plansData.push({
        name: matchedManager.name,
        department: matchedManager.department,
        plan,
        fact,
        percent,
        successful,
        avgCheck,
      });
    }
  }

  return { dailyData, plansData };
}

function extractTotals(rows: any[][], log: string[]): Totals {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row) continue;

    const firstCell = String(row[0] || '').trim().toUpperCase();
    const secondCell = String(row[1] || '').trim().toUpperCase();

    if (firstCell.includes('ИТОГО') || secondCell.includes('ИТОГО')) {
      let totalPercent = parseNumber(row[5]);
      if (totalPercent > 1) {
        totalPercent = totalPercent / 100;
      }

      return {
        totalPlan: parseNumber(row[3]),
        totalFact: parseNumber(row[4]),
        totalPercent: totalPercent,
        totalSuccessful: parseNumber(row[7]),
        avgCheck: parseNumber(row[11]),
      };
    }
  }

  log.push('ВНИМАНИЕ: Строка ИТОГО не найдена!');
  return { totalPlan: 0, totalFact: 0, totalPercent: 0, totalSuccessful: 0, avgCheck: 0 };
}

function parseNumber(value: any): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const str = String(value).trim().replace(/,/g, '').replace(/\s/g, '').replace('%', '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}
