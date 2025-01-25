import { Request, Response } from "express";
import { orderBookService } from "./service";
import { OrderSide, OrderStatus, UASSETSymbol } from "../services/order.types";

interface OrderQueryParams {
    uassetSymbol?: string;
    side?: string;
    status?: string;
  }

const getOrders = async (req: Request<any, any, any, OrderQueryParams>, res: Response) => {
    const { uassetSymbol, side, status } = req.query;

    try {
        const filters: {
            uassetSymbol?: UASSETSymbol;
            side?: OrderSide;
            status?: OrderStatus;
          } = {}

        if (uassetSymbol && UASSETSymbol[uassetSymbol.toUpperCase()]) {
          filters.uassetSymbol = UASSETSymbol[uassetSymbol.toUpperCase()];
        }

        if (status && OrderStatus[status.toUpperCase()]) {
          filters.status = OrderStatus[status.toUpperCase()];
        }

        if (side && OrderSide[side.toUpperCase()]) {
          filters.side = OrderSide[side.toUpperCase()]
        }

        const orders = await orderBookService.getOrders({ ...filters })
        res.json({ data:  orders });
    } catch (error) {
        console.error("Failed to get orders:", error.message)
        res.status(500).json({ error: "Failed to get orders" });
    }
}

export default getOrders
