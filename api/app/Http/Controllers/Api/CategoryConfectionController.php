<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCategoryConfectionRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryConfectionController extends Controller
{
    public function create(CreateCategoryConfectionRequest $request)
    {
        $validated = $request->validated();

        $category = Category::create($validated);
        return [
            'message' => 'Création réussie',
            'data'    => CategoryResource::make($category)
        ];
    }
}