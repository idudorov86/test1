import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { formatDateShort } from '../utils/dateUtils';

interface ChartsProps {
  revenueByManager: { name: string; fact: number; plan: number; department: string }[];
  revenueByDay: { date: string; fact: number }[];
}

const nf = new Intl.NumberFormat('ru-RU');

function formatMoneyTick(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)} млн`;
  if (value >= 1000) return `${Math.round(value / 1000)} тыс`;
  return String(value);
}

export default function Charts({ revenueByManager, revenueByDay }: ChartsProps) {
  const managerData = revenueByManager.map((m) => ({ ...m }));
  const dayData = revenueByDay.map((d) => ({ ...d, label: formatDateShort(d.date) }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Выручка по менеджерам */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-base font-semibold text-slate-800 mb-4">
          Выручка по менеджерам (Факт vs План)
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={managerData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={formatMoneyTick} width={60} />
            <Tooltip
              formatter={(value: number, name: string) => [`${nf.format(Math.round(value))} ₽`, name]}
              contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="fact" name="Факт" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="plan"
              name="План"
              fill="#fef3c7"
              stroke="#fcd34d"
              strokeWidth={1.5}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Динамика выручки по дням */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-base font-semibold text-slate-800 mb-4">
          Динамика выручки по дням
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={dayData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={formatMoneyTick} width={60} />
            <Tooltip
              formatter={(value: number) => [`${nf.format(Math.round(value))} ₽`, 'Выручка']}
              labelFormatter={(label: string) => `Дата: ${label}`}
              contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 13 }}
            />
            <Line
              type="monotone"
              dataKey="fact"
              name="Выручка"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
