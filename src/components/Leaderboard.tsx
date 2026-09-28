import { useState } from 'react';
import { ArrowUpDown, Trophy } from 'lucide-react';

export interface LeaderboardRow {
  name: string;
  department: string;
  fact: number;
  plan: number;
  percent: number;
  orders: number;
  conversion: number;
  avgCheck: number;
}

interface LeaderboardProps {
  data: LeaderboardRow[];
}

const nf = new Intl.NumberFormat('ru-RU');

type SortKey = keyof Pick<
  LeaderboardRow,
  'name' | 'department' | 'fact' | 'plan' | 'percent' | 'orders' | 'conversion' | 'avgCheck'
>;

export default function Leaderboard({ data }: LeaderboardProps) {
  const [sortKey, setSortKey] = useState<SortKey>('percent');
  const [sortDesc, setSortDesc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    let cmp: number;
    if (typeof av === 'string' && typeof bv === 'string') {
      cmp = av.localeCompare(bv, 'ru');
    } else {
      cmp = Number(av) - Number(bv);
    }
    return sortDesc ? -cmp : cmp;
  });

  const rowHighlight = (row: LeaderboardRow): string => {
    if (row.plan <= 0) return ''; // план отсутствует (МВЛ) — без подсветки
    if (row.percent >= 100) return 'bg-green-50';
    if (row.percent < 80) return 'bg-red-50';
    return '';
  };

  const percentColor = (row: LeaderboardRow): string => {
    if (row.percent >= 100) return 'text-green-600 font-bold';
    if (row.percent >= 80) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const columns: { key: SortKey | null; label: string; align?: string }[] = [
    { key: null, label: '#' },
    { key: 'name', label: 'Менеджер' },
    { key: 'department', label: 'Гр.' },
    { key: 'fact', label: 'Факт', align: 'text-right' },
    { key: 'plan', label: 'План', align: 'text-right' },
    { key: 'percent', label: '% Выполн.', align: 'text-right' },
    { key: 'orders', label: 'Заказов', align: 'text-right' },
    { key: 'conversion', label: 'Конв. %', align: 'text-right' },
    { key: 'avgCheck', label: 'Ср. чек', align: 'text-right' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 pb-3 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-semibold text-slate-800">Рейтинг менеджеров</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
              {columns.map((col) => (
                <th
                  key={col.label}
                  className={`px-4 py-2.5 font-semibold whitespace-nowrap ${col.align || 'text-left'}`}
                >
                  {col.key ? (
                    <button
                      onClick={() => handleSort(col.key as SortKey)}
                      className={`inline-flex items-center gap-1 hover:text-blue-600 transition-colors ${
                        sortKey === col.key ? 'text-blue-600' : ''
                      }`}
                    >
                      {col.label}
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr
                key={row.name}
                className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${rowHighlight(row)}`}
              >
                <td className="px-4 py-2.5 text-slate-400 font-medium">{idx + 1}</td>
                <td className="px-4 py-2.5 text-slate-800 whitespace-nowrap">
                  {row.percent >= 100 && <span className="mr-1.5">🏆</span>}
                  {row.name}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      row.department === 'МРК'
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {row.department}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                  {nf.format(row.fact)} ₽
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">
                  {row.plan > 0 ? `${nf.format(row.plan)} ₽` : '—'}
                </td>
                <td className={`px-4 py-2.5 text-right tabular-nums ${row.plan > 0 ? percentColor(row) : 'text-slate-400'}`}>
                  {row.plan > 0 ? `${row.percent.toFixed(1)}%` : '—'}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                  {nf.format(row.orders)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                  {row.conversion.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                  {nf.format(row.avgCheck)} ₽
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                  Нет данных — выберите менеджеров в фильтрах
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
