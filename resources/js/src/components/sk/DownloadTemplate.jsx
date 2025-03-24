export default function DownloadTemplate() {
    return (
      <div className="text-center py-10 text-lg text-gray-700">
        <p className="mb-4">📥 Silakan unduh template SK dalam format yang tersedia:</p>
        <div className="flex justify-center gap-6">
          <a
            href="/template/sk_template.xlsx"
            download
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            📄 Unduh Template Excel
          </a>
          <a
            href="/template/sk_template.pdf"
            download
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            📑 Unduh Template PDF
          </a>
        </div>
      </div>
    );
  }
  