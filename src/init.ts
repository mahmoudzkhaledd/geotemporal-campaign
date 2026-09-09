import express, {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import { config } from "dotenv";
import cors from "cors";

import { extractError } from "../lib/app-utils";
import { db } from "../lib/mongoose";

config();

export async function init(entry: Router, initialRoute: string) {
  console.log("Initializing the server ...");

  console.log("Connecting to Mongoose ...");
  await db.connect(process.env.DB_URL ?? "").catch((e) => {
    console.error("Mongoose connection error:", e.message);
    process.exit(1);
  });
  console.log("Mongoose connected.");

  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  app.use(initialRoute, entry);

  app.all("/{*any}", (req, res, next) => {
    res.status(404).json({
      error: "Sorry, this route does not exist.",
      route: req.path,
    });
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
      res.status(400).json({ error: "Invalid JSON format." });
      return;
    }
    res.status(400).json({
      error: `${extractError(err)}`,
    });
  });

  console.log("Server initialized and ready!");
  return app;
}
