import type { DailyData, Manager, ManagerPlan, ParsedData, Totals } from '../types';

// Генератор демо-данных для проверки работы дашборда без Excel-файла.
// Структура полностью повторяет данные после парсинга реального файла.

const DEMO_MANAGERS: Manager[] = [
  { name: 'Давыдова Елена', department: 'МРК', startCol: 2 },
  { name: 'Белоусова Екатерина', department: 'МРК', startCol: 6 },
  { name: 'Кетчуанг Ксения', department: 'МРК', startCol: 10 },
  { name: 'Краснова Светлана', department: 'МРК', startCol: 14 },
  { name: 'Дрожжина Светлана', department: 'МРК', startCol: 18 },
  { name: 'Загуменнова Марина', department: 'МВЛ', startCol: 22 },
  { name: 'Темнышова Татьяна', department: 'МВЛ', startCol: 26 },
  { name: 'Агалямова Аэлита', department: 'МВЛ', startCol: 30 },
];

const DEMO_PLANS_META: { name: string; plan: number; fact: number; successful: number }[] = [
  { name: 'Давыдова Елена', plan: 4200000, fact: 4315708.94, successful: 314 },
  { name: 'Белоусова Екатерина', plan: 4500000, fact: 4102334.12, successful: 352 },
  { name: 'Кетчуанг Ксения', plan: 4300000, fact: 3998451.55, successful: 301 },
  { name: 'Краснова Светлана', plan: 5200000, fact: 4210987.33, successful: 340 },
  { name: 'Дрожжина Светлана', plan: 4800000, fact: 4100000.00, successful: 240 },
  { name: 'Загуменнова Марина', plan: 0, fact: 421191.27, successful: 36 },
  { name: 'Темнышова Татьяна', plan: 0, fact: 451620.80, successful: 55 },
  { name: 'Агалямова Аэлита', plan: 0, fact: 400000.00, successful: 243 },
];

export function generateDemoData(): ParsedData {
  const dailyData: DailyData[] = [];

  // 26 дней: с 1 по 26 августа 2026
  for (let day = 1; day <= 26; day++) {
    const dateStr = `2026-08-${String(day).padStart(2, '0')}`;
    const managersData: DailyData['managers'] = {};

    for (const mgr of DEMO_MANAGERS) {
      const meta = DEMO_PLANS_META.find(p => p.name === mgr.name)!;
      // Распределяем факт по дням с небольшим "шумом"
      const baseFact = meta.fact / 26;
      const noise = 1 + (Math.sin(day * 3.7 + mgr.startCol) * 0.25);
      const purchased = Math.round(baseFact * noise * 100) / 100;
      const ordered = Math.round(purchased * 1.18 * 100) / 100;
      const successfulShare = meta.successful > 0 ? meta.successful / 26 : 0;
      const successful = Math.round(successfulShare * noise);
      const cancelled = Math.max(0, Math.round(successfulShare * 0.2));

      managersData[mgr.name] = { purchased, ordered, successful, cancelled };
    }

    dailyData.push({ date: dateStr, managers: managersData });
  }

  const plans: ManagerPlan[] = DEMO_PLANS_META.map(p => ({
    name: p.name,
    department: DEMO_MANAGERS.find(m => m.name === p.name)!.department,
    plan: p.plan,
    fact: p.fact,
    percent: p.plan > 0 ? p.fact / p.plan : 0,
    successful: p.successful,
    avgCheck: p.successful > 0 ? p.fact / p.successful : 0,
  }));

  const totalPlan = plans.reduce((s, p) => s + p.plan, 0);
  const totalFact = plans.reduce((s, p) => s + p.fact, 0);
  const totalSuccessful = plans.reduce((s, p) => s + p.successful, 0);

  const totals: Totals = {
    totalPlan,
    totalFact,
    totalPercent: totalPlan > 0 ? totalFact / totalPlan : 0,
    totalSuccessful,
    avgCheck: totalSuccessful > 0 ? totalFact / totalSuccessful : 0,
  };

  const parseLog: string[] = [
    'ДЕМО-РЕЖИМ: данные сгенерированы, файл не загружался',
    `Найдено менеджеров: ${DEMO_MANAGERS.length}`,
    `Распарсено дней: ${dailyData.length}`,
    `Распарсено планов: ${plans.length}`,
  ];

  return {
    managers: DEMO_MANAGERS,
    dailyData,
    totals,
    plans,
    rawRowCount: dailyData.length,
    parseLog,
  };
}
