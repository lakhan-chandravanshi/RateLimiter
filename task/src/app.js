import express from "express";
import dataRoutes from "./routes/data.routes.js";

const app = express();

app.use(express.json());
app.use("/", dataRoutes);

export default app;
