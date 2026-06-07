import ReactECharts from 'echarts-for-react';
import type { MinuteOrder } from '../types';

interface Props {
  data: MinuteOrder[];
  compareMode?: boolean;
  yesterdayData?: MinuteOrder[];
  isRefreshing?: boolean;
}

export default function MinuteOrdersChart({ data, compareMode, yesterdayData, isRefreshing = true }: Props) {
  const series: any[] = [
    {
      name: '今日订单量',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { color: '#f59e0b', width: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(245,158,11,0.4)' },
            { offset: 1, color: 'rgba(245,158,11,0.05)' },
          ],
        },
      },
      data: data.map((d) => d.value),
    },
  ];

  if (compareMode && yesterdayData) {
    series.push({
      name: '昨日订单量',
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: { color: '#06b6d4', width: 2, type: 'dashed' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(6,182,212,0.2)' },
            { offset: 1, color: 'rgba(6,182,212,0.02)' },
          ],
        },
      },
      data: yesterdayData.map((d) => d.value),
    });
  }

  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
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
    grid: { left: 48, right: 16, top: compareMode ? 32 : 24, bottom: 32 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((d) => d.time),
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#9ca3af', fontSize: 10, interval: 9 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#1f2937' } },
      axisLabel: { color: '#9ca3af' },
    },
    series,
  };

  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col border border-gray-800">
      <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
        近一小时每分钟订单量
        <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
          isRefreshing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
        }`} />
      </h3>
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
