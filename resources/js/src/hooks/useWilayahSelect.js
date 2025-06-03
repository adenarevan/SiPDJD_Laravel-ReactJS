// src/hooks/useWilayahSelect.js
import { useEffect, useState } from "react";
import { webFetch } from "@/utils/webFetch";

export default function useWilayahSelect() {
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [privilege, setPrivilege] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (userData) {
      const p = Number(userData.privilege);
      setPrivilege(p);

      const lokasiList = String(userData.kdlokasi).split(":");
      const kabupaten = String(userData.kdkabkota);
      localStorage.setItem("user_kdlokasi_list", JSON.stringify(lokasiList));

      if (p === 1) {
        setSelectedProvinsi({ value: lokasiList[0] });
        setSelectedKabupaten({ value: kabupaten });
      } else {
        setSelectedProvinsi({ value: lokasiList[0] });
      }
    }
  }, []);

  useEffect(() => {
    webFetch("provinsi").then((res) => {
      if (res.success) {
        let provs = res.data.map((prov) => ({
          value: String(prov.KDLOKASI),
          label: prov.NMLOKASI,
        }));

        if (privilege === 3) {
          const lokasiList = JSON.parse(localStorage.getItem("user_kdlokasi_list") || "[]");
          provs = provs.filter((p) => lokasiList.includes(p.value));
        }

        setProvinsiList(provs);

        if (
          selectedProvinsi &&
          (!selectedProvinsi.label || selectedProvinsi.label === selectedProvinsi.value)
        ) {
          const match = provs.find((p) => p.value === selectedProvinsi.value);
          if (match) setSelectedProvinsi(match);
        }
      }
    });
  }, [privilege, selectedProvinsi]);

  useEffect(() => {
    if (selectedProvinsi) {
      webFetch(`kabkota?kdlokasi=${selectedProvinsi.value}`).then((res) => {
        if (res.success) {
          const kabs = res.data.map((k) => ({
            value: String(k.KDKABKOTA),
            label: k.NMKABKOTA,
          }));

          setKabupatenList(kabs);

          if (
            privilege === 1 &&
            selectedKabupaten &&
            (!selectedKabupaten.label || selectedKabupaten.label === selectedKabupaten.value)
          ) {
            const match = kabs.find((k) => k.value === selectedKabupaten.value);
            if (match) setSelectedKabupaten(match);
          }
        }
      });
    }
  }, [selectedProvinsi, privilege]);

  return {
    provinsiList,
    kabupatenList,
    selectedProvinsi,
    setSelectedProvinsi,
    selectedKabupaten,
    setSelectedKabupaten,
    privilege,
  };
}
