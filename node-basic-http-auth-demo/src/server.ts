import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import auth from "./auth";

const app = express();

const PORT: number = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
  console.log(`running on port ${PORT} in http://localhost:${PORT}`);
})

app.get("/", auth, (_req: express.Request, res: express.Response): void => {
  res.status(200).send("hello bi*ch!, you can see it now!<br><a href='/logout'>logout</a>");
})

app.get("*", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).send("Page not found 404")
})