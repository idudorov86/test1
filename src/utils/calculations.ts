import type { DailyData, Manager, ManagerPlan, Totals } from '../types';

export function calculateKPIs(
  dailyData: DailyData[],
  selectedManagers: string[],
  totals: Totals,
  plans: ManagerPlan[],
  allSelected: boolean
) {
  if (allSelected) {
    return {
      factRevenue: totals.totalFact,
      planRevenue: totals.totalPlan,
      percentPlan: totals.totalPercent * 100,
      totalOrders: totals.totalSuccessful,
      conversion: 0,
      avgCheck: totals.avgCheck,
    };
  }

  let factRevenue = 0, totalOrders = 0, planRevenue = 0;

  for (const mgrName of selectedManagers) {
    const planData = plans.find(p => p.name === mgrName);
    if (planData) {
      factRevenue += planData.fact;
      totalOrders += planData.successful;
      planRevenue += planData.plan;
    }
  }

  let totalOrdered = 0;
  for (const day of dailyData) {
    for (const mgrName of selectedManagers) {
      const data = day.managers[mgrName];
      if (data) totalOrdered += data.ordered;
    }
  }

  const percentPlan = planRevenue > 0 ? (factRevenue / planRevenue) * 100 : 0;
  const conversion = totalOrdered > 0 ? (totalOrders / totalOrdered) * 100 : 0;
  const avgCheck = totalOrders > 0 ? factRevenue / totalOrders : 0;

  return {
    factRevenue: Math.round(factRevenue),
    planRevenue: Math.round(planRevenue),
    percentPlan,
    totalOrders,
    conversion,
    avgCheck: Math.round(avgCheck)
  };
}

export function calculateTotalConversion(dailyData: DailyData[], selectedManagers: string[]): number {
  let totalSuccessful = 0, totalOrdered = 0;
  for (const day of dailyData) {
    for (const mgrName of selectedManagers) {
      const data = day.managers[mgrName];
      if (data) { totalSuccessful += data.successful; totalOrdered += data.ordered; }
    }
  }
  return totalOrdered > 0 ? (totalSuccessful / totalOrdered) * 100 : 0;
}

export function getRevenueByManager(dailyData: DailyData[], managers: Manager[], selectedManagers: string[], plans: ManagerPlan[]) {
  const result: { name: string; fact: number; plan: number; department: string }[] = [];

  for (const mgrName of selectedManagers) {
    const manager = managers.find(m => m.name === mgrName);
    const planData = plans.find(p => p.name === mgrName);

    const fact = planData ? planData.fact : 0;
    const plan = planData ? planData.plan : 0;

    result.push({
      name: mgrName.split(' ')[0] || mgrName,
      fact: Math.round(fact),
      plan,
      department: manager?.department || ''
    });
  }

  return result;
}

export function getRevenueByDay(dailyData: DailyData[], selectedManagers: string[]) {
  return dailyData.map(day => {
    let fact = 0;
    for (const mgrName of selectedManagers) {
      const data = day.managers[mgrName];
      if (data) fact += data.purchased;
    }
    return { date: day.date, fact: Math.round(fact) };
  });
}

export function getLeaderboardData(dailyData: DailyData[], managers: Manager[], selectedManagers: string[], plans: ManagerPlan[]) {
  const result: { name: string; department: string; fact: number; plan: number; percent: number; orders: number; conversion: number; avgCheck: number }[] = [];

  for (const mgrName of selectedManagers) {
    const manager = managers.find(m => m.name === mgrName);
    const planData = plans.find(p => p.name === mgrName);

    const fact = planData ? planData.fact : 0;
    const planValue = planData ? planData.plan : 0;
    const orders = planData ? planData.successful : 0;
    const avgCheck = planData ? planData.avgCheck : 0;

    let ordered = 0;
    for (const day of dailyData) {
      const data = day.managers[mgrName];
      if (data) ordered += data.ordered;
    }

    const percent = planValue > 0 ? (fact / planValue) * 100 : 0;
    const conversion = ordered > 0 ? (orders / ordered) * 100 : 0;

    result.push({
      name: mgrName,
      department: manager?.department || '',
      fact: Math.round(fact),
      plan: planValue,
      percent,
      orders,
      conversion,
      avgCheck: Math.round(avgCheck)
    });
  }

  result.sort((a, b) => b.percent - a.percent);
  return result;
}
