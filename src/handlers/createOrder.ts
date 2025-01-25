import { Request, Response } from "express";
import { OrderSide, UASSETSymbol } from "../services/order.types";
import { orderBookService } from "./service";

const createOrder = async (req: Request, res: Response): Promise<void> => {
    const { uassetSymbol, side, quantity, price } = req.body;
    
    try {
        // Validate request body
        if (!uassetSymbol || !side || !quantity || !price) {
            res.status(400).json({ error: "Missing required fields" });
            return
        }

        if (!UASSETSymbol[uassetSymbol.toUpperCase()]) {
            res.status(400).json({ error: `uAsset not supported - supported uAssets: ${Object.values(UASSETSymbol)}` });
            return
        }

        if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
            res.status(400).json({ error: "Quantity and price must be positive" });
            return
        }

        if (![OrderSide.BUY, OrderSide.SELL].includes(side.toLowerCase())) {
            res.status(400).json({ error: "Invalid order side. side should either be buy or sell" });
            return
            
        }

        const order = await orderBookService.addOrder({
            uassetSymbol,
            side,
            initialQuatity: quantity,
            quantity,
            price: Number(price),
        });
        
        res.status(201).json({ data: order });
    } catch (error) {
        console.error("Failed to create order:", error.message)
        res.status(400).json({ error: "Failed to create order" });
    }
}

export default createOrder
