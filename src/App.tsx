import { useState } from 'react';
import OrderTicker from './components/OrderTicker';
import SalesNumbers from './components/SalesNumbers';
import CategoryRankChart from './components/CategoryRank';
import ChinaMap from './components/ChinaMap';
import OrderStatusChart from './components/OrderStatusChart';
import MinuteOrdersChart from './components/MinuteOrdersChart';
import { useEcommerceData } from './hooks/useEcommerceData';
import { Store, GitCompare, Pause, Play } from 'lucide-react';

export default function App() {
  const {
    sales,
    orders,
    salesGrowth,
    orderGrowth,
    latestOrders,
    categories,
    provinces,
    orderStatus,
    minuteOrders,
    compareMode,
    isRefreshing,
    yesterdayData,
    toggleCompareMode,
  } = useEcommerceData();

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  return (
    <div className="w-screen h-screen bg-dashboard-bg text-gray-100 flex flex-col p-4 gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Store className="text-accent" size={26} />
          <h1 className="text-xl font-bold tracking-wide">电商实时销售大屏</h1>
        </div>
        <div className="flex items-center gap-4">
          {selectedProvince && (
            <div className="text-sm text-accent bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
              已选省份: {selectedProvince}
            </div>
          )}
          {compareMode && (
            <div className="text-sm text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20 flex items-center gap-2">
              <GitCompare size={14} />
              昨日对比模式
            </div>
          )}
          <button
            onClick={toggleCompareMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              compareMode
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            {compareMode ? <Pause size={16} /> : <GitCompare size={16} />}
            {compareMode ? '退出对比' : '昨日对比'}
          </button>
          <div className={`text-xs flex items-center gap-1.5 ${isRefreshing ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isRefreshing ? <Play size={12} /> : <Pause size={12} />}
            {isRefreshing ? '数据每 4 秒自动刷新' : '数据已暂停刷新'}
          </div>
        </div>
      </div>

      {/* Top: Ticker */}
      <div className="shrink-0 h-16">
        <OrderTicker orders={latestOrders} />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
        {/* Left: Sales + Category */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 min-h-0">
          <div className="shrink-0">
            <SalesNumbers
              sales={sales}
              orders={orders}
              salesGrowth={salesGrowth}
              orderGrowth={orderGrowth}
              compareMode={compareMode}
              yesterdaySales={yesterdayData.sales}
              yesterdayOrders={yesterdayData.orders}
            />
          </div>
          <div className="flex-1 min-h-0">
            <CategoryRankChart
              data={categories}
              compareMode={compareMode}
              yesterdayData={yesterdayData.categories}
            />
          </div>
        </div>

        {/* Center: Map */}
        <div className="col-span-12 lg:col-span-5 min-h-0">
          <ChinaMap
            data={provinces}
            compareMode={compareMode}
            yesterdayData={yesterdayData.provinces}
            onSelect={(name) => setSelectedProvince(name)}
          />
        </div>

        {/* Right: Status + Minute Orders */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <OrderStatusChart
              data={orderStatus}
              compareMode={compareMode}
              yesterdayData={yesterdayData.orderStatus}
            />
          </div>
          <div className="flex-1 min-h-0">
            <MinuteOrdersChart
              data={minuteOrders}
              compareMode={compareMode}
              yesterdayData={yesterdayData.minuteOrders}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
