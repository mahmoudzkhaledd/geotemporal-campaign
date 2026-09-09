/*
    ChatGPT Generated seed script.
    Run `bun seed` in the terminal to seed the db.
*/

import { CampaignModel } from "../db-schema/campaign.schema";
import { EventModel } from "../db-schema/event.schema";
import { UserModel } from "../db-schema/user.schema";
import { db } from "../lib/mongoose";
import { config } from "dotenv";
config();

const seed = async () => {
  try {
    await db.connect(process.env.DB_URL!);

    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      UserModel.deleteMany({}),
      EventModel.deleteMany({}),
      CampaignModel.deleteMany({}),
    ]);

    console.log("Old data cleared");

    // -------------------------
    // Campaigns
    // -------------------------

    const campaigns = await CampaignModel.insertMany([
      {
        name: "Cairo Summer Campaign",
        targetLocation: {
          type: "Point",
          coordinates: [31.2357, 30.0444], // Cairo
        },
        radiusKm: 10,
        startDate: new Date("2026-09-01"),
        endDate: new Date("2026-09-30"),
      },
      {
        name: "Alexandria Campaign",
        targetLocation: {
          type: "Point",
          coordinates: [29.9187, 31.2001], // Alexandria
        },
        radiusKm: 15,
        startDate: new Date("2026-09-01"),
        endDate: new Date("2026-10-01"),
      },
    ]);

    // -------------------------
    // Users
    // -------------------------

    const users = await UserModel.insertMany([
      {
        name: "Ahmed Mohamed",
        email: "ahmed@example.com",
        phone: "01000000001",
        lastLocation: {
          type: "Point",
          coordinates: [31.2357, 30.0444],
        },
      },
      {
        name: "Mohamed Ali",
        email: "mohamed@example.com",
        phone: "01000000002",
        lastLocation: {
          type: "Point",
          coordinates: [31.25, 30.05],
        },
      },
      {
        name: "Omar Hassan",
        email: "omar@example.com",
        phone: "01000000003",
        lastLocation: {
          type: "Point",
          coordinates: [29.92, 31.2],
        },
      },
      {
        name: "Youssef Ahmed",
        email: "youssef@example.com",
        phone: "01000000004",
        lastLocation: {
          type: "Point",
          coordinates: [29.93, 31.21],
        },
      },
    ]);

    // -------------------------
    // Events
    // -------------------------

    const events = await EventModel.insertMany([
      {
        name: "Summer Campaign View",
        userId: users[0]?._id,
        campaignId: campaigns[0]?._id,
        type: "view",
        revenue: 0,
        timestamp: new Date("2026-09-02T10:00:00Z"),
      },
      {
        name: "Summer Campaign Click",
        userId: users[0]?._id,
        campaignId: campaigns[0]?._id,
        type: "click",
        revenue: 0,
        timestamp: new Date("2026-09-02T10:05:00Z"),
      },
      {
        name: "Summer Campaign Purchase",
        userId: users[0]?._id,
        campaignId: campaigns[0]?._id,
        type: "purchase",
        revenue: 250,
        timestamp: new Date("2026-09-02T10:10:00Z"),
      },
      {
        name: "Summer Campaign View",
        userId: users[1]?._id,
        campaignId: campaigns[0]?._id,
        type: "view",
        revenue: 0,
        timestamp: new Date("2026-09-03T12:00:00Z"),
      },
      {
        name: "Summer Campaign Purchase",
        userId: users[1]?._id,
        campaignId: campaigns[0]?._id,
        type: "purchase",
        revenue: 400,
        timestamp: new Date("2026-09-03T12:30:00Z"),
      },
      {
        name: "Alexandria Campaign View",
        userId: users[2]?._id,
        campaignId: campaigns[1]?._id,
        type: "view",
        revenue: 0,
        timestamp: new Date("2026-09-04T09:00:00Z"),
      },
      {
        name: "Alexandria Campaign Click",
        userId: users[2]?._id,
        campaignId: campaigns[1]?._id,
        type: "click",
        revenue: 0,
        timestamp: new Date("2026-09-04T09:10:00Z"),
      },
      {
        name: "Alexandria Campaign Purchase",
        userId: users[2]?._id,
        campaignId: campaigns[1]?._id,
        type: "purchase",
        revenue: 150,
        timestamp: new Date("2026-09-04T09:20:00Z"),
      },
      {
        name: "Alexandria Campaign View",
        userId: users[3]?._id,
        campaignId: campaigns[1]?._id,
        type: "view",
        revenue: 0,
        timestamp: new Date("2026-09-05T14:00:00Z"),
      },
    ]);

    // -------------------------
    // Update users.events
    // -------------------------

    console.log(`Created ${campaigns.length} campaigns`);
    console.log(`Created ${users.length} users`);
    console.log(`Created ${events.length} events`);

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await db.disconnect();
  }
};

seed();
