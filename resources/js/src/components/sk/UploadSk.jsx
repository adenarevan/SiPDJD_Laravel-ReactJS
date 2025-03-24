
import { useState } from "react";
import { apiFetch } from "@/utils/api";

export default function UploadSk({ selectedProvinsi, selectedKabupaten }) {
  const [excelFile, setExcelFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!excelFile || !pdfFile) {
      setMessage("❌ Pilih kedua file terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("file_excel", excelFile);
    formData.append("file_pdf", pdfFile);
    formData.append("kdlokasi", selectedProvinsi.value);
    formData.append("kdkabkota", selectedKabupaten.value);

    try {
      setLoading(true);
      const response = await apiFetch("upload-sk", {
        method: "POST",
        body: formData,
      });

      if (response.success) {
        setMessage("✅ Upload berhasil!");
      } else {
        setMessage("❌ Gagal upload.");
      }
    } catch (err) {
      setMessage("❌ Terjadi kesalahan saat upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="font-semibold">File Excel SK:</label>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => setExcelFile(e.target.files[0])}
          className="block mt-1"
        />
      </div>

      <div>
        <label className="font-semibold">File PDF SK:</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="block mt-1"
        />
      </div>

      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "⏳ Mengupload..." : "📤 Upload File"}
      </button>

      {message && <p className="text-center mt-4 font-medium text-gray-700">{message}</p>}
    </div>
  );
}
