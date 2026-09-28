import type { FilterState, Manager } from '../types';

interface SidebarProps {
  managers: Manager[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const DEPARTMENTS = ['Все', 'МРК', 'МВЛ'];

const DEPT_STYLES: { [key: string]: { badge: string; accent: string } } = {
  'МРК': { badge: 'bg-violet-100 text-violet-700', accent: 'accent-violet-600' },
  'МВЛ': { badge: 'bg-emerald-100 text-emerald-700', accent: 'accent-emerald-600' },
};

export default function Sidebar({ managers, filters, onFiltersChange }: SidebarProps) {
  const visibleManagers =
    filters.department === 'Все'
      ? managers
      : managers.filter((m) => m.department === filters.department);

  const toggleManager = (name: string) => {
    const isSelected = filters.selectedManagers.includes(name);
    const selectedManagers = isSelected
      ? filters.selectedManagers.filter((n) => n !== name)
      : [...filters.selectedManagers, name];
    onFiltersChange({ ...filters, selectedManagers });
  };

  const selectAll = () => {
    onFiltersChange({ ...filters, selectedManagers: managers.map((m) => m.name) });
  };

  const clearAll = () => {
    onFiltersChange({ ...filters, selectedManagers: [] });
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 p-4 flex flex-col gap-6">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Фильтр по группе
        </h2>
        <div className="flex flex-col gap-1">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => onFiltersChange({ ...filters, department: dept })}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  filters.department === dept
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              {dept}
              {dept === 'МРК' && (
                <span className="ml-2 text-[10px] opacity-70">Менеджеры по работе с клиентами</span>
              )}
              {dept === 'МВЛ' && (
                <span className="ml-2 text-[10px] opacity-70">Менеджеры входящей линии</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Менеджеры
          </h2>
          <div className="flex gap-1">
            <button
              onClick={selectAll}
              className="text-[11px] text-blue-600 hover:underline"
            >
              Все
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={clearAll}
              className="text-[11px] text-slate-500 hover:underline"
            >
              Снять
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto">
          {visibleManagers.map((mgr) => {
            const style = DEPT_STYLES[mgr.department] || { badge: 'bg-slate-100 text-slate-700', accent: 'accent-slate-600' };
            const checked = filters.selectedManagers.includes(mgr.name);
            return (
              <label
                key={mgr.name}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors
                  ${checked ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleManager(mgr.name)}
                  className={`w-4 h-4 ${style.accent}`}
                />
                <span className="text-slate-700 truncate">{mgr.name}</span>
                <span
                  className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${style.badge}`}
                >
                  {mgr.department}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-auto text-[11px] text-slate-400">
        Выбрано: {filters.selectedManagers.length} из {managers.length}
      </div>
    </aside>
  );
}
