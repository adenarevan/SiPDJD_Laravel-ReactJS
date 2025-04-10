import { useEffect, useState } from "react";
import Select from "react-select";
import { apiFetch } from "@/utils/api";
import { webFetch } from "@/utils/webFetch";

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
        setSelectedProvinsi({ value: String(userData.kdlokasi), label: "Loading..." });
        setSelectedKabupaten({ value: String(userData.kdkabkota), label: "Loading..." });
        localStorage.setItem("user_kabupaten", String(userData.kdkabkota));
      }
    }
  }, []);

  useEffect(() => {
    webFetch("provinsi").then((data) => {
      if (data.success) {
        const provs = data.data.map((prov) => ({
          value: String(prov.KDLOKASI),
          label: prov.NMLOKASI,
        }));
        setProvinsiList(provs);

        if (privilege !== 9 && selectedProvinsi?.label === "Loading...") {
          const prov = provs.find((p) => p.value === selectedProvinsi.value);
          if (prov) setSelectedProvinsi(prov);
        }
      }
    });
  }, [privilege]);

  useEffect(() => {
    if (selectedProvinsi) {
      webFetch(`kabkota?kdlokasi=${selectedProvinsi.value}`).then((data) => {
        if (data.success) {
          const mappedKab = data.data.map((kab) => ({
            value: String(kab.KDKABKOTA),
            label: kab.NMKABKOTA,
          }));
          setKabupatenList(mappedKab);

          if (privilege !== 9 && selectedKabupaten?.label === "Loading...") {
            const foundKab = mappedKab.find((k) => k.value === selectedKabupaten.value);
            if (foundKab) {
              setSelectedKabupaten(foundKab);
            }
          }
        }
      });
    }
  }, [selectedProvinsi, privilege]);

  return (
    <div className="mt-6 flex flex-col md:flex-row gap-6">
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
  );
}
