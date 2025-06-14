<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DokumenSkResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'kdsatker' => $this->kdsatker,
            'kdlokasi' => $this->kdlokasi,
            'nmlokasi' => optional($this->lokasi)->nmlokasi,
            'kdkabkota' => $this->kdkabkota,
            'nmkabkota' => optional($this->kabupaten)->nmkabkota,
            'tglUpload' => $this->tglUpload,
            'nomor' => $this->nomor,
           'file_excel' => asset("storage/formsk/{$this->kdsatker}/{$this->fileName}"),
            'file_pdf' => asset("storage/formsk/{$this->kdsatker}/{$this->filePDF}"),

            'verifikasi' => $this->verifikasi,
            'verifikasibalai' => $this->verifikasibalai,
            'keterangan' => $this->keterangan,
            'keteranganbalai' => $this->keteranganbalai,
            'tglVerifikasi' => $this->tglVerifikasi,
            'tanggalVerifikasiBalai' => $this->tanggalVerifikasiBalai,
            'userVerifikator' => $this->userVerifikator,
            'kemantapanTahunLalu' => $this->kemantapanTahunLalu,
            'userid' => $this->userid,
        ];
    }
}
