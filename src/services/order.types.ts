export enum UASSETSymbol {
    UBTC = "uBTC",
    UETH = "uETH"
}

export enum OrderSide {
    BUY = "buy",
    SELL = "sell"
}
  
export enum OrderStatus {
    OPEN = "open",
    FULFILLED = "fulfilled",
    CANCELLED = "cancelled",
}

export interface Order {
    id: string;
    uassetSymbol: string;
    side: OrderSide;
    initialQuatity: number;
    quantity: number;
    price: number;
    status: OrderStatus;
    createdAt: Date;
}
