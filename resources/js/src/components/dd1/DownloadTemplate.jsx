import { saveAs } from "file-saver";
import axiosInstance from "@/utils/axiosInstance"; // pastikan path ke axiosInstance kamu benar

export default function DownloadTemplate({ selectedProvinsi, selectedKabupaten }) {
  const handleDownload = async (ext) => {
    if (!selectedProvinsi || !selectedKabupaten) {
      alert("Pilih provinsi dan kabupaten terlebih dahulu.");
      return;
    }

    const provinsiSlug = selectedProvinsi.label.replace(/\s+/g, "_").toUpperCase();
    const fileName = `sk_template_${provinsiSlug}.${ext}`;

    try {
      const response = await axiosInstance.get(`/api/template/sk.${ext}`, {
        params: {
          provinsi: selectedProvinsi.label,
          kabupaten: selectedKabupaten.label,
        },
        responseType: "blob", // ⬅️ Penting untuk file
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      if (blob.size === 0) {
        alert("File yang diunduh kosong.");
        return;
      }

      saveAs(blob, fileName);
    } catch (error) {
      const errMsg = error?.response?.data?.error || error.message || "Gagal mengunduh file.";
      alert(`Gagal mengunduh file: ${errMsg}`);
      console.error(error);
    }
  };

  return (
    <div className="text-center py-10 text-lg text-gray-700">
      <p className="mb-4">📥 Silakan unduh template SK yang disesuaikan dengan provinsi:</p>
      <div className="flex justify-center gap-6">
        <button
          onClick={() => handleDownload("xlsx")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          📄 Unduh Template Excel
        </button>
        <button
          onClick={() => handleDownload("pdf")}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          disabled // ❌ disable karena belum ada endpoint pdf
        >
          📑 Unduh Template PDF
        </button>
      </div>
    </div>
  );
}
