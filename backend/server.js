require("dotenv").config();

const cors = require("cors");
const express = require("express");
const contactRouter = require("./routes/contact");

const app = express();
const port = Number(process.env.PORT) || 5000;
const configuredOrigins = (process.env.FRONTEND_URL || "").split(",").map((origin) => origin.trim()).filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
};

app.use(cors({ origin(origin, callback) { callback(null, isAllowedOrigin(origin)); } }));
app.use(express.json({ limit: "20kb" }));
app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/contact", contactRouter);
app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "An unexpected server error occurred." });
});

app.listen(port, () => console.log(`Contact backend listening on http://localhost:${port}`));