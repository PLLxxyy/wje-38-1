import { useEffect, useRef } from 'react';
import type { OrderItem } from '../types';
import { ShoppingCart } from 'lucide-react';

interface Props {
  orders: OrderItem[];
  isRefreshing?: boolean;
}

export default function OrderTicker({ orders, isRefreshing = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [orders]);

  return (
    <div className="bg-panel-bg rounded-xl p-3 h-full flex flex-col border border-gray-800">
      <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-1.5">
        <ShoppingCart size={14} className="text-accent" />
        最新成交
        <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
          isRefreshing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
        }`} />
      </h3>
      <div ref={containerRef} className="flex-1 overflow-hidden relative">
        <div className="animate-scroll-up space-y-2">
          {[...orders, ...orders].map((order, i) => (
            <div
              key={`${order.id}-${i}`}
              className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-gray-800/50"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-gray-400 shrink-0">{order.user}</span>
                <span className="text-gray-300 truncate">购买了 {order.product}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-accent font-medium">¥{order.amount}</span>
                <span className="text-gray-500">{order.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
