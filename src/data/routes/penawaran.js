import { Router } from "express";
import { penawaran } from "../store.js";

const router = Router();

router.get("/", (req, res) => {
    const q = String(req.query.q || "").trim().toLowerCase();
    const kategori = String(req.query.kategori || "").trim().toLowerCase();

    const hasil = penawaran.filter((item) => {
        const cocokKata = `${item.nama} ${item.penyedia}`
            .toLowerCase()
            .includes(q);

        const cocokKategori =
            !kategori ||
            String(item.kategori).toLowerCase() === kategori;

        return cocokKata && cocokKategori;
    });

    res.status(200).json({
        success: true,
        data: hasil,
        meta: {
            jumlah: hasil.length,
            q,
            kategori
        }
    });
});

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    const item = penawaran.find(
        (penawaranItem) => penawaranItem.id === id
    );

    if (!Number.isInteger(id) || !item) {
        return res.status(404).json({
            success: false,
            error: {
                code: "OFFER_NOT_FOUND",
                message: "Penawaran tidak ditemukan."
            }
        });
    }

    return res.status(200).json({
        success: true,
        data: item
    });
});

export default router;