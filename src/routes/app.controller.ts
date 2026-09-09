import { Router } from "express";
import campaignsController from "./core/campaigns/campaigns.controller";

const appController = Router({ mergeParams: true });

appController.get("/", (req, res) => {
  console.log("Request: /");
  res.send("ok");
});

appController.use("/campaigns", campaignsController);

export default appController;
