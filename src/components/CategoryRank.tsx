import ReactECharts from 'echarts-for-react';
import type { CategoryRank } from '../types';

interface Props {
  data: CategoryRank[];
  compareMode?: boolean;
  yesterdayData?: CategoryRank[];
}

export default function CategoryRankChart({ data, compareMode, yesterdayData }: Props) {
  const series: any[] = [];

  if (compareMode && yesterdayData) {
    const yesterdayMap = new Map(yesterdayData.map((d) => [d.name, d.value]));
    series.push({
      name: '昨日',
      type: 'bar',
      data: data.map((d) => ({
        value: yesterdayMap.get(d.name) || 0,
        itemStyle: { color: 'rgba(6,182,212,0.3)', borderRadius: [0, 4, 4, 0] },
      })).reverse(),
      barWidth: 10,
      barGap: '30%',
      label: {
        show: false,
      },
    });
  }

  series.push({
    name: '今日',
    type: 'bar',
    data: data.map((d) => ({
      value: d.value,
      itemStyle: { color: d.color, borderRadius: [0, 4, 4, 0] },
    })).reverse(),
    barWidth: 14,
    label: {
      show: true,
      position: 'right',
      color: '#9ca3af',
      fontSize: 10,
      formatter: (p: any) => (p.value >= 10000 ? (p.value / 10000).toFixed(1) + '万' : p.value),
    },
  });

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(17,24,39,0.95)',
      borderColor: '#374151',
      textStyle: { color: '#e5e7eb' },
    },
    legend: {
      show: compareMode,
      top: 0,
      right: 0,
      textStyle: { color: '#9ca3af', fontSize: 11 },
      itemWidth: 16,
      itemHeight: 8,
    },
    grid: { left: 80, right: 48, top: compareMode ? 32 : 16, bottom: 16 },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1f2937' } },
      axisLabel: { color: '#9ca3af', formatter: (v: number) => (v >= 10000 ? (v / 10000) + '万' : v) },
    },
    yAxis: {
      type: 'category',
      data: data.map((d) => d.name).reverse(),
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#e5e7eb', fontSize: 11 },
      axisTick: { show: false },
    },
    series,
  };

  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col border border-gray-800">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">品类销售排行榜</h3>
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
