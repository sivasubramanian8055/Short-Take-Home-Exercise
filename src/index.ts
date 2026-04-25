import "dotenv/config";
import express, { Request, Response } from "express";
import textAnalysisRouter from "./routes/textAnalysis";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/text-analysis", textAnalysisRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
