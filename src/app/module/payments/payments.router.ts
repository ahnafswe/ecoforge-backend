import { Router } from "express";
import { paymentsController } from "./payments.controller";

const router = Router();

router.post("/initiate", paymentsController.initiatePayment);

router.post("/webhook", paymentsController.handleWebhook);

export const paymentsRouter = router;
