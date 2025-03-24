
import { useState } from "react";
import { FiFileText, FiUploadCloud, FiDownload } from "react-icons/fi";
import SelectWilayah from "../components/sk/SelectWilayah";
import LihatSk from "../components/sk/LihatSk";
import UploadSk from "../components/sk/UploadSk";
import DownloadTemplate from "../components/sk/DownloadTemplate";
export default function SkPage() {
  const [activeTab, setActiveTab] = useState("lihat");
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);

  return (
    <div className="flex-1 flex flex-col min-h-full"> {/* ✅ Tambah min-h-full */}
      {/* Card wilayah */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Halaman SK</h1>
        <p className="text-lg text-gray-600 mb-4">Kelola data SK berdasarkan wilayah</p>
        <SelectWilayah
          selectedProvinsi={selectedProvinsi}
          setSelectedProvinsi={setSelectedProvinsi}
          selectedKabupaten={selectedKabupaten}
          setSelectedKabupaten={setSelectedKabupaten}
        />
      </div>

      {/* Konten bawah */}
      {selectedProvinsi && selectedKabupaten && (
        <div className="flex-1 flex flex-col"> {/* ini penting */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full flex gap-4">
            {[{ key: "lihat", icon: <FiFileText />, label: "Lihat File" },
              { key: "upload", icon: <FiUploadCloud />, label: "Upload File" },
              { key: "template", icon: <FiDownload />, label: "Download Template" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`flex items-center gap-2 px-6 py-3 text-base font-bold transition-all border-b-4 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-600"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* 🔥 Ini yang ngedorong layout ke bawah */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full flex-1">

            {activeTab === "lihat" && (
              <LihatSk provinsi={selectedProvinsi} kabupaten={selectedKabupaten} />
            )}
            {activeTab === "upload" && (
              <UploadSk provinsi={selectedProvinsi} kabupaten={selectedKabupaten} />
            )}
            {activeTab === "template" && <DownloadTemplate />}
          </div>
        </div>
      )}
    </div>
  );
}
