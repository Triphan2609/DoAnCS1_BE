import express from "express";
import "dotenv/config";
const app = express();
import initAPIRoute from "./routes/api.js";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// Tạo đường dẫn tương đối
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
// Routers
initAPIRoute(app);

app.listen(process.env.port, () => {
    console.log(`Sever running in port ${process.env.port}`);
});
