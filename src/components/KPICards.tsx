import { Wallet, Target, ShoppingCart, TrendingUp, Receipt } from 'lucide-react';

interface KPI {
  factRevenue: number;
  planRevenue: number;
  percentPlan: number;
  totalOrders: number;
  conversion: number;
  avgCheck: number;
}

interface KPICardsProps {
  kpis: KPI;
}

const nf = new Intl.NumberFormat('ru-RU');

function formatMoney(value: number): string {
  return `${nf.format(Math.round(value))} ₽`;
}

export default function KPICards({ kpis }: KPICardsProps) {
  const percentColor =
    kpis.percentPlan >= 100
      ? 'from-green-500 to-emerald-600'
      : kpis.percentPlan >= 80
        ? 'from-yellow-400 to-amber-500'
        : 'from-red-500 to-rose-600';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Факт выручки */}
      <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">Факт выручки</span>
          <Wallet className="w-5 h-5 opacity-80" />
        </div>
        <div className="text-2xl font-bold leading-tight">{formatMoney(kpis.factRevenue)}</div>
        <div className="mt-2 text-xs opacity-80">План: {formatMoney(kpis.planRevenue)}</div>
      </div>

      {/* % выполнения плана */}
      <div className={`rounded-2xl p-5 text-white bg-gradient-to-br ${percentColor} shadow-lg`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">% Выполнения Плана</span>
          <Target className="w-5 h-5 opacity-80" />
        </div>
        <div className="text-2xl font-bold leading-tight">
          {kpis.percentPlan.toFixed(1)}%
        </div>
        <div className="mt-2 text-xs opacity-80">(Факт / План) × 100%</div>
      </div>

      {/* Кол-во заказов */}
      <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">Кол-во заказов</span>
          <ShoppingCart className="w-5 h-5 opacity-80" />
        </div>
        <div className="text-2xl font-bold leading-tight">{nf.format(kpis.totalOrders)} шт.</div>
        <div className="mt-2 text-xs opacity-80">Выкупленные (шт.)</div>
      </div>

      {/* Выкупаемость */}
      <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">Выкупаемость</span>
          <TrendingUp className="w-5 h-5 opacity-80" />
        </div>
        <div className="text-2xl font-bold leading-tight">{kpis.conversion.toFixed(1)}%</div>
        <div className="mt-2 text-xs opacity-80">Конверсия (успешные / оформленные)</div>
      </div>

      {/* Средний чек */}
      <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">Средний чек</span>
          <Receipt className="w-5 h-5 opacity-80" />
        </div>
        <div className="text-2xl font-bold leading-tight">{formatMoney(kpis.avgCheck)}</div>
        <div className="mt-2 text-xs opacity-80">Факт / Кол-во заказов</div>
      </div>
    </div>
  );
}
