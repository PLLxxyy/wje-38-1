import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface Props {
  sales: number;
  orders: number;
  salesGrowth: number;
  orderGrowth: number;
}

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);
  const startRef = useRef(value);
  const endRef = useRef(value);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = display;
    endRef.current = value;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const duration = 800;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startRef.current + (endRef.current - startRef.current) * ease);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
    </span>
  );
}

export default function SalesNumbers({ sales, orders, salesGrowth, orderGrowth }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-panel-bg rounded-xl p-4 border border-gray-800 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
          <TrendingUp size={16} className="text-accent" />
          今日销售额
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">
          <AnimatedNumber value={sales} prefix="¥" />
        </div>
        <div className={`text-xs mt-1 flex items-center gap-1 ${salesGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {salesGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}% 较昨日
        </div>
      </div>
      <div className="bg-panel-bg rounded-xl p-4 border border-gray-800 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
          <Package size={16} className="text-info" />
          今日订单数
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">
          <AnimatedNumber value={orders} />
        </div>
        <div className={`text-xs mt-1 flex items-center gap-1 ${orderGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {orderGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {orderGrowth >= 0 ? '+' : ''}{orderGrowth.toFixed(1)}% 较昨日
        </div>
      </div>
    </div>
  );
}
