import { Router } from "express";
import { getCampaignPerformanceService } from "./services/getCampaignPerformance.service";

const campaignsController = Router({ mergeParams: true });

campaignsController.get(
  "/:campaignId/performance",
  getCampaignPerformanceService,
);

export default campaignsController;
