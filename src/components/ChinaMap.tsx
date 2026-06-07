import ReactECharts from 'echarts-for-react';
import type { ProvinceData } from '../types';

interface Props {
  data: ProvinceData[];
  compareMode?: boolean;
  yesterdayData?: ProvinceData[];
  onSelect?: (name: string, value: number) => void;
}

export default function ChinaMap({ data, compareMode, yesterdayData, onSelect }: Props) {
  const yesterdayMap = new Map((yesterdayData || []).map((d) => [d.name, d.value]));

  const formatter = (p: any) => {
    const today = p.value || 0;
    const yesterday = yesterdayMap.get(p.name) || 0;
    if (compareMode && yesterdayData) {
      const diff = today - yesterday;
      const diffPercent = yesterday > 0 ? ((diff / yesterday) * 100).toFixed(1) : '0.0';
      const diffColor = diff >= 0 ? '#10b981' : '#ef4444';
      const diffSign = diff >= 0 ? '+' : '';
      return `${p.name}<br/>今日销售额: ¥${today.toLocaleString()}<br/>昨日同期: ¥${yesterday.toLocaleString()}<br/><span style="color:${diffColor}">${diffSign}${diff.toLocaleString()} (${diffSign}${diffPercent}%)</span>`;
    }
    return `${p.name}<br/>销售额: ¥${today.toLocaleString()}`;
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17,24,39,0.95)',
      borderColor: '#374151',
      textStyle: { color: '#e5e7eb' },
      formatter,
    },
    visualMap: {
      min: 0,
      max: 500000,
      left: 'left',
      bottom: 'bottom',
      text: ['高', '低'],
      textStyle: { color: '#9ca3af' },
      inRange: {
        color: ['#1e3a5f', '#1e6091', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
      },
      calculable: true,
    },
    series: [
      {
        name: '销售额',
        type: 'map',
        map: 'china',
        roam: false,
        emphasis: {
          label: { show: true, color: '#fff' },
          itemStyle: { areaColor: '#f59e0b' },
        },
        itemStyle: {
          areaColor: '#1f2937',
          borderColor: '#374151',
        },
        select: {
          itemStyle: { areaColor: '#f59e0b' },
          label: { color: '#fff' },
        },
        data: data.map((d) => ({ name: d.name, value: d.value })),
      },
    ],
  };

  const onChartClick = (params: any) => {
    if (onSelect && params?.name) {
      onSelect(params.name, params.value || 0);
    }
  };

  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col border border-gray-800">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">
        全国销售热力图
        {compareMode && (
          <span className="ml-2 text-xs text-cyan-400 font-normal">(含昨日对比)</span>
        )}
      </h3>
      <div className="flex-1 min-h-0">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          onEvents={{ click: onChartClick }}
        />
      </div>
    </div>
  );
}
