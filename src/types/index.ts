export interface OrderItem {
  id: string;
  user: string;
  product: string;
  amount: number;
  time: string;
}

export interface CategoryRank {
  name: string;
  value: number;
  color: string;
}

export interface ProvinceData {
  name: string;
  value: number;
}

export interface OrderStatus {
  name: string;
  value: number;
}

export interface MinuteOrder {
  time: string;
  value: number;
}

export interface YesterdayData {
  sales: number;
  orders: number;
  categories: CategoryRank[];
  provinces: ProvinceData[];
  orderStatus: OrderStatus[];
  minuteOrders: MinuteOrder[];
}
