import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { aiController } from "../../controllers/ai.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 10,
    fileSize: 8 * 1024 * 1024,
  },
});

export const aiRoutes = Router();

aiRoutes.post("/proposal", requireAuth, upload.array("photos", 10), aiController.generateProposal);
aiRoutes.post("/full-proposal", requireAuth, upload.array("photos", 10), aiController.generateFullProposal);
aiRoutes.post("/design-options", requireAuth, aiController.designOptions);
aiRoutes.post("/design-concepts", requireAuth, aiController.designConcepts);

