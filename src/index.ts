import dotenv from "dotenv";
import express, { Response } from "express";

const { env } = process;

dotenv.config({ path: [`.env.${env.NODE_ENV}.local`, `.env.${env.NODE_ENV}`] });

const app = express();
const port = 4000;

app.get("/", (_, res: Response) => {
  res.status(200).send("messenger-server");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
