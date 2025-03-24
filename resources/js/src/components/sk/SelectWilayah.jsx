import { useEffect, useState } from "react";
import Select from "react-select";
import { apiFetch } from "@/utils/api";

export default function SelectWilayah({
  selectedProvinsi,
  setSelectedProvinsi,
  selectedKabupaten,
  setSelectedKabupaten,
}) {
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [privilege, setPrivilege] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (userData) {
      setPrivilege(Number(userData.privilege));
  
      if (Number(userData.privilege) !== 9) {
        setSelectedProvinsi({
          value: String(userData.kdlokasi),
          label: "Loading...",
        });
  
        setSelectedKabupaten({
          value: String(userData.kdkabkota),
          label: "Loading...",
        });
  
        localStorage.setItem("user_kabupaten", String(userData.kdkabkota));
      }
    }
  }, []);
  

  useEffect(() => {
    apiFetch("provinsi").then((data) => {
      if (data.success) {
        const provs = data.data.map((prov) => ({
          value: String(prov.KDLOKASI),
          label: prov.NMLOKASI,
        }));
        setProvinsiList(provs);

        // Update label provinsi jika privilege bukan 9
        if (privilege !== 9 && selectedProvinsi?.label === "Loading...") {
          const prov = provs.find((p) => p.value === selectedProvinsi.value);
          if (prov) setSelectedProvinsi(prov);
        }
      }
    });
  }, [privilege]);

  useEffect(() => {
    if (selectedProvinsi) {
      apiFetch(`kabkota?kdlokasi=${selectedProvinsi.value}`).then((data) => {
        if (data.success) {
          const mappedKab = data.data.map((kab) => ({
            value: String(kab.KDKABKOTA),
            label: kab.NMKABKOTA,
          }));
          setKabupatenList(mappedKab);
  
          // 🔥 Update label kabupaten jika user bukan admin dan label-nya masih loading
          if (privilege !== 9 && selectedKabupaten?.label === "Loading...") {
            const foundKab = mappedKab.find((k) => k.value === selectedKabupaten.value);
            if (foundKab) {
              setSelectedKabupaten(foundKab); // ⬅️ Ganti dengan label dari API
            }
          }
        }
      });
    }
  }, [selectedProvinsi, privilege]);
  
  

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-[90rem] mx-auto">

      <h1 className="text-3xl font-bold text-gray-800">Halaman SK</h1>
      <p className="text-lg text-gray-600">Kelola data SK berdasarkan wilayah</p>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        <div className="w-full md:w-1/2">
          <label className="block text-lg font-semibold text-gray-700">Provinsi:</label>
          <Select
            value={selectedProvinsi}
            onChange={setSelectedProvinsi}
            options={provinsiList}
            placeholder="Pilih Provinsi"
            isDisabled={privilege !== 9}
          />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block text-lg font-semibold text-gray-700">Kabupaten/Kota:</label>
          <Select
            value={selectedKabupaten}
            onChange={setSelectedKabupaten}
            options={kabupatenList}
            placeholder="Pilih Kabupaten/Kota"
            isDisabled={!selectedProvinsi || privilege !== 9}
          />
        </div>
      </div>
    </div>
  );
}
