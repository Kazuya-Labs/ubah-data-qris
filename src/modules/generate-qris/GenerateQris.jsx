import React, { useState } from "react";
import Input from "../../shared/ui/Input";
import Button from "../../shared/ui/Button";
import {
  generateQrisImage,
  readQrisImage,
  updateQris,
} from "../../shared/lib/handleQris";
import { useTimeout } from "./hook/useTimeout";
import { Footer } from "../../shared/ui/Footer";

// Komponen Card untuk Fitur/Instruksi agar web tidak kosong
const FeatureCard = ({ title, desc, icon }) => (
  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
    <div className="text-2xl mb-2">{icon}</div>
    <h4 className="font-bold text-slate-800 text-sm uppercase">{title}</h4>
    <p className="text-xs text-slate-500">{desc}</p>
  </div>
);

const DownloadButton = ({ imageBase64 }) => {
  return (
    <a
      href={imageBase64}
      download="QRIS_Merchant_Baru.png"
      className="w-full text-white bg-slate-600 hover:bg-slate-700 transition-all p-3 rounded-xl block text-center mt-4 font-semibold shadow-lg"
    >
      Download QRIS Baru
    </a>
  );
};

const Loading = () => (
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-600 mb-4"></div>
      <p className="text-slate-700 font-medium">Memproses QRIS Anda...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce z-50">
    {message}
  </div>
);

function GenerateQris() {
  const [originalQris, setOriginalQris] = useState("");
  const [newname, setNewname] = useState("");
  const [amount, setAmount] = useState("");
  const [isPending, setisPending] = useState(false);
  const [finalQris, setFinalQris] = useState("");
  const [value, showValue] = useTimeout(3000);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalQris || !newname) {
      showValue("Nama Merchant dan Foto QRIS wajib diisi!");
      return;
    }
    try {
      setisPending(true);
      const rawQris = await readQrisImage(originalQris);
      const newQris = await updateQris(rawQris, newname, amount);
      const newQrisImage = await generateQrisImage(newQris);
      setFinalQris(newQrisImage);
    } catch (error) {
      showValue(error.message || "Terjadi kesalahan saat memproses gambar");
    } finally {
      setisPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <div className="bg-slate-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">QRIS Tool Generator</h1>
          <p className="text-slate-100 text-lg">Ubah QRIS Statis menjadi Dinamis atau Ubah Nama Merchant dengan Mudah.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Instruksi */}
          <div className="space-y-4">
            <FeatureCard 
              icon="⚡" 
              title="Cepat & Otomatis" 
              desc="Deteksi kode QR secara instan dan buat ulang dalam hitungan detik." 
            />
            <FeatureCard 
              icon="💰" 
              title="QRIS Dinamis" 
              desc="Tambahkan nominal pembayaran agar pelanggan tidak perlu input manual." 
            />
            <FeatureCard 
              icon="🛡️" 
              title="Privasi Terjamin" 
              desc="File diproses langsung di browser Anda tanpa disimpan di server kami." 
            />
          </div>

          {/* Kolom Tengah: Form Utama */}
          <div className="lg:col-span-2">
            <div className="p-8 shadow-2xl rounded-3xl bg-white border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-slate-100 text-slate-700 p-2 rounded-lg">⚙️</span>
                Konfigurasi QRIS Baru
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nama Merchant Baru</label>
                  <Input
                    placeholder="Contoh: Toko Berkah Jaya"
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 outline-none transition-all"
                    onChange={(e) => setNewname(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Nominal (Dinamis)</label>
                  <Input
                    placeholder="Masukkan angka (kosongkan jika tetap statis)"
                    className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 outline-none transition-all"
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">*Jika diisi, QRIS akan otomatis menjadi QRIS Dinamis.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Upload Template QRIS</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setOriginalQris(e.target.files[0])}
                      className="cursor-pointer w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full py-4 rounded-xl bg-slate-600 hover:bg-slate-700 text-white font-bold text-lg shadow-lg transform active:scale-95 transition-all" 
                  onClick={handleSubmit}
                >
                  Proses & Generate Sekarang
                </Button>
              </div>
            </div>

            {/* Kolom Hasil (Jika Ada) */}
            {finalQris && (
              <div className="mt-8 p-8 bg-white rounded-3xl shadow-xl border-2 border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full max-w-[250px] bg-slate-100 p-4 rounded-2xl">
                    <img src={finalQris} alt="Generated QRIS" className="w-full h-auto rounded-lg shadow-sm" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">QRIS Siap Digunakan! 🎉</h3>
                    <p className="text-slate-600 mb-6 text-sm">Nama Merchant: <span className="font-bold text-slate-600">{newname}</span><br/>
                    Tipe: <span className="font-bold text-slate-600">{amount ? `Dinamis (Rp ${parseInt(amount).toLocaleString()})` : "Statis"}</span></p>
                    <DownloadButton imageBase64={finalQris} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {value && <ErrorMessage message={value} />}
      {isPending && <Loading />}
      <Footer />
    </div>
  );
}

export default GenerateQris;
