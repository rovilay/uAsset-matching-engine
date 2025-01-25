import express from "express";
import getOrders from "../handlers/getOrders";
import cancelOrder from "../handlers/cancelOrder";
import createOrder from "../handlers/createOrder";
import getOrder from "../handlers/getOrder";

const router = express.Router()

router.post("/api/v1/orders", createOrder);

router.patch("/api/v1/orders/:orderId/cancel", cancelOrder);

router.get("/api/v1/orders/:orderId", getOrder);
router.get("/api/v1/orders", getOrders);

export default router
