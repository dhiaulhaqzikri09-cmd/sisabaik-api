import express from "express";
import penawaranRouter from "./data/routes/penawaran.js";
import pesananRouter from "./data/routes/pesanan.js";
import { catatRequest } from "./middleware/catat-request.js";
import { routeTidakDitemukan } from "./middleware/not-found.js";
import { tanganiError } from "./middleware/error-handler.js";

const app = express();

app.disable("x-powered-by");

app.use(catatRequest);
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: "ok",
            waktu: new Date().toISOString()
        }
    });
});

app.use("/api/penawaran", penawaranRouter);
app.use("/api/pesanan", pesananRouter);

app.use(routeTidakDitemukan);
app.use(tanganiError);

export default app; 