import { useState } from "react";
import { apiFetch } from "@/utils/api";
import { webFetch } from "@/utils/webFetch";

export default function UploadSk({ selectedProvinsi, selectedKabupaten }) {
  const [excelFile, setExcelFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!excelFile || !pdfFile) {
      setMessage({ text: "❌ Kedua file harus dipilih!", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file_excel", excelFile);
    formData.append("file_pdf", pdfFile);
    formData.append("kdlokasi", selectedProvinsi.value);
    formData.append("kdkabkota", selectedKabupaten.value);

    try {
      setLoading(true);
      const response = await webFetch("upload-sk", {
        method: "POST",
        body: formData,
      });

      if (response.success) {
        setMessage({ text: "✅ Upload berhasil!", type: "success" });
        setExcelFile(null);
        setPdfFile(null);
      } else {
        setMessage({ text: "❌ Gagal upload ke server.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "❌ Terjadi kesalahan saat upload.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-[300px] justify-between space-y-6">
      {/* 📂 Input File Excel */}
      <div>
        <label className="block font-semibold mb-1">📊 File Excel SK:</label>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => setExcelFile(e.target.files[0])}
          disabled={loading}
          className="block w-full border border-gray-300 rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* 📄 Input File PDF */}
      <div>
        <label className="block font-semibold mb-1">📄 File PDF SK:</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          disabled={loading}
          className="block w-full border border-gray-300 rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* 🚀 Tombol Upload */}
      <div>
        <button
          className={`w-full md:w-auto px-6 py-2 rounded text-white font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "⏳ Mengupload..." : "📤 Upload File"}
        </button>
      </div>

      {/* 🔔 Pesan Notifikasi */}
      {message.text && (
        <div
          className={`text-center px-4 py-2 rounded font-medium ${
            message.type === "success" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
