<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RuasJalanResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'kdruas' => $this->kdruas,
            'tglcreate' => $this->tglcreate,
            'tglupdate' => $this->tglupdate,
            'kdlokasi' => $this->kdlokasi,
            'kdkabkota' => $this->kdkabkota,
            'nomor_ruas' => $this->nomorruas,
            'nama_ruas' => $this->nmruas,
            'kecamatan' => $this->kecdilalui,
            'panjang' => $this->panjang,
            'lebar' => $this->lebar,
            'userid' => $this->userid,
        ];
    }
}
