<?php

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'      => $this->id,
            'libelle' => $this->libelle,
            'cl'      => count($this->articles),
            'type'    => $this->type,
            'unite'   => $this->when($this->type === 'confection', UniteResource::make($this->unite)),
            'unites'  => $this->when($this->type === 'confection', UniteResource::collection($this->unites)),
        ];
    }
}