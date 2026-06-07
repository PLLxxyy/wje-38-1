import ReactECharts from 'echarts-for-react';
import type { MinuteOrder } from '../types';

interface Props {
  data: MinuteOrder[];
}

export default function MinuteOrdersChart({ data }: Props) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17,24,39,0.95)',
      borderColor: '#374151',
      textStyle: { color: '#e5e7eb' },
    },
    grid: { left: 48, right: 16, top: 24, bottom: 32 },
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
    series: [
      {
        name: '订单量',
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
    ],
  };

  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col border border-gray-800">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">近一小时每分钟订单量</h3>
      <div className="flex-1 min-h-0">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
