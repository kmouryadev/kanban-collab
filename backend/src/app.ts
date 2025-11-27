import express from "express";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";
import errorMiddleware from "./middlewares/error.middleware";
import router from "./routes/v1";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/", router);

app.use(errorMiddleware);

export default app;
