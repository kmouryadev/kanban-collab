
import express from "express";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";
import authRoutes from "./routes/v1/auth.routes";
import errorMiddleware from "./middlewares/error.middleware";
import boardRoutes from "./routes/v1/board.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth/v1/", authRoutes);
app.use("/api/v1/boards", boardRoutes);

app.use(errorMiddleware);

export default app;
