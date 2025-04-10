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
    <div className="flex flex-col min-h-full w-full px-4 pb-6">
<div className="w-full px-4 md:px-10  py-6 text-gray-800">  
   

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Halaman SK</h1>
          <p className="text-lg text-gray-600">Kelola data SK berdasarkan wilayah</p>
          <SelectWilayah
            selectedProvinsi={selectedProvinsi}
            setSelectedProvinsi={setSelectedProvinsi}
            selectedKabupaten={selectedKabupaten}
            setSelectedKabupaten={setSelectedKabupaten}
          />
        </div>

        {selectedProvinsi && selectedKabupaten && (
          <div className="flex flex-col gap-4">
            <div className="bg-white shadow-md rounded-lg p-4 flex flex-wrap gap-4 overflow-x-auto">
              {[{ key: "lihat", icon: <FiFileText />, label: "Lihat File" },
                { key: "upload", icon: <FiUploadCloud />, label: "Upload File" },
                { key: "template", icon: <FiDownload />, label: "Download Template" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`flex items-center gap-2 px-6 py-3 text-base font-bold transition-all border-b-4 whitespace-nowrap ${
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

            <div className="bg-white shadow-md rounded-lg p-6">
              {activeTab === "lihat" && (
                <LihatSk selectedProvinsi={selectedProvinsi} selectedKabupaten={selectedKabupaten} />
              )}
              {activeTab === "upload" && (
                <UploadSk provinsi={selectedProvinsi} kabupaten={selectedKabupaten} />
              )}
              {activeTab === "template" && <DownloadTemplate />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
