import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { ProvinceData } from '../types';

type MapViewMode = 'today' | 'yesterday' | 'diff';

interface Props {
  data: ProvinceData[];
  compareMode?: boolean;
  yesterdayData?: ProvinceData[];
  isRefreshing?: boolean;
  onSelect?: (name: string, value: number) => void;
}

export default function ChinaMap({ data, compareMode, yesterdayData, isRefreshing = true, onSelect }: Props) {
  const [viewMode, setViewMode] = useState<MapViewMode>('today');

  const yesterdayMap = new Map((yesterdayData || []).map((d) => [d.name, d.value]));

  const getDisplayData = () => {
    if (!compareMode || !yesterdayData) {
      return data.map((d) => ({ name: d.name, value: d.value }));
    }
    switch (viewMode) {
      case 'yesterday':
        return yesterdayData.map((d) => ({ name: d.name, value: d.value }));
      case 'diff':
        return data.map((d) => {
          const yesterday = yesterdayMap.get(d.name) || 0;
          return { name: d.name, value: d.value - yesterday };
        });
      default:
        return data.map((d) => ({ name: d.name, value: d.value }));
    }
  };

  const getVisualMap = () => {
    if (!compareMode || viewMode === 'today') {
      return {
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
      };
    }
    if (viewMode === 'yesterday') {
      return {
        min: 0,
        max: 500000,
        left: 'left',
        bottom: 'bottom',
        text: ['高', '低'],
        textStyle: { color: '#9ca3af' },
        inRange: {
          color: ['#164e63', '#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9'],
        },
        calculable: true,
      };
    }
    return {
      min: -200000,
      max: 200000,
      left: 'left',
      bottom: 'bottom',
      text: ['增长', '下降'],
      textStyle: { color: '#9ca3af' },
      inRange: {
        color: ['#dc2626', '#ef4444', '#f87171', '#374151', '#10b981', '#34d399', '#6ee7b7'],
      },
      calculable: true,
    };
  };

  const getEmphasisColor = () => {
    if (!compareMode || viewMode === 'today') return '#f59e0b';
    if (viewMode === 'yesterday') return '#06b6d4';
    return '#8b5cf6';
  };

  const formatter = (p: any) => {
    const today = data.find((d) => d.name === p.name)?.value || 0;
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

  const displayData = getDisplayData();
  const visualMap = getVisualMap();
  const emphasisColor = getEmphasisColor();

  const option: any = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17,24,39,0.95)',
      borderColor: '#374151',
      textStyle: { color: '#e5e7eb' },
      formatter,
    },
    visualMap,
    series: [
      {
        name: '销售额',
        type: 'map',
        map: 'china',
        roam: false,
        emphasis: {
          label: { show: true, color: '#fff' },
          itemStyle: { areaColor: emphasisColor },
        },
        itemStyle: {
          areaColor: '#1f2937',
          borderColor: '#374151',
        },
        select: {
          itemStyle: { areaColor: emphasisColor },
          label: { color: '#fff' },
        },
        data: displayData,
      },
    ],
  };

  const onChartClick = (params: any) => {
    if (onSelect && params?.name) {
      const todayVal = data.find((d) => d.name === params.name)?.value || 0;
      onSelect(params.name, todayVal);
    }
  };

  const getViewModeLabel = () => {
    switch (viewMode) {
      case 'yesterday': return '昨日';
      case 'diff': return '差值';
      default: return '今日';
    }
  };

  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center">
          全国销售热力图
          {compareMode && (
            <span className="ml-2 text-xs text-cyan-400 font-normal">({getViewModeLabel()}视图)</span>
          )}
          <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
            isRefreshing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`} />
        </h3>
        {compareMode && yesterdayData && (
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('today')}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                viewMode === 'today'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              今日
            </button>
            <button
              onClick={() => setViewMode('yesterday')}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                viewMode === 'yesterday'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              昨日
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                viewMode === 'diff'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              差值
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          onEvents={{ click: onChartClick }}
          notMerge={true}
        />
      </div>
    </div>
  );
}
