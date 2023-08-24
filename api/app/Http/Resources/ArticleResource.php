<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     */
    public function toArray(Request $request)
    {
        return [
            'id'           => $this->id,
            'libelle'      => $this->libelle,
            'ref'          => $this->ref,
            'prix'         => $this->prix,
            'stock'        => $this->stock,
            'fournisseurs' => FournisseurResource::collection($this->fournisseurs),
            'category'     => CategoryResource::make($this->category),
            'photo'        => $this->photo
        ];
    }
}
