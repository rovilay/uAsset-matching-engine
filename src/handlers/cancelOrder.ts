import { Request, Response } from "express";
import { orderBookService } from "./service";

const cancelOrder = async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

    try {
      const cancelledOrder = await orderBookService.cancelOrder(orderId);
      res.status(200).json({ data: cancelledOrder });
    } catch (error) {
      console.error("Failed to cancel order:", error.message)
      res.status(400).json({ error: "Failed to cancel order" });
    }
}

export default cancelOrder
