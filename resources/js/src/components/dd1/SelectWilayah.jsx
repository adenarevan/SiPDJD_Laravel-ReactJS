import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { useAuth } from "@/context/AuthContext";
import { webFetch } from "@/utils/webFetch";

export default function SelectWilayah({
  selectedProvinsi,
  setSelectedProvinsi,
  selectedKabupaten,
  setSelectedKabupaten,
}) {
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const { user } = useAuth();

  const privilege = user?.privilege;
  const lokasiList = useMemo(() => user?.kdlokasi?.split(":") || [], [user?.kdlokasi]);
  const userKabupaten = user?.kdkabkota || null;

  // Ambil data provinsi
  useEffect(() => {
    if (!privilege) return;

    webFetch("provinsi").then((data) => {
      if (data.success) {
        let provs = data.data.map((prov) => ({
          value: String(prov.KDLOKASI),
          label: prov.NMLOKASI,
        }));

        if (privilege === 3) {
          provs = provs.filter((p) => lokasiList.includes(p.value));
        }

        setProvinsiList(provs);

        if ((privilege === 1 || privilege === 3) && lokasiList.length > 0) {
          const selected = provs.find((p) => p.value === lokasiList[0]);
          if (selected) {
            setSelectedProvinsi(selected);
          }
        }
      }
    });
  }, [privilege, lokasiList, setSelectedProvinsi]);

  // Ambil data kabupaten saat provinsi berubah
  useEffect(() => {
    if (!selectedProvinsi) return;

    webFetch(`kabkota?kdlokasi=${selectedProvinsi.value}`).then((data) => {
      if (data.success) {
        const mapped = data.data.map((kab) => ({
          value: String(kab.KDKABKOTA),
          label: kab.NMKABKOTA,
        }));

        setKabupatenList(mapped);

        if ((privilege === 1 || privilege === 3) && userKabupaten) {
          const selected = mapped.find((k) => k.value === userKabupaten);
          if (selected) {
            setSelectedKabupaten(selected);
          }
        }
      }
    });
  }, [selectedProvinsi, privilege, userKabupaten, setSelectedKabupaten]);

  return (
    <div className="mt-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2">
        <label className="block text-lg font-semibold text-gray-700">Provinsi:</label>
        <Select
          value={selectedProvinsi}
          onChange={setSelectedProvinsi}
          options={provinsiList}
          placeholder="Pilih Provinsi"
          isDisabled={privilege === 1}
        />
      </div>
      <div className="w-full md:w-1/2">
        <label className="block text-lg font-semibold text-gray-700">Kabupaten/Kota:</label>
<Select
  value={selectedKabupaten}
  onChange={setSelectedKabupaten}
  options={kabupatenList}
  placeholder="Pilih Kabupaten/Kota"
  isDisabled={privilege === 1 || !selectedProvinsi}
  menuPortalTarget={document.body}
  styles={{
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999, position: "absolute" }),
    control: (base) => ({ ...base, zIndex: 1 }), // opsional, supaya input-nya gak ketiban
  }}
/>

      </div>
    </div>
  );
}
