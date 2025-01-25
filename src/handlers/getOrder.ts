import { Request, Response } from "express";
import { orderBookService } from "./service";

const getOrder = async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

    try {
      const order = await orderBookService.getOrder({ id: orderId });
      res.status(200).json({ order });
    } catch (error) {
      console.error("Failed to get order:", error.message)
      res.status(400).json({ error: "Failed to get order" });
    }
}

export default getOrder
