import { useState, useEffect, useCallback, useRef } from 'react';
import type { OrderItem, CategoryRank, ProvinceData, OrderStatus, MinuteOrder, YesterdayData } from '../types';
import { getCurrentTime, PROVINCE_NAMES } from '../utils/helpers';

const USERS = ['张**', '李**', '王**', '赵**', '刘**', '陈**', '杨**', '黄**', '周**', '吴**'];
const PRODUCTS = [
  'iPhone 15 Pro', '小米14', '华为Mate60', '戴森吹风机', 'SK-II神仙水',
  'Nike Air Max', '雅诗兰黛小棕瓶', '索尼WH-1000XM5', '乐高积木', '美的空调',
  '海尔冰箱', 'Switch游戏机', 'MacBook Air', 'iPad Pro', '戴森吸尘器',
];
const CATEGORIES = [
  { name: '数码家电', color: '#3b82f6' },
  { name: '服装鞋包', color: '#ec4899' },
  { name: '美妆护肤', color: '#8b5cf6' },
  { name: '食品生鲜', color: '#f59e0b' },
  { name: '家居日用', color: '#10b981' },
  { name: '母婴用品', color: '#06b6d4' },
];

function generateOrders(count: number): OrderItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD${Date.now()}${i}`,
    user: USERS[Math.floor(Math.random() * USERS.length)],
    product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
    amount: Math.floor(Math.random() * 5000) + 100,
    time: getCurrentTime(),
  }));
}

function generateCategories(): CategoryRank[] {
  return CATEGORIES.map((c) => ({
    name: c.name,
    value: Math.floor(Math.random() * 80000) + 20000,
    color: c.color,
  })).sort((a, b) => b.value - a.value);
}

function generateProvinces(): ProvinceData[] {
  return PROVINCE_NAMES.map((name) => ({
    name,
    value: Math.floor(Math.random() * 500000) + 10000,
  }));
}

function generateOrderStatus(): OrderStatus[] {
  return [
    { name: '待付款', value: Math.floor(Math.random() * 500) + 100 },
    { name: '待发货', value: Math.floor(Math.random() * 800) + 200 },
    { name: '已发货', value: Math.floor(Math.random() * 1200) + 300 },
    { name: '已完成', value: Math.floor(Math.random() * 3000) + 1000 },
  ];
}

function generateMinuteOrders(offsetDays: number = 0): MinuteOrder[] {
  const now = new Date();
  now.setDate(now.getDate() - offsetDays);
  return Array.from({ length: 60 }, (_, i) => {
    const t = new Date(now.getTime() - (59 - i) * 60000);
    const label = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`;
    return { time: label, value: Math.floor(Math.random() * 200) + 50 };
  });
}

function generateYesterdayData(): YesterdayData {
  return {
    sales: Math.floor(Math.random() * 3000000) + 10000000,
    orders: Math.floor(Math.random() * 5000) + 28000,
    categories: CATEGORIES.map((c) => ({
      name: c.name,
      value: Math.floor(Math.random() * 80000) + 20000,
      color: c.color,
    })).sort((a, b) => b.value - a.value),
    provinces: PROVINCE_NAMES.map((name) => ({
      name,
      value: Math.floor(Math.random() * 500000) + 10000,
    })),
    orderStatus: [
      { name: '待付款', value: Math.floor(Math.random() * 500) + 100 },
      { name: '待发货', value: Math.floor(Math.random() * 800) + 200 },
      { name: '已发货', value: Math.floor(Math.random() * 1200) + 300 },
      { name: '已完成', value: Math.floor(Math.random() * 3000) + 1000 },
    ],
    minuteOrders: generateMinuteOrders(1),
  };
}

export function useEcommerceData() {
  const [sales, setSales] = useState(12845678);
  const [orders, setOrders] = useState(34567);
  const [salesGrowth, setSalesGrowth] = useState(12.5);
  const [orderGrowth, setOrderGrowth] = useState(8.3);
  const [latestOrders, setLatestOrders] = useState<OrderItem[]>(generateOrders(8));
  const [categories, setCategories] = useState<CategoryRank[]>(generateCategories());
  const [provinces, setProvinces] = useState<ProvinceData[]>(generateProvinces());
  const [orderStatus, setOrderStatus] = useState<OrderStatus[]>(generateOrderStatus());
  const [minuteOrders, setMinuteOrders] = useState<MinuteOrder[]>(generateMinuteOrders);
  const [compareMode, setCompareMode] = useState(false);
  const [yesterdayData, setYesterdayData] = useState<YesterdayData>(generateYesterdayData);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const prevSalesRef = useRef(sales);
  const prevOrdersRef = useRef(orders);

  const tick = useCallback(() => {
    const addSales = Math.floor(Math.random() * 50000);
    const addOrders = Math.floor(Math.random() * 30);

    prevSalesRef.current = sales;
    prevOrdersRef.current = orders;

    setSales((v) => v + addSales);
    setOrders((v) => v + addOrders);
    setSalesGrowth((v) => Math.max(-20, Math.min(50, v + (Math.random() - 0.5) * 2)));
    setOrderGrowth((v) => Math.max(-20, Math.min(50, v + (Math.random() - 0.5) * 2)));

    setLatestOrders((prev) => {
      const newOrder: OrderItem = {
        id: `ORD${Date.now()}`,
        user: USERS[Math.floor(Math.random() * USERS.length)],
        product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
        amount: Math.floor(Math.random() * 5000) + 100,
        time: getCurrentTime(),
      };
      return [newOrder, ...prev].slice(0, 10);
    });

    setCategories(generateCategories());
    setProvinces(generateProvinces());
    setOrderStatus(generateOrderStatus());
    setMinuteOrders(generateMinuteOrders());
  }, [sales, orders]);

  useEffect(() => {
    if (!isRefreshing) return;
    const interval = setInterval(tick, 4000);
    return () => clearInterval(interval);
  }, [tick, isRefreshing]);

  const toggleCompareMode = useCallback(() => {
    setCompareMode((prev) => {
      const next = !prev;
      if (next) {
        setYesterdayData(generateYesterdayData());
      }
      setIsRefreshing(next ? false : true);
      return next;
    });
  }, []);

  return {
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
  };
}
