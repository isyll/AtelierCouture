<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCategoryConfectionRequest;
use App\Http\Requests\UpdateCategoryConfectionRequest;
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

    public function update(UpdateCategoryConfectionRequest $request, int $category)
    {
        $validated = $request->validated();

        $category = Category::find($category);

        if ($category) {
            if ($category->type === 'confection') {
                $category->fill($validated);
                $category->save();

                if (isset($validated['unites']))
                    $category->unites()->sync($validated['unites']);

                return [
                    'message' => 'Mise à jour réussie',
                    'data'    => CategoryResource::make($category)
                ];
            } else return response()->json([
                    'message' => "La catégorie n'est pas de type confection"
                ], 422);

        } else
            return response()->json([
                'message' => "La catégorie n'existe pas"
            ], 422);
    }
}