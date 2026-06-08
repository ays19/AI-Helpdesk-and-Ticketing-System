import "dotenv/config";
import cors from "cors";
import express from "express";
import { prisma } from "./lib/prisma.ts";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/api/healthcare", async (_req, res) => {
  try {
    const userCount = await prisma.users.count();

    res.json({
      message: "Healthcare API is running. Connected to the helpdesk database.",
      database: "helpdesk",
      userCount,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(503).json({
      message: "Healthcare API is running, but the helpdesk database is unavailable.",
      database: "helpdesk",
      error: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to helpdesk database");
  } catch (error) {
    console.error("Failed to connect to helpdesk database:", error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
