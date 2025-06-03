<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Dd1RuasjalanResources extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'kdlokasi' => $this->kdlokasi,
            'kdkabkota' => $this->kdkabkota,
            'nomorruas' => $this->nomorruas,
            'nmruas' => $this->nmruas,
            'kecdilalui' => $this->kecdilalui,
            'panjang' => $this->panjang,
            'lebar' => $this->lebar,
            'hotmix' => $this->hotmix,
            'aspal' => $this->aspal,
            'beton' => $this->beton,
            'kerikil' => $this->kerikil,
            'tanah' => $this->tanah,
            'baik' => $this->baik,
            'baikper' => $this->baikper,
            'sedang' => $this->sedang,
            'sedangper' => $this->sedangper,
            'rusakringan' => $this->rusakringan,
            'rusakringanper' => $this->rusakringanper,
            'rusakberat' => $this->rusakberat,
            'rusakberatper' => $this->rusakberatper,
            'lhr' => $this->lhr,
            'akses' => $this->akses,
            'keterangan' => $this->keterangan
        ];
    }
}
