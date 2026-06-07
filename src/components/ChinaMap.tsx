import ReactECharts from 'echarts-for-react';
import type { ProvinceData } from '../types';

interface Props {
  data: ProvinceData[];
  onSelect?: (name: string, value: number) => void;
}

export default function ChinaMap({ data, onSelect }: Props) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17,24,39,0.95)',
      borderColor: '#374151',
      textStyle: { color: '#e5e7eb' },
      formatter: (p: any) => `${p.name}<br/>销售额: ¥${(p.value || 0).toLocaleString()}`,
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
      <h3 className="text-sm font-semibold text-gray-200 mb-2">全国销售热力图</h3>
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
