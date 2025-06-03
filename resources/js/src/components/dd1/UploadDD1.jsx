import { useState } from "react";
import { webFetch } from "@/utils/webFetch";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function UploadDd1({ selectedProvinsi, selectedKabupaten }) {
  const { user } = useAuth();
  const [excelFile, setExcelFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!excelFile || !pdfFile) {
      toast.error("❌ Kedua file harus dipilih!");
      return;
    }

    const kdlokasi = selectedProvinsi?.value ?? user?.kdlokasi;
    const kdkabkota = selectedKabupaten?.value ?? user?.kdkabkota;
    const kdsbidang = user?.kdsbidang ?? "01";

    if (!kdlokasi || !kdkabkota) {
      toast.error("❌ Lokasi tidak valid.");
      return;
    }

    const formData = new FormData();
    formData.append("file_excel", excelFile);
    formData.append("file_pdf", pdfFile);
    formData.append("kdlokasi", kdlokasi);
    formData.append("kdkabkota", kdkabkota);
    formData.append("kdsbidang", kdsbidang);

    setLoading(true);

    try {
      const res = await webFetch("upload-dd1", {
        method: "POST",
        body: formData,
      });

      if (res.success) {
        toast.success("✅ Upload DD1 berhasil!");
        setExcelFile(null);
        setPdfFile(null);
        document.getElementById("file_excel_dd1").value = "";
        document.getElementById("file_pdf_dd1").value = "";
      } else {
        toast.error(res.message || "❌ Gagal upload.");
      }
    } catch (err) {
      toast.error("❌ Upload gagal total.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-[300px] justify-between space-y-6">
      <div>
        <label className="block font-semibold mb-1">📈 File Excel DD1:</label>
        <input
          id="file_excel_dd1"
          type="file"
          accept=".xls,.xlsx"
          onChange={(e) => setExcelFile(e.target.files[0])}
          disabled={loading}
          className="block w-full border border-gray-300 rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {excelFile && (
          <div className="mt-2 text-sm text-gray-700">
            📊 <strong>{excelFile.name}</strong> ({(excelFile.size / 1024).toFixed(1)} KB)
            <button
              type="button"
              onClick={() => setExcelFile(null)}
              className="ml-3 text-red-500 underline hover:text-red-700"
            >
              ❌ Hapus
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">📄 File PDF DD1:</label>
        <input
          id="file_pdf_dd1"
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          disabled={loading}
          className="block w-full border border-gray-300 rounded px-4 py-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {pdfFile && (
          <div className="mt-2 text-sm text-gray-700">
            📄 <strong>{pdfFile.name}</strong> ({(pdfFile.size / 1024).toFixed(1)} KB)
            <button
              type="button"
              onClick={() => setPdfFile(null)}
              className="ml-3 text-red-500 underline hover:text-red-700"
            >
              ❌ Hapus
            </button>
          </div>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition duration-150 ease-in-out ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Mengupload...</span>
            </>
          ) : (
            <span>📤 Upload File</span>
          )}
        </button>
      </div>
    </div>
  );
}
