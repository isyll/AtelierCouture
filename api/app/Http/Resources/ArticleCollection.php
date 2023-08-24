<?php

namespace App\Http\Resources;

use App\Models\Category;
use App\Models\Fournisseur;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ArticleCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */

    private $pagination;

    public function __construct($resource, private $all = true)
    {
        $this->pagination = [
            'total'        => $resource->total(),
            'per_page'     => $resource->perPage(),
            'current_page' => $resource->currentPage(),
            'last_page'    => $resource->lastPage()
        ];

        $resource = $resource->getCollection();

        parent::__construct($resource);
    }

    public function toArray($request)
    {
        $data = [
            'data'       => $this->collection,
            'pagination' => $this->pagination,
        ];

        if ($this->all) {
            $data['categories']   = CategoryResource::collection(Category::all());
            $data['fournisseurs'] = FournisseurResource::collection(Fournisseur::all());
        }

        return $data;
    }
}