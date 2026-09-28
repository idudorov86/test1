import { useMemo, useState } from 'react';
import { UploadCloud, BarChart3 } from 'lucide-react';
import type { FilterState, ParsedData } from './types';
import { parseExcelFile } from './utils/parser';
import { calculateKPIs, getRevenueByManager, getRevenueByDay, getLeaderboardData } from './utils/calculations';
import FileUpload from './components/FileUpload';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
import Charts from './components/Charts';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ department: 'Все', selectedManagers: [] });

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseExcelFile(file);
      setData(parsed);
      // По умолчанию выбраны все менеджеры
      setFilters({
        department: 'Все',
        selectedManagers: parsed.managers.map((m) => m.name),
      });
    } catch (e: any) {
      setError(e?.message || 'Ошибка при обработке файла');
    } finally {
      setLoading(false);
    }
  };

  const allSelected = useMemo(() => {
    if (!data) return false;
    return filters.selectedManagers.length === data.managers.length;
  }, [data, filters]);

  const kpis = useMemo(() => {
    if (!data) return null;
    return calculateKPIs(data.dailyData, filters.selectedManagers, data.totals, data.plans, allSelected);
  }, [data, filters, allSelected]);

  const revenueByManager = useMemo(() => {
    if (!data) return [];
    return getRevenueByManager(data.dailyData, data.managers, filters.selectedManagers, data.plans);
  }, [data, filters]);

  const revenueByDay = useMemo(() => {
    if (!data) return [];
    return getRevenueByDay(data.dailyData, filters.selectedManagers);
  }, [data, filters]);

  const leaderboard = useMemo(() => {
    if (!data) return [];
    return getLeaderboardData(data.dailyData, data.managers, filters.selectedManagers, data.plans);
  }, [data, filters]);

  if (!data) {
    return <FileUpload onFile={handleFile} loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar managers={data.managers} filters={filters} onFiltersChange={setFilters} />

      <main className="flex-1 p-6 overflow-x-hidden">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Дашборд аналитики отчетов УВПК</h1>
              <p className="text-xs text-slate-500">
                Период:{' '}
                {data.dailyData.length > 0
                  ? `${data.dailyData[0].date} — ${data.dailyData[data.dailyData.length - 1].date}`
                  : '—'}
                {' · '}Менеджеров: {data.managers.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setData(null);
              setError(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            Загрузить другой файл
          </button>
        </header>

        {kpis && <KPICards kpis={kpis} />}

        <div className="mt-4">
          <Charts revenueByManager={revenueByManager} revenueByDay={revenueByDay} />
        </div>

        <div className="mt-4">
          <Leaderboard data={leaderboard} />
        </div>
      </main>
    </div>
  );
}
