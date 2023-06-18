import express from "express";
import { router } from "./routes/restaurants";

const app = express();
app.use(express.json());
app.use("/restaurants", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
