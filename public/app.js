"use strict";
const rupiah = new Intl.NumberFormat("id-ID", {
 style: "currency",
 currency: "IDR",
 maximumFractionDigits: 0
});
document.addEventListener("DOMContentLoaded", () => {
 muatPenawaran();
 document.querySelector("#form-pesanan").addEventListener("submit", kirimPesanan);
});
async function muatPenawaran() {
 const status = document.querySelector("#status");
 const katalog = document.querySelector("#katalog");
 try {
 status.classList.remove("error");
 const respons = await fetch("/api/penawaran");
 const body = await respons.json();
 if (!respons.ok) throw new Error(body.error?.message || "Data gagal dimuat.");
 katalog.replaceChildren(...body.data.map(buatKartu));
 status.textContent = `${body.meta.jumlah} penawaran tersedia.`;
 } catch (error) {
 status.textContent = error.message;
 status.classList.add("error");
 }
}
function buatKartu(item) {
 const artikel = document.createElement("article");
 const judul = document.createElement("h3");
 const detail = document.createElement("p");
 judul.textContent = item.nama;
 detail.textContent = `ID ${item.id} · stok ${item.stok} ${item.satuan} · ${rupiah.format(item.hargaPenawaran)}`;
 artikel.append(judul, detail);
 return artikel;
 }
async function kirimPesanan(event) {
 event.preventDefault();
 const form = event.currentTarget;
 const status = document.querySelector("#status-pesanan");
 const hasil = document.querySelector("#hasil-pesanan");
 const data = new FormData(form);
 const payload = {
 namaPemesan: data.get("namaPemesan"),
 items: [{
 penawaranId: Number(data.get("penawaranId")),
 kuantitas: Number(data.get("kuantitas"))
 }]
 };
 try {
 status.classList.remove("error");
 status.textContent = "Mengirim pesanan…";
 const respons = await fetch("/api/pesanan", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(payload)
 });
 const body = await respons.json();
 hasil.textContent = JSON.stringify(body, null, 2);
 if (!respons.ok) throw new Error(body.error?.message || "Pesanan gagal dibuat.");
 status.textContent = `Pesanan dibuat dengan status HTTP ${respons.status}.`;
 form.reset();
 await muatPenawaran();
 } catch (error) {
 status.textContent = error.message;
 status.classList.add("error");
 }
}