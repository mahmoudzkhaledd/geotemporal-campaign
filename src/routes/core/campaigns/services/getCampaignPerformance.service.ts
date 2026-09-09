import type { Request, Response } from "express";
import { CampaignModel } from "../../../../../db-schema/campaign.schema";
import { addDays } from "date-fns";
import { UserModel } from "../../../../../db-schema/user.schema";

export const getCampaignPerformanceService = async (
  req: Request<any, any, any>,
  res: Response,
  next: Function,
) => {
  const { campaignId } = req.params;
  const campaign = await CampaignModel.findById(campaignId);
  if (!campaign) throw new Error("Campaign not found");
  const dateBeforeCampaign = addDays(campaign.startDate, -30);
  const dateAfterCampaign = addDays(campaign.endDate, 30);

  const result = await UserModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            campaign.targetLocation.coordinates[0],
            campaign.targetLocation.coordinates[1],
          ] as [number, number],
        },
        key: "lastLocation",
        distanceField: "distance",
        spherical: true,
        minDistance: 0,
        maxDistance: campaign.radiusKm * 1000,
      },
    },

    {
      $lookup: {
        localField: "_id",
        from: "events",
        foreignField: "userId",
        as: "events",
        pipeline: [
          {
            $match: {
              timestamp: {
                $gte: dateBeforeCampaign,
                $lt: dateAfterCampaign,
              },
            },
          },

          {
            $bucket: {
              groupBy: "$timestamp",
              boundaries: [
                dateBeforeCampaign,
                campaign.startDate,
                campaign.endDate,
                dateAfterCampaign,
              ],
              output: {
                total_revenue: {
                  $sum: "$revenue",
                },
                total_clicks: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "click"] }, 1, 0],
                  },
                },
                total_views: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "view"] }, 1, 0],
                  },
                },
                total_purchases: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "purchase"] }, 1, 0],
                  },
                },
              },
            },
          },
          {
            $project: {
              interval_name: {
                $cond: [
                  {
                    $lt: ["$_id", campaign.startDate],
                  },
                  "pre_campaign",
                  {
                    $cond: [
                      {
                        $gte: ["$_id", campaign.endDate],
                      },
                      "post_campaign",
                      "during_campaign",
                    ],
                  },
                ],
              },
              _id: 0,
              total_revenue: 1,
              total_clicks: 1,
              total_views: 1,
              conversion_rate: {
                $cond: [
                  { $eq: ["$total_views", 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ["$total_purchases", "$total_views"] },
                      100,
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    },

    {
      $project: {
        email: 0,
        name: 0,
        phone: 0,
        lastLocation: 0,
        __v: 0,
      },
    },
  ]);

  res.json({
    campaign,
    result,
  });
};
