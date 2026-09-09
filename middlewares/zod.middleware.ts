import { ZodError, ZodType } from "zod";
import type { Request, Response } from "express";
export const zodMiddleware = (
  schema: ZodType,
  validateOn: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: Function) => {
    try {
      let data: any = null;
      if (validateOn == "body") data = req.body;
      else if (validateOn == "params") data = req.params;
      else if (validateOn == "query") data = req.query;

      const model = schema.parse(data) as any;

      if (validateOn == "body") req.body = model;
      else if (validateOn == "query") Object.assign(req.query, model);
      else if (validateOn == "params") Object.assign(req.params, model);

      next();
    } catch (ex: any) {
      if (ex instanceof ZodError && ex.issues.length != 0) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: `(${ex.issues[0]?.path}): ${ex.issues[0]?.message}`,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };
};
