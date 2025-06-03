<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->userid,
            'username' => $this->username,
            'fullName' => $this->fullName,
            'email' => $this->email ?? '',
            'photo' => $this->images ? asset('storage/' . $this->images) : null,
            'kdunit' => $this->kdunit,
            'kdsbidang' => $this->kdsbidang,
            'kdlokasi' => $this->kdlokasi,
            'kdkabkota' => $this->kdkabkota,
            'sub_privilege' => $this->sub_privilege,
            'is_active' => $this->is_active,
            'privilege' => [
                'id' => $this->privilege->kdprivilege ?? null,
                'name' => $this->privilege->nmprivilege ?? 'Tidak ada'
            ],
            'location' => [
                'id_prov' => $this->lokasi->KDLOKASI ?? null,
                'id_kab' => $this->lokasi->KDKABKOTA ?? null,
                'name' => $this->lokasi->NMLOKASI ?? 'Tidak ada',
                'ibukota' => $this->lokasi->IBUKOTA ?? 'Tidak ada',
                'short_name' => $this->lokasi->NMSINGKATLOK ?? 'Tidak ada',
                'verifikator' => $this->lokasi->verifikator ?? 'Tidak ada'
            ],
            'kabupaten' => [
                'id' => $this->kabupaten->KDKABKOTA ?? null,
                'name' => $this->kabupaten->NMKABKOTA ?? 'Tidak ada',
                'ibukota' => $this->kabupaten->IBUKOTAKAB ?? 'Tidak ada'
            ]
        ];
    }
}
