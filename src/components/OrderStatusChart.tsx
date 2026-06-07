import ReactECharts from 'echarts-for-react';
import type { OrderStatus } from '../types';

interface Props {
  data: OrderStatus[];
  compareMode?: boolean;
  yesterdayData?: OrderStatus[];
  isRefreshing?: boolean;
}

export default function OrderStatusChart({ data, compareMode, yesterdayData, isRefreshing = true }: Props) {
  const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

  let option: any;

  if (compareMode && yesterdayData) {
    option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
      },
      legend: {
        top: 0,
        right: 0,
        textStyle: { color: '#9ca3af', fontSize: 11 },
        itemWidth: 16,
        itemHeight: 8,
      },
      grid: { left: 56, right: 24, top: 32, bottom: 16 },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.name),
        axisLine: { lineStyle: { color: '#374151' } },
        axisLabel: { color: '#9ca3af', fontSize: 10 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#1f2937' } },
        axisLabel: { color: '#9ca3af' },
      },
      series: [
        {
          name: '昨日',
          type: 'bar',
          data: yesterdayData.map((d, i) => ({
            value: d.value,
            itemStyle: { color: 'rgba(6,182,212,0.4)', borderRadius: [4, 4, 0, 0] },
          })),
          barWidth: 16,
          barGap: '30%',
        },
        {
          name: '今日',
          type: 'bar',
          data: data.map((d, i) => ({
            value: d.value,
            itemStyle: { color: colors[i % colors.length], borderRadius: [4, 4, 0, 0] },
          })),
          barWidth: 16,
        },
      ],
    };
  } else {
    option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { color: '#9ca3af', fontSize: 11 },
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          name: '订单状态',
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#111827',
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#e5e7eb',
            },
          },
          labelLine: { show: false },
          data: data.map((d, i) => ({
            ...d,
            itemStyle: { color: colors[i % colors.length] },
          })),
        },
      ],
    };
  }

  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col border border-gray-800">
      <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
        订单状态分布
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
